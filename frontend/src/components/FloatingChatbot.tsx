"use client";

import { useState } from "react";
import { chatWithAI } from "@/lib/api";
import { Send, X, Minimize2 } from "lucide-react";
import InteractiveRobot from "@/components/InteractiveRobot";

type Message = { role: "user" | "ai"; text: string; mode?: string };

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi! I'm CampusAI Coach. Ask about placement, salary, or interview prep.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await chatWithAI(userMsg);
      setMessages((m) => [...m, { role: "ai", text: res.reply, mode: res.mode }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "Could not reach API (port 4000). Run: .\\scripts\\start-dev.ps1 — then refresh.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Minimized FAB — fixed, never scrolls */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="floating-chatbot-fab"
          aria-label="Open AI Coach"
        >
          <div className="overflow-hidden rounded-full bg-slate-800 p-0.5">
            <InteractiveRobot size="sm" />
          </div>
          <span className="floating-chatbot-fab-label">AI Coach</span>
        </button>
      )}

      {/* Whole widget: avatar + chat — one fixed column on viewport */}
      {open && (
        <div className="floating-chat-widget" aria-label="AI Chatbot">
          <div className="floating-coach-avatar-wrap">
            <div className="overflow-hidden rounded-full border-2 border-white bg-slate-900 shadow-lg dark:border-slate-600">
              <InteractiveRobot size="md" />
            </div>
            <span className="floating-coach-online" title="Online" />
          </div>

          <div className="floating-chatbot-panel glass">
            <div className="floating-chatbot-header">
              <div>
                <p className="text-sm font-bold leading-tight">CampusAI Coach</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">RAG · LangChain</p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label="Minimize"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="floating-chatbot-messages">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`floating-chatbot-bubble ${
                    m.role === "user" ? "floating-chatbot-bubble-user" : "floating-chatbot-bubble-ai"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{m.text}</p>
                  {m.mode && <span className="mt-1 block text-[10px] text-slate-400">{m.mode}</span>}
                </div>
              ))}
              {loading && (
                <div className="floating-chatbot-bubble floating-chatbot-bubble-ai">
                  <p className="text-sm text-slate-500">Thinking...</p>
                </div>
              )}
            </div>

            <div className="floating-chatbot-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask anything..."
                disabled={loading}
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="floating-chatbot-send"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
