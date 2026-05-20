import axios from "axios";
import type { PredictPayload, PredictResult, Analytics, ChatResponse, AgentPlan } from "@/types";
import type {
  CompanyOption,
  ResumeMatchResult,
  ResumeScoreResult,
  InterviewPrepResult,
} from "@/types/career";

/** Vercel: empty = same-origin /api proxy. Local/Docker: set NEXT_PUBLIC_API_URL */
const API =
  process.env.NEXT_PUBLIC_API_URL !== undefined && process.env.NEXT_PUBLIC_API_URL !== ""
    ? process.env.NEXT_PUBLIC_API_URL
    : typeof window !== "undefined"
      ? ""
      : process.env.BACKEND_URL || "http://127.0.0.1:4000";

const client = axios.create({ baseURL: API, timeout: 60000 });

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.error ?? err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((d) => d.msg ?? d).join(", ");
    return err.response?.status === 400
      ? "Invalid profile data — check all fields and restart ML service (5001)."
      : `API error ${err.response?.status ?? ""}: ${err.message}`;
  }
  return err instanceof Error ? err.message : "Request failed";
}

export async function predictSalary(payload: PredictPayload): Promise<PredictResult> {
  const { data } = await client.post<PredictResult>("/api/predict", payload);
  return data;
}

export async function chatWithAI(message: string, profile?: Record<string, unknown>): Promise<ChatResponse> {
  const { data } = await client.post<ChatResponse>("/api/chat", { message, profile });
  return data;
}

export async function runAgent(goal: string, profile: Record<string, unknown>): Promise<AgentPlan> {
  const { data } = await client.post<AgentPlan>("/api/agent/plan", { goal, profile });
  return data;
}

export async function getAnalytics(): Promise<Analytics> {
  const { data } = await client.get<Analytics>("/api/analytics");
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await client.post("/api/auth/login", { email, password });
  return data;
}

export async function getCompanies(): Promise<CompanyOption[]> {
  const { data } = await client.get<{ companies: CompanyOption[] }>("/api/companies");
  return data.companies;
}

export async function matchResume(payload: {
  resume_text: string;
  user_skills: string;
  company_id: string;
}): Promise<ResumeMatchResult> {
  const { data } = await client.post<ResumeMatchResult>("/api/resume/match", payload);
  return data;
}

export async function scoreResume(payload: {
  resume_text: string;
  user_skills: string;
}): Promise<ResumeScoreResult> {
  const { data } = await client.post<ResumeScoreResult>("/api/resume/score", payload);
  return data;
}

export async function getInterviewPrep(payload: {
  company_id: string;
  user_skills: string;
  resume_text: string;
}): Promise<InterviewPrepResult> {
  const { data } = await client.post<InterviewPrepResult>("/api/interview/prep", payload);
  return data;
}
