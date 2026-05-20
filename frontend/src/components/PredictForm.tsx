"use client";

import { useMemo, useState } from "react";
import { predictSalary, getApiErrorMessage } from "@/lib/api";
import type { PredictPayload, PredictResult } from "@/types";
import {
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  TrendingUp,
  School,
  BookOpen,
  Target,
  RotateCcw,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const initial: PredictPayload = {
  gender: 1,
  ssc_p: 70,
  ssc_b: 1,
  hsc_p: 72,
  hsc_b: 1,
  hsc_s: "Commerce",
  degree_p: 68,
  degree_t: "Comm&Mgmt",
  workex: 1,
  etest_p: 75,
  specialisation: 1,
  mba_p: 65,
  status: 1,
};

type Section = "personal" | "academics" | "mba";

function ProfileStrength({ form }: { form: PredictPayload }) {
  const score = useMemo(() => {
    let s = 0;
    if (form.ssc_p >= 60) s += 12;
    if (form.hsc_p >= 60) s += 12;
    if (form.degree_p >= 60) s += 15;
    if (form.mba_p >= 60) s += 25;
    if (form.etest_p >= 70) s += 18;
    if (form.workex === 1) s += 10;
    if (form.status === 1) s += 8;
    return Math.min(100, s);
  }, [form]);

  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-800/50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Profile Strength</span>
        <span className="text-lg font-black text-cyan-400">{score}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {score >= 75 ? "Strong profile for top packages" : score >= 50 ? "Good — improve MBA & e-test" : "Build scores to unlock better predictions"}
      </p>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: typeof User; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-700/60 pb-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-blue-500/20">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  min = 40,
  max = 100,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="rounded-lg bg-cyan-500/20 px-3 py-1 text-lg font-bold text-cyan-300">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="predict-slider mt-3 w-full"
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function ChipGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              value === o.value
                ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md shadow-blue-500/30"
                : "border border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-slate-200"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PredictForm() {
  const [form, setForm] = useState(initial);
  const [section, setSection] = useState<Section>("personal");
  const [result, setResult] = useState<PredictResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof PredictPayload>(key: K, val: PredictPayload[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      setResult(await predictSalary(form));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const sections: { id: Section; label: string; icon: typeof User }[] = [
    { id: "personal", label: "Personal", icon: User },
    { id: "academics", label: "Academics", icon: School },
    { id: "mba", label: "MBA & Placement", icon: Briefcase },
  ];

  const lpa = result ? (result.predicted_salary / 100000).toFixed(2) : null;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 xl:grid-cols-5">
        {/* Form — 3 cols */}
        <form onSubmit={submit} className="glass xl:col-span-3">
          <div className="border-b border-slate-700/60 bg-gradient-to-r from-slate-900/80 to-slate-800/50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  <Sparkles className="h-4 w-4" /> ML Salary Engine
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">Student Profile</h2>
                <p className="mt-1 text-sm text-slate-400">215 MBA records · Ridge regression model</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm(initial);
                  setResult(null);
                  setError("");
                }}
                className="flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-400 hover:bg-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
            <div className="mt-5">
              <ProfileStrength form={form} />
            </div>
          </div>

          {/* Section tabs */}
          <div className="flex gap-1 border-b border-slate-700/60 px-4 pt-4">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
                  section === s.id
                    ? "bg-slate-800 text-cyan-300"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </button>
            ))}
          </div>

          <div className="space-y-6 p-6">
            {section === "personal" && (
              <>
                <SectionHeader icon={User} title="Personal Details" subtitle="Basic info for cohort matching" />
                <ChipGroup
                  label="Gender"
                  value={form.gender}
                  onChange={(v) => set("gender", v)}
                  options={[
                    { value: 1, label: "Male" },
                    { value: 0, label: "Female" },
                  ]}
                />
                <ChipGroup
                  label="Work Experience"
                  value={form.workex}
                  onChange={(v) => set("workex", v)}
                  options={[
                    { value: 1, label: "Yes — Has Experience" },
                    { value: 0, label: "No — Fresher" },
                  ]}
                />
                <ChipGroup
                  label="Placement Status"
                  value={form.status}
                  onChange={(v) => set("status", v)}
                  options={[
                    { value: 1, label: "Placed" },
                    { value: 0, label: "Not Placed" },
                  ]}
                />
              </>
            )}

            {section === "academics" && (
              <>
                <SectionHeader icon={School} title="Academic Journey" subtitle="SSC → HSC → Degree scores & boards" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <SliderField label="SSC Percentage" value={form.ssc_p} onChange={(v) => set("ssc_p", v)} hint="Secondary school" />
                  <SliderField label="HSC Percentage" value={form.hsc_p} onChange={(v) => set("hsc_p", v)} hint="Higher secondary" />
                  <SliderField label="Degree Percentage" value={form.degree_p} onChange={(v) => set("degree_p", v)} hint="Undergraduate" />
                </div>
                <ChipGroup
                  label="SSC Board"
                  value={form.ssc_b}
                  onChange={(v) => set("ssc_b", v)}
                  options={[
                    { value: 1, label: "Central" },
                    { value: 0, label: "Others" },
                  ]}
                />
                <ChipGroup
                  label="HSC Board"
                  value={form.hsc_b}
                  onChange={(v) => set("hsc_b", v)}
                  options={[
                    { value: 1, label: "Central" },
                    { value: 0, label: "Others" },
                  ]}
                />
                <ChipGroup
                  label="HSC Stream"
                  value={form.hsc_s}
                  onChange={(v) => set("hsc_s", v)}
                  options={[
                    { value: "Commerce", label: "Commerce" },
                    { value: "Science", label: "Science" },
                    { value: "Arts", label: "Arts" },
                  ]}
                />
                <ChipGroup
                  label="Degree Type"
                  value={form.degree_t}
                  onChange={(v) => set("degree_t", v)}
                  options={[
                    { value: "Sci&Tech", label: "Sci & Tech" },
                    { value: "Comm&Mgmt", label: "Comm & Mgmt" },
                    { value: "Others", label: "Others" },
                  ]}
                />
              </>
            )}

            {section === "mba" && (
              <>
                <SectionHeader icon={GraduationCap} title="MBA & Campus Tests" subtitle="Strongest predictors for salary" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <SliderField label="MBA Percentage" value={form.mba_p} onChange={(v) => set("mba_p", v)} hint="Top salary driver" />
                  <SliderField label="E-Test Score" value={form.etest_p} onChange={(v) => set("etest_p", v)} hint="Campus aptitude test" />
                </div>
                <ChipGroup
                  label="MBA Specialisation"
                  value={form.specialisation}
                  onChange={(v) => set("specialisation", v)}
                  options={[
                    { value: 1, label: "Mkt & Fin" },
                    { value: 0, label: "Mkt & HR" },
                  ]}
                />
              </>
            )}
          </div>

          <div className="border-t border-slate-700/60 p-6">
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-500/40 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5" />
                  Predict Salary Package
                </>
              )}
            </button>
            {error && (
              <p className="mt-3 flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </p>
            )}
          </div>
        </form>

        {/* Result panel — 2 cols */}
        <div className="xl:col-span-2">
          <div className="glass sticky top-24 overflow-hidden">
            <div className="bg-gradient-to-br from-teal-600/20 via-slate-900 to-blue-600/20 p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <Target className="h-4 w-4" /> Prediction Output
              </p>
              {result ? (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    {result.placement_status}
                  </div>
                  <p className="mt-6 text-sm text-slate-400">Predicted Annual Package</p>
                  <p className="mt-2 flex items-center justify-center gap-1 text-4xl font-black text-white md:text-5xl">
                    <IndianRupee className="h-8 w-8 text-cyan-400" />
                    {result.predicted_salary.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-cyan-300">≈ {lpa} LPA</p>
                  <p className="mt-4 text-xs text-slate-500">{result.confidence_band}</p>
                  <div className="mt-8 grid grid-cols-2 gap-3 text-left">
                    {[
                      { l: "MBA %", v: form.mba_p },
                      { l: "E-Test", v: form.etest_p },
                      { l: "Work Ex", v: form.workex ? "Yes" : "No" },
                      { l: "Stream", v: form.hsc_s },
                    ].map((item) => (
                      <div key={item.l} className="rounded-lg bg-slate-800/60 px-3 py-2">
                        <p className="text-xs text-slate-500">{item.l}</p>
                        <p className="font-semibold text-white">{item.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-8 flex min-h-[320px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800/80">
                    <BookOpen className="h-10 w-10 text-slate-600" />
                  </div>
                  <p className="mt-6 text-lg font-semibold text-slate-300">No prediction yet</p>
                  <p className="mt-2 max-w-xs text-sm text-slate-500">
                    Fill your profile across all 3 tabs and hit Predict to see your expected campus package.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
