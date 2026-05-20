export default function AboutPage() {
  return (
    <div className="section-pad pt-24">
      <div className="glass mx-auto max-w-3xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold">About CampusAI</h1>
        <p className="mt-4 text-slate-700 leading-relaxed">
          CampusAI is a production-style full-stack project for MBA campus recruitment prediction.
          It combines classical ML (Ridge regression) with modern Gen AI (RAG, LangChain agents, OpenAI)
          in a microservices architecture suitable for college AI/ML competitions.
        </p>
        <h2 className="mt-8 text-xl font-bold">Architecture</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
          <li><strong>Frontend:</strong> Next.js 14 + TypeScript + Tailwind (SPA home)</li>
          <li><strong>API Gateway:</strong> Node.js Express + MongoDB logging</li>
          <li><strong>ML Service:</strong> FastAPI + scikit-learn</li>
          <li><strong>AI Service:</strong> FastAPI + LangChain + Chroma RAG</li>
          <li><strong>Auth Service:</strong> Java Spring Boot</li>
        </ul>
        <h2 className="mt-8 text-xl font-bold">Submission Highlights</h2>
        <p className="mt-2 text-slate-700">
          OpenAI APIs · Prompt Engineering · Vector DB · Docker · CI/CD · MERN + Spring ·
          215 student dataset · Real salary prediction · AI career coach.
        </p>
      </div>
    </div>
  );
}
