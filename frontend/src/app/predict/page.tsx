import PredictForm from "@/components/PredictForm";
import { LineChart } from "lucide-react";

export default function PredictPage() {
  return (
    <div className="section-pad pt-24">
      <div className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm font-semibold text-cyan-300">
          <LineChart className="h-4 w-4" /> Ridge ML · Real-time Inference
        </p>
        <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">Salary Prediction</h1>
        <p className="mx-auto mt-2 max-w-lg text-slate-400">
          Build your student profile — academics, MBA scores, placement status — get predicted package in INR.
        </p>
      </div>
      <div className="mt-10">
        <PredictForm />
      </div>
    </div>
  );
}
