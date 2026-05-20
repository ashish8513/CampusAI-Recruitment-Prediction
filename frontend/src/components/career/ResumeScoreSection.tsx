"use client";

import { useState } from "react";
import { scoreResume } from "@/lib/api";
import type { ResumeScoreResult } from "@/types/career";
import { FileCheck, Upload } from "lucide-react";

export default function ResumeScoreSection() {
  const [resume, setResume] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState<ResumeScoreResult | null>(null);
  const [loading, setLoading] = useState(false);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setResume(String(reader.result || ""));
    reader.readAsText(file);
  };

  const score = async () => {
    setLoading(true);
    try {
      setResult(await scoreResume({ resume_text: resume, user_skills: skills }));
    } catch {
      alert("Could not score — check API services.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <FileCheck className="text-campus-600" /> AI Resume Scoring
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Scores: Education, Skills, Experience, Projects, Format — with grade and improvements.
        </p>
        <textarea
          className="mt-4 h-32 w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          placeholder="Paste resume content..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
        <input
          className="mt-3 w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          placeholder="Skills (optional, comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm text-accent">
          <Upload className="h-4 w-4" /> Upload .txt
          <input type="file" accept=".txt,.md" className="hidden" onChange={onFile} />
        </label>
        <button
          type="button"
          onClick={score}
          disabled={loading || !resume.trim()}
          className="mt-4 w-full rounded-xl bg-campus-600 py-3 font-bold text-white hover:bg-campus-700 disabled:opacity-50"
        >
          {loading ? "Scoring..." : "Score My Resume"}
        </button>
      </div>

      {result && (
        <>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-sm text-slate-500">Overall Resume Score</p>
            <p className="text-6xl font-black text-accent">{result.overall_score}</p>
            <p className="mt-2 text-xl font-bold text-campus-700 dark:text-campus-100">{result.grade}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(result.categories).map(([key, cat]) => (
              <div key={key} className="glass rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="font-semibold">{cat.label}</span>
                  <span className="font-bold text-accent">{cat.score}/100</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-2 rounded-full bg-accent"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">{cat.feedback}</p>
              </div>
            ))}
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="font-bold">Improvements</p>
            <ul className="mt-3 space-y-2 text-sm">
              {result.improvements.map((tip, i) => (
                <li key={i} className="text-slate-700 dark:text-slate-300">
                  • {tip.replace(/\*\*/g, "")}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
