import CodingProfilesSection from "@/components/profiles/CodingProfilesSection";
import { Link2 } from "lucide-react";

export default function CodingProfilesPage() {
  return (
    <div className="section-pad pt-24">
      <div className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-sm font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          <Link2 className="h-4 w-4 text-accent" /> Developer Identity
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          Coding Profiles Hub
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-700 dark:text-slate-400">
          GitHub · LinkedIn · HackerRank · LeetCode · CodeChef · GFG · Portfolio — ek jagah manage karo
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-4xl">
        <CodingProfilesSection />
      </div>
    </div>
  );
}
