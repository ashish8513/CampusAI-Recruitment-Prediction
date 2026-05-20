"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";

const links = [
  { href: "/#hero", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#features", label: "Features" },
  { href: "/predict", label: "Predict" },
  { href: "/career-hub", label: "Career Hub" },
  { href: "/coding-profiles", label: "Profiles" },
  { href: "/ai-coach", label: "AI Coach" },
  { href: "/analytics", label: "Analytics" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full glass nav-bar">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-teal-200">
          <GraduationCap className="h-8 w-8 text-accent" />
          <span>CampusAI</span>
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-200 hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/predict" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">
            Predict Salary
          </Link>
        </div>
        <button className="md:hidden text-slate-200" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-3 border-t border-slate-700 bg-slate-900 p-4 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-slate-200">
              {l.label}
            </Link>
          ))}
          <Link href="/predict" className="rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-white">
            Predict Salary
          </Link>
        </div>
      )}
    </nav>
  );
}
