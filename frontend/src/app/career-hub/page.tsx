"use client";

import { useState } from "react";
import ResumeMatchSection from "@/components/career/ResumeMatchSection";
import ResumeScoreSection from "@/components/career/ResumeScoreSection";
import InterviewPrepSection from "@/components/career/InterviewPrepSection";
import { Target, FileCheck, Mic } from "lucide-react";

const tabs = [
  { id: "match", label: "Resume Match & Gaps", icon: Target },
  { id: "score", label: "Resume Scoring", icon: FileCheck },
  { id: "interview", label: "Interview Prep", icon: Mic },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function CareerHubPage() {
  const [tab, setTab] = useState<TabId>("match");

  return (
    <div className="section-pad pt-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Career Hub</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Resume upload · Company matching · Skill gaps · Scoring · GD & Interview prep
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-accent text-white shadow-lg"
                : "glass text-slate-700 hover:bg-white dark:text-slate-200"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-5xl">
        {tab === "match" && <ResumeMatchSection />}
        {tab === "score" && <ResumeScoreSection />}
        {tab === "interview" && <InterviewPrepSection />}
      </div>
    </div>
  );
}
