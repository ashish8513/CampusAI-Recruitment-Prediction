"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAnalytics } from "@/lib/api";
import type { Analytics } from "@/types";
import { PROFILE_STORAGE_KEY, EMPTY_PROFILES, type CodingProfiles } from "@/types/profiles";
import InteractiveRobot from "@/components/InteractiveRobot";
import {
  LayoutDashboard,
  TrendingUp,
  Bot,
  FileText,
  Target,
  Link2,
  LineChart,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const quickLinks = [
  { href: "/predict", label: "Salary Prediction", icon: LineChart, color: "bg-blue-500" },
  { href: "/career-hub", label: "Resume & Interview", icon: FileText, color: "bg-teal-500" },
  { href: "/coding-profiles", label: "Coding Profiles", icon: Link2, color: "bg-purple-500" },
  { href: "/ai-coach", label: "AI Career Coach", icon: Bot, color: "bg-indigo-500" },
  { href: "/analytics", label: "Dataset Analytics", icon: TrendingUp, color: "bg-amber-500" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Analytics | null>(null);
  const [profilePct, setProfilePct] = useState(0);
  const [services, setServices] = useState<Record<string, string>>({});

  useEffect(() => {
    getAnalytics().then(setStats).catch(() =>
      setStats({
        total_students: 215,
        placed_count: 148,
        placement_rate: 69,
        avg_salary: 288000,
        max_salary: 940000,
        min_salary: 200000,
      })
    );

    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      const p: CodingProfiles = raw ? { ...EMPTY_PROFILES, ...JSON.parse(raw) } : EMPTY_PROFILES;
      const filled = Object.values(p).filter((v) => v?.trim()).length;
      setProfilePct(Math.round((filled / 9) * 100));
    } catch {
      setProfilePct(0);
    }

    fetch("http://127.0.0.1:4000/health")
      .then((r) => r.json())
      .then((d) => setServices(d.checks || {}))
      .catch(() => setServices({ gateway: "down" }));
  }, []);

  return (
    <div className="section-pad pt-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-sm font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <LayoutDashboard className="h-4 w-4 text-accent" /> Student Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            CampusAI Dashboard
          </h1>
          <p className="mt-2 max-w-xl text-slate-700 dark:text-slate-400">
            Placement overview, quick actions, and system status — sab ek jagah.
          </p>
        </div>
        <div className="hidden shrink-0 lg:block">
          <InteractiveRobot size="md" />
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Students in Dataset", value: stats.total_students, icon: "👥" },
            { label: "Placement Rate", value: `${stats.placement_rate}%`, icon: "📈" },
            { label: "Avg Package", value: `₹${(stats.avg_salary / 100000).toFixed(1)}L`, icon: "💰" },
            { label: "Max Package", value: `₹${(stats.max_salary / 100000).toFixed(1)}L`, icon: "🏆" },
          ].map((c) => (
            <div key={c.label} className="glass rounded-2xl p-5">
              <p className="text-2xl">{c.icon}</p>
              <p className="mt-2 text-2xl font-black text-accent">{c.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-accent hover:shadow-md dark:border-slate-700"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${q.color}`}>
                  <q.icon className="h-5 w-5" />
                </span>
                <span className="flex-1 font-semibold text-slate-800 dark:text-slate-200">{q.label}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-bold">Profile Completeness</h2>
            <div className="mt-4 flex items-end gap-2">
              <p className="text-4xl font-black text-accent">{profilePct}%</p>
              <Link href="/coding-profiles" className="mb-1 text-sm text-accent hover:underline">
                Update →
              </Link>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${profilePct}%` }} />
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-bold">Services Status</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {["gateway", "ml", "ai", "auth"].map((key) => (
                <li key={key} className="flex items-center justify-between capitalize">
                  <span className="text-slate-600 dark:text-slate-400">{key}</span>
                  {services[key] === "ok" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass flex justify-center rounded-2xl p-4 lg:hidden">
            <InteractiveRobot size="md" />
          </div>
        </div>
      </div>

      {/* Placement tip */}
      <div className="glass mt-8 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 font-bold">
          <Target className="text-accent" /> Today&apos;s Placement Tip
        </h2>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          Update your coding profiles on GitHub & LinkedIn, run resume match in Career Hub, and practice
          one GD topic before your next company shortlist.
        </p>
      </div>
    </div>
  );
}
