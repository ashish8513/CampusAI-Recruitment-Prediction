"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Upload, ArrowRight } from "lucide-react";
import InteractiveRobot from "@/components/InteractiveRobot";

export default function Hero() {
  return (
    <section id="hero" className="section-pad pt-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-1 text-sm font-semibold text-teal-200">
            <Sparkles className="h-4 w-4 text-accent" /> Gen AI + ML Powered
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Campus <span className="gradient-text">Recruitment</span>
            <br />
            Intelligence
          </h1>
          <p className="mt-4 max-w-xl text-lg font-medium text-slate-300">
            Full-stack microservices platform predicting MBA placement salary with RAG career coach,
            LangChain agents, and production-ready DevOps.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/predict"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-600"
            >
              <Upload className="h-5 w-5" /> Predict Salary
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-teal-400 px-6 py-3 font-semibold text-teal-200 hover:bg-slate-800"
            >
              Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { n: "4", l: "Microservices" },
              { n: "RAG", l: "Gen AI Stack" },
              { n: "215+", l: "Student Records" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-accent">{s.n}</p>
                <p className="text-xs text-slate-400">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <InteractiveRobot size="lg" />
        </motion.div>
      </div>
    </section>
  );
}
