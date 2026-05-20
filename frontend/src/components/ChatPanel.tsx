"use client";

import { useState } from "react";
import { chatWithAI, runAgent } from "@/lib/api";
import { Send, Bot } from "lucide-react";

export default function ChatPanel() {
  const [messages, setMessages] = useState<{ role: string; text: string; mode?: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mba, setMba] = useState("65");

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await chatWithAI(userMsg, { mba_p: parseFloat(mba) });
      setMessages((m) => [...m, { role: "ai", text: res.reply, mode: res.mode }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "API gateway (4000) not running. Run .\\scripts\\start-dev.ps1 from project folder." }]);
    } finally {
      setLoading(false);
    }
  };

  const runPlan = async () => {
    setLoading(true);
    try {
      const plan = await runAgent("Get placed in top company", { mba_p: parseFloat(mba), etest_p: 75, workex: 1 });
      setMessages((m) => [
        ...m,
        { role: "ai", text: `**Readiness: ${plan.readiness_score}/100**\n\n${plan.action_plan}`, mode: plan.mode },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Agent unavailable — check services." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass flex h-[520px] flex-col rounded-2xl">
      <div className="flex items-center gap-2 border-b p-4">
        <Bot className="text-campus-600" />
        <span className="font-bold">RAG Career Coach (LangChain)</span>
        <input className="ml-auto w-20 rounded border px-2 text-sm" value={mba} onChange={(e) => setMba(e.target.value)} title="MBA %" />
        <button onClick={runPlan} className="rounded bg-campus-600 px-3 py-1 text-xs text-white">Run Agent</button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500">Ask: &quot;How to improve my package?&quot; or run AI Agent plan.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`rounded-lg p-3 text-sm ${m.role === "user" ? "ml-8 bg-accent/10" : "mr-8 bg-white"}`}>
            <pre className="whitespace-pre-wrap font-sans">{m.text}</pre>
            {m.mode && <span className="text-xs text-slate-400">mode: {m.mode}</span>}
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t p-4">
        <input
          className="flex-1 rounded-lg border px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask placement questions..."
        />
        <button onClick={send} disabled={loading} className="rounded-lg bg-accent p-2 text-white">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
