import { Bot, Database, LineChart, Shield, Zap, Layers, FileText, Link2 } from "lucide-react";

const features = [
  { icon: LineChart, title: "ML Salary Prediction", desc: "Ridge regression on 215 MBA records with StandardScaler pipeline." },
  { icon: Bot, title: "RAG Career Coach", desc: "LangChain + Chroma vector DB + OpenAI for placement Q&A." },
  { icon: FileText, title: "Resume & Interview Hub", desc: "Upload resume, company match, skill gaps, scoring, GD & PI prep." },
  { icon: Link2, title: "Coding Profiles", desc: "GitHub, LinkedIn, HackerRank, LeetCode, GFG — save & open all links." },
  { icon: Zap, title: "AI Agents", desc: "Multi-step career planning with readiness scoring." },
  { icon: Layers, title: "Microservices", desc: "Next.js, Node gateway, Python ML/AI, Spring auth." },
  { icon: Database, title: "MongoDB Logs", desc: "Chat & prediction history in document store." },
  { icon: Shield, title: "DevOps Ready", desc: "Docker Compose, GitHub CI/CD, AWS-ready architecture." },
];

export default function Features() {
  return (
    <section id="features" className="section-pad">
      <h2 className="text-center text-3xl font-bold text-white">Platform Features</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-slate-400">
        Enterprise-grade campus recruitment stack built for college AI competitions.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6 transition hover:-translate-y-1">
            <f.icon className="h-10 w-10 text-campus-600" />
            <h3 className="mt-4 text-lg font-bold text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
