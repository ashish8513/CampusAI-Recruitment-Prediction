const stacks = {
  "Gen AI": ["OpenAI APIs", "LangChain", "RAG", "Prompt Engineering", "AI Agents", "Vector DB (Chroma)"],
  Languages: ["TypeScript", "JavaScript", "Java", "Python"],
  Frontend: ["React", "Next.js 14", "Tailwind CSS", "Framer Motion"],
  Backend: ["Node.js Express", "FastAPI", "Spring Boot", "MERN"],
  Data: ["MongoDB", "PostgreSQL-ready", "CSV Analytics", "ChromaDB"],
  DevOps: ["Docker", "Docker Compose", "GitHub Actions", "AWS-ready"],
};

export default function TechStack() {
  return (
    <section id="tech" className="section-pad">
      <h2 className="text-center text-3xl font-bold">Complete Tech Stack</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(stacks).map(([cat, items]) => (
          <div key={cat} className="glass rounded-2xl p-6">
            <h3 className="font-bold text-campus-700">{cat}</h3>
            <ul className="mt-3 space-y-2">
              {items.map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
