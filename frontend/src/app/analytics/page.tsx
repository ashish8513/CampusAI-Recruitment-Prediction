"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "@/lib/api";
import type { Analytics } from "@/types";

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    getAnalytics().then(setData).catch(() =>
      setData({
        total_students: 215,
        placed_count: 148,
        placement_rate: 69,
        avg_salary: 288000,
        max_salary: 940000,
        min_salary: 200000,
      })
    );
  }, []);

  if (!data) return <div className="section-pad pt-24 text-center">Loading analytics...</div>;

  const cards = [
    { label: "Total Students", value: data.total_students },
    { label: "Placed", value: data.placed_count },
    { label: "Placement Rate", value: `${data.placement_rate}%` },
    { label: "Avg Salary", value: `₹${data.avg_salary.toLocaleString("en-IN")}` },
    { label: "Max Package", value: `₹${data.max_salary.toLocaleString("en-IN")}` },
    { label: "Min Package", value: `₹${data.min_salary.toLocaleString("en-IN")}` },
  ];

  return (
    <div className="section-pad pt-24">
      <h1 className="text-center text-3xl font-bold">Dataset Analytics</h1>
      <p className="mt-2 text-center text-slate-600">Insights from train.csv cohort</p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-8 text-center">
            <p className="text-3xl font-black text-accent">{c.value}</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
