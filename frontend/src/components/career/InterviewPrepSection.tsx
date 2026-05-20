"use client";

import { useEffect, useState } from "react";
import { getCompanies, getInterviewPrep } from "@/lib/api";
import type { InterviewPrepResult, CompanyOption } from "@/types/career";
import { Mic, ListChecks, MessageSquare, Code } from "lucide-react";

export default function InterviewPrepSection() {
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [companyId, setCompanyId] = useState("mba-general");
  const [skills, setSkills] = useState("Communication, Excel, SQL, Leadership");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState<InterviewPrepResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCompanies().then(setCompanies).catch(() => {});
  }, []);

  const prep = async () => {
    setLoading(true);
    try {
      setResult(
        await getInterviewPrep({
          company_id: companyId,
          user_skills: skills,
          resume_text: resume,
        })
      );
    } catch {
      alert("Interview prep API unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Mic className="text-accent" /> Interview Preparation Hub
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          HR questions, technical Qs, GD practice topics, and day-before checklist — tailored to company & skills.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <select
            className="rounded-lg border px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="rounded-lg border px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Your skills..."
          />
        </div>
        <textarea
          className="mt-3 h-24 w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          placeholder="Optional: paste resume for personalized questions"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
        <button
          type="button"
          onClick={prep}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-accent py-3 font-bold text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Interview Prep Plan"}
        </button>
      </div>

      {result && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <p className="text-center text-sm">Prep for</p>
            <p className="text-center text-2xl font-bold">{result.company}</p>
            <p className="text-center text-sm text-slate-500">Profile match: {result.match_percentage}%</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold">
              <MessageSquare className="h-5 w-5 text-accent" /> HR Questions
            </h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
              {result.hr_questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold">
              <Code className="h-5 w-5 text-campus-600" /> Technical / Domain
            </h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
              {result.technical_questions.map((q) => (
                <li key={q}>{q.replace(/\*\*/g, "")}</li>
              ))}
            </ol>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold">GD Preparation</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {result.gd_preparation.map((g) => (
                <li key={g}>• {g}</li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold">
              <ListChecks className="h-5 w-5 text-green-600" /> Checklist
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {result.interview_checklist.map((c) => (
                <li key={c}>✓ {c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
