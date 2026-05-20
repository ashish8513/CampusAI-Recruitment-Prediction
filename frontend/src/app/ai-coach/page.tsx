import ChatPanel from "@/components/ChatPanel";

export default function AICoachPage() {
  return (
    <div className="section-pad pt-24">
      <h1 className="text-center text-3xl font-bold">AI Career Coach</h1>
      <p className="mt-2 text-center text-slate-600">
        OpenAI · LangChain · RAG · Chroma Vector DB · AI Agents
      </p>
      <div className="mx-auto mt-10 max-w-3xl">
        <ChatPanel />
      </div>
    </div>
  );
}
