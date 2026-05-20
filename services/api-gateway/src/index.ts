import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { join } from "path";
import { fallbackResumeMatch, fallbackResumeScore } from "./resumeFallback";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || process.env.GATEWAY_PORT || 4000);
const ML_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";
const AI_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:5002";
const AUTH_URL = process.env.AUTH_SERVICE_URL || "http://127.0.0.1:8081";

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());

const ChatSchema = new mongoose.Schema({
  message: String,
  reply: String,
  mode: String,
  createdAt: { type: Date, default: Date.now },
});
const PredictionSchema = new mongoose.Schema({
  input: Object,
  output: Object,
  createdAt: { type: Date, default: Date.now },
});
let ChatLog: mongoose.Model<any>;
let PredictionLog: mongoose.Model<any>;

function loadKnowledgeSnippet(): string {
  const paths = [join(__dirname, "../../../data/knowledge/placement_guide.md")];
  for (const p of paths) {
    try {
      return readFileSync(p, "utf-8").slice(0, 1500);
    } catch {
      /* try next */
    }
  }
  return "Focus on MBA %, e-test score, and work experience for better campus packages.";
}

function gatewayFallbackChat(message: string, profile?: Record<string, unknown>) {
  const ctx = loadKnowledgeSnippet();
  const profileLine = profile ? `\n\nProfile: ${JSON.stringify(profile)}` : "";
  return {
    reply: `**CampusAI Coach** (Gateway fallback — start AI service on port 5002 for full RAG)\n\n**You asked:** ${message}\n\n**From placement guide:**\n${ctx}${profileLine}\n\n**Quick tips:** Target MBA 65%+, e-test 75%+, add work experience.`,
    mode: "gateway-fallback",
    sources: 1,
  };
}

async function connectMongo() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/campus_ai";
  try {
    await mongoose.connect(uri);
    ChatLog = mongoose.model("ChatLog", ChatSchema);
    PredictionLog = mongoose.model("PredictionLog", PredictionSchema);
    console.log("MongoDB connected");
  } catch {
    console.warn("MongoDB unavailable — logging disabled");
  }
}

app.get("/health", async (_req, res) => {
  const checks: Record<string, string> = { gateway: "ok" };
  for (const [name, url] of [["ml", ML_URL], ["ai", AI_URL], ["auth", AUTH_URL]] as const) {
    try {
      await axios.get(`${url}/health`, { timeout: 2000 });
      checks[name] = "ok";
    } catch {
      checks[name] = "down";
    }
  }
  res.json({ service: "api-gateway", checks });
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { data } = await axios.post(`${AUTH_URL}/api/auth/login`, req.body);
    res.json(data);
  } catch {
    res.json({
      token: "demo-campus-token",
      user: { email: req.body?.email || "student@campus.edu", role: "student" },
      note: "Auth service offline — demo mode",
    });
  }
});

app.post("/api/predict", async (req, res) => {
  try {
    const { data } = await axios.post(`${ML_URL}/predict`, req.body);
    if (PredictionLog) await PredictionLog.create({ input: req.body, output: data });
    res.json(data);
  } catch (e: any) {
    res.status(e.response?.status || 503).json({
      error: e.response?.data?.detail || e.message || "ML service unavailable",
    });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_URL}/chat`, {
      message: req.body.message,
      profile: req.body.profile,
    }, { timeout: 30000 });
    if (ChatLog) await ChatLog.create({ message: req.body.message, reply: data.reply, mode: data.mode });
    res.json(data);
  } catch (e: any) {
    console.warn("AI service down, using gateway fallback:", e.message);
    const fallback = gatewayFallbackChat(req.body.message || "", req.body.profile);
    if (ChatLog) await ChatLog.create({ message: req.body.message, reply: fallback.reply, mode: fallback.mode });
    res.json(fallback);
  }
});

app.post("/api/agent/plan", async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_URL}/agent/plan`, req.body, { timeout: 30000 });
    res.json(data);
  } catch {
    const profile = req.body.profile || {};
    const mba = Number(profile.mba_p) || 0;
    const score = Math.min(100, 40 + (mba >= 65 ? 25 : mba >= 55 ? 12 : 0));
    res.json({
      goal: req.body.goal || "Career plan",
      readiness_score: score,
      action_plan: gatewayFallbackChat(req.body.goal || "placement plan", profile).reply,
      agent_steps: [{ step: "fallback", detail: "AI service offline — gateway responded" }],
      mode: "gateway-fallback",
    });
  }
});

app.get("/api/companies", async (_req, res) => {
  try {
    const { data } = await axios.get(`${AI_URL}/companies`, { timeout: 5000 });
    res.json(data);
  } catch {
    res.json({
      companies: Object.entries({
        "tcs-software": "TCS / Infosys — Software Engineer",
        "deloitte-analyst": "Deloitte / EY — Business Analyst",
        "finance-analyst": "Finance Analyst (Mkt&Fin)",
        "product-analyst": "Product Analyst",
        "mba-general": "General MBA Placement",
      }).map(([id, name]) => ({ id, name })),
    });
  }
});

app.post("/api/resume/match", async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_URL}/resume/match`, req.body, { timeout: 30000 });
    res.json(data);
  } catch {
    res.json(
      fallbackResumeMatch(
        req.body.resume_text || "",
        req.body.user_skills || "",
        req.body.company_id || "mba-general"
      )
    );
  }
});

app.post("/api/resume/score", async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_URL}/resume/score`, req.body, { timeout: 30000 });
    res.json(data);
  } catch {
    res.json(fallbackResumeScore(req.body.resume_text || "", req.body.user_skills || ""));
  }
});

app.post("/api/interview/prep", async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_URL}/interview/prep`, req.body, { timeout: 30000 });
    res.json(data);
  } catch {
    const match = fallbackResumeMatch(
      req.body.resume_text || "",
      req.body.user_skills || "",
      req.body.company_id || "mba-general"
    );
    res.json({
      company: match.company,
      match_percentage: match.match_percentage,
      hr_questions: [
        "Tell me about yourself.",
        "Why this company?",
        "Strengths and weaknesses?",
      ],
      technical_questions: ["Explain a project from your resume.", "Domain basics for your role."],
      gd_preparation: match.gd_topics.map((t: string) => `GD topic: ${t}`),
      interview_checklist: ["Mock PI", "Research company", "Prepare STAR stories"],
      focus_areas: match.interview_focus,
      mode: "gateway-fallback",
    });
  }
});

app.get("/api/analytics", (_req, res) => {
  try {
    const csvPath = join(__dirname, "../../../data/train.csv");
    const alt = join(__dirname, "../../../train.csv");
    let raw: string;
    try {
      raw = readFileSync(csvPath, "utf-8");
    } catch {
      raw = readFileSync(alt, "utf-8");
    }
    const lines = raw.trim().split("\n").slice(1);
    const salaries = lines
      .map((l) => parseFloat(l.split(",").pop() || "0"))
      .filter((s) => s > 0);
    const placed = lines.filter((l) => l.includes("Placed")).length;
    res.json({
      total_students: lines.length,
      placed_count: placed,
      placement_rate: Math.round((placed / lines.length) * 100),
      avg_salary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
      max_salary: Math.max(...salaries),
      min_salary: Math.min(...salaries),
    });
  } catch {
    res.json({
      total_students: 215,
      placed_count: 148,
      placement_rate: 69,
      avg_salary: 288000,
      max_salary: 940000,
      min_salary: 200000,
    });
  }
});

connectMongo().then(() => {
  app.listen(PORT, () => console.log(`API Gateway → http://127.0.0.1:${PORT}`));
});
