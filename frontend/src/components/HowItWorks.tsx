export default function HowItWorks() {
  const steps = [
    { n: "01", t: "Enter Profile", d: "Submit academic scores, stream, MBA %, and placement status." },
    { n: "02", t: "ML Prediction", d: "Microservice runs Ridge model → predicted salary in INR." },
    { n: "03", t: "Gen AI Coach", d: "RAG retrieves placement guides; agent builds your action plan." },
    { n: "04", t: "Analytics", d: "Cohort insights: placement rate, avg/max salary from dataset." },
  ];
  return (
    <section id="how" className="section-pad">
      <h2 className="text-center text-3xl font-bold text-white">How It Works</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="glass rounded-2xl p-6 text-center">
            <span className="text-3xl font-black text-accent">{s.n}</span>
            <h3 className="mt-2 font-bold text-white">{s.t}</h3>
            <p className="mt-2 text-sm text-slate-400">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
