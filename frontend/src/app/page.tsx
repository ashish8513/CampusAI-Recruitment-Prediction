import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";

/** Single-page application home — all sections on one scrollable page */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <section className="section-pad text-center">
        <h2 className="text-3xl font-bold text-white">Ready to predict your package?</h2>
        <p className="mt-2 text-slate-400">ML + Gen AI in one college-ready platform.</p>
        <a href="/predict" className="mt-6 inline-block rounded-xl bg-accent px-8 py-3 font-bold text-white">
          Get Started
        </a>
      </section>
    </>
  );
}
