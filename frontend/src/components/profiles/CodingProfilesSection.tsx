"use client";

import { useEffect, useState } from "react";
import {
  Github,
  Linkedin,
  Code2,
  ExternalLink,
  Save,
  Trash2,
  Link2,
  Globe,
  Trophy,
} from "lucide-react";
import type { CodingProfiles } from "@/types/profiles";
import { EMPTY_PROFILES, PROFILE_STORAGE_KEY } from "@/types/profiles";

const PLATFORMS: {
  key: keyof CodingProfiles;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    key: "github",
    label: "GitHub",
    placeholder: "https://github.com/yourusername",
    icon: <Github className="h-5 w-5" />,
    color: "from-slate-800 to-slate-600",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/yourprofile",
    icon: <Linkedin className="h-5 w-5" />,
    color: "from-blue-700 to-blue-500",
  },
  {
    key: "hackerrank",
    label: "HackerRank",
    placeholder: "https://hackerrank.com/yourusername",
    icon: <Code2 className="h-5 w-5" />,
    color: "from-green-700 to-green-500",
  },
  {
    key: "leetcode",
    label: "LeetCode",
    placeholder: "https://leetcode.com/yourusername",
    icon: <Trophy className="h-5 w-5" />,
    color: "from-amber-600 to-yellow-500",
  },
  {
    key: "codechef",
    label: "CodeChef",
    placeholder: "https://codechef.com/users/yourusername",
    icon: <Code2 className="h-5 w-5" />,
    color: "from-amber-800 to-amber-600",
  },
  {
    key: "gfg",
    label: "GeeksforGeeks",
    placeholder: "https://auth.geeksforgeeks.org/user/yourusername",
    icon: <Code2 className="h-5 w-5" />,
    color: "from-green-800 to-lime-600",
  },
  {
    key: "codolio",
    label: "Codolio",
    placeholder: "https://codolio.com/profile/yourusername",
    icon: <Link2 className="h-5 w-5" />,
    color: "from-purple-700 to-indigo-500",
  },
  {
    key: "portfolio",
    label: "Portfolio / Website",
    placeholder: "https://yourportfolio.com",
    icon: <Globe className="h-5 w-5" />,
    color: "from-teal-700 to-cyan-500",
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    placeholder: "https://x.com/yourusername",
    icon: <Link2 className="h-5 w-5" />,
    color: "from-sky-600 to-blue-400",
  },
];

function normalizeUrl(url: string): string {
  const t = url.trim();
  if (!t) return "";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  return `https://${t}`;
}

export default function CodingProfilesSection() {
  const [profiles, setProfiles] = useState<CodingProfiles>(EMPTY_PROFILES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) setProfiles({ ...EMPTY_PROFILES, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const filledCount = PLATFORMS.filter((p) => profiles[p.key]?.trim()).length;
  const completeness = Math.round((filledCount / PLATFORMS.length) * 100);

  const save = () => {
    const normalized = { ...profiles };
    (Object.keys(normalized) as (keyof CodingProfiles)[]).forEach((k) => {
      normalized[k] = normalizeUrl(normalized[k]);
    });
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized));
    setProfiles(normalized);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const clearAll = () => {
    if (!confirm("Clear all profile links?")) return;
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    setProfiles(EMPTY_PROFILES);
  };

  const update = (key: keyof CodingProfiles, value: string) => {
    setProfiles((p) => ({ ...p, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="glass rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold md:text-2xl">Add Your Coding Profiles</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          LinkedIn, GitHub, HackerRank, LeetCode & more — save once, open anytime for placements & resume.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="rounded-xl bg-accent/10 px-4 py-2">
            <p className="text-xs text-slate-500">Profile completeness</p>
            <p className="text-2xl font-black text-accent">{completeness}%</p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {filledCount} of {PLATFORMS.length} platforms added
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PLATFORMS.map((p) => (
            <label key={p.key} className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${p.color} text-white`}>
                  {p.icon}
                </span>
                {p.label}
              </span>
              <input
                type="url"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder={p.placeholder}
                value={profiles[p.key]}
                onChange={(e) => update(p.key, e.target.value)}
              />
            </label>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-white hover:bg-blue-600"
          >
            <Save className="h-5 w-5" />
            {saved ? "Saved!" : "Save Profiles"}
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" /> Clear All
          </button>
        </div>
      </div>

      {filledCount > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-bold">Your Profile Links</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.filter((p) => profiles[p.key]?.trim()).map((p) => (
              <a
                key={p.key}
                href={normalizeUrl(profiles[p.key])}
                target="_blank"
                rel="noopener noreferrer"
                className="glass group flex items-center gap-4 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} text-white`}
                >
                  {p.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 dark:text-white">{p.label}</p>
                  <p className="truncate text-xs text-slate-500 group-hover:text-accent">
                    {profiles[p.key].replace(/^https?:\/\//, "")}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-accent" />
              </a>
            ))}
          </div>
        </div>
      )}

      {filledCount === 0 && (
        <p className="text-center text-sm text-slate-500">
          Add at least one link and click Save — cards will appear here.
        </p>
      )}
    </div>
  );
}
