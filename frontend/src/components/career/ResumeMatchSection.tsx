"use client";

import { useEffect, useState } from "react";
import { getCompanies, matchResume } from "@/lib/api";
import type { ResumeMatchResult, CompanyOption } from "@/types/career";
import { Upload, Target, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ResumeMatchSection() {
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [companyId, setCompanyId] = useState("mba-general");
  const [skills, setSkills] = useState("Excel, SQL, Communication, Python, Leadership, MBA");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState<ResumeMatchResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCompanies().then(setCompanies).catch(() =>
      setCompanies([
        { id: "mba-general", name: "General MBA Placement" },
        { id: "tcs-software", name: "TCS / Infosys — Software Engineer" },
        { id: "deloitte-analyst", name: "Deloitte / EY — Business Analyst" },
      ])
    );
  }, []);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setResume(String(reader.result || ""));
    reader.readAsText(file);
  };

  const analyze = async () => {
    setLoading(true);
    try {
      const data = await matchResume({
        resume_text: resume,
        user_skills: skills,
        company_id: companyId,
      });
      setResult(data);
    } catch {
      setResult(null);
      alert("API error — start gateway (4000) + AI service (5002)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Target className="text-accent" /> Resume + Skills → Company Match
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Upload resume, enter skills, select company — we match requirements, detect gaps, and show GD focus.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Target Company / Role</span>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Your Skills (comma separated)</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Java, SQL, Excel, Communication..."
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-semibold">Resume Text / Paste</span>
          <textarea
            className="mt-1 h-36 w-full rounded-lg border px-3 py-2 font-mono text-sm dark:border-slate-600 dark:bg-slate-800"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste resume OR upload .txt file below..."
          />
        </label>

        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent/5">
          <Upload className="h-4 w-4" />
          Upload Resume (.txt)
          <input type="file" accept=".txt,.md,.csv" className="hidden" onChange={onFile} />
        </label>

        <button
          type="button"
          onClick={analyze}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-accent py-3 font-bold text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Match with Company Requirements"}
        </button>
      </div>

      {result && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-sm text-slate-500">Match Score</p>
            <p className="text-5xl font-black text-accent">{result.match_percentage}%</p>
            <p className="mt-2 font-semibold">{result.company}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{result.verdict}</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="font-bold text-green-600 dark:text-green-400">
              <CheckCircle2 className="mr-1 inline h-4 w-4" />
              Matched Skills
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.matched_skills.map((s) => (
                <span key={s} className="rounded-full bg-green-100 px-3 py-1 text-xs dark:bg-green-900/40">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <p className="font-bold text-amber-600 dark:text-amber-400">
              <AlertTriangle className="mr-1 inline h-4 w-4" />
              Skill Gaps Detected
            </p>
            <div className="mt-4 space-y-3">
              {result.skill_gaps.length === 0 ? (
                <p className="text-sm text-green-600">No major gaps — great fit!</p>
              ) : (
                result.skill_gaps.map((g) => (
                  <div
                    key={g.skill}
                    className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-900/20"
                  >
                    <p className="font-semibold">
                      {g.skill}{" "}
                      <span className="text-xs text-amber-700 dark:text-amber-300">({g.severity})</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{g.recommendation}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="font-bold">GD Topics to Prepare</p>
            <ul className="mt-2 list-inside list-disc text-sm text-slate-700 dark:text-slate-300">
              {result.gd_topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="font-bold">Interview Focus</p>
            <ul className="mt-2 list-inside list-disc text-sm text-slate-700 dark:text-slate-300">
              {result.interview_focus.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
