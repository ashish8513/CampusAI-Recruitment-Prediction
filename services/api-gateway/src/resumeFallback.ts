const PROFILES: Record<string, { name: string; skills: string[] }> = {
  "tcs-software": { name: "TCS Software Engineer", skills: ["java", "python", "sql", "dsa", "communication"] },
  "mba-general": { name: "MBA Placement", skills: ["communication", "excel", "leadership", "internship"] },
  "deloitte-analyst": { name: "Business Analyst", skills: ["excel", "sql", "statistics", "communication"] },
  "finance-analyst": { name: "Finance Analyst", skills: ["excel", "finance", "valuation", "communication"] },
  "product-analyst": { name: "Product Analyst", skills: ["sql", "excel", "analytics", "communication"] },
};

export function fallbackResumeMatch(resume: string, skills: string, companyId: string) {
  const p = PROFILES[companyId] || PROFILES["mba-general"];
  const text = `${resume} ${skills}`.toLowerCase();
  const matched = p.skills.filter((s) => text.includes(s));
  const missing = p.skills.filter((s) => !text.includes(s));
  const pct = Math.round((matched.length / p.skills.length) * 100);
  return {
    company: p.name,
    match_percentage: pct,
    matched_skills: matched.map((s) => s.toUpperCase()),
    missing_skills: missing.map((s) => s.toUpperCase()),
    skill_gaps: missing.map((s) => ({
      skill: s,
      severity: "high",
      recommendation: `Learn ${s} via course + project`,
    })),
    gd_topics: ["Teamwork", "Current affairs", "Ethics"],
    interview_focus: ["HR", "Resume", "Domain basics"],
    verdict: pct >= 60 ? "Moderate match" : "Upskill on missing skills",
    mode: "gateway-fallback",
  };
}

export function fallbackResumeScore(resume: string, skills: string) {
  const len = (resume + skills).length;
  const overall = Math.min(95, 45 + Math.floor(len / 40));
  return {
    overall_score: overall,
    grade: overall >= 70 ? "B" : "C",
    categories: {
      education: { score: 70, label: "Education", feedback: "Add GPA" },
      skills: { score: Math.min(90, 50 + skills.split(",").length * 8), label: "Skills", feedback: "Add more skills" },
      experience: { score: resume.toLowerCase().includes("intern") ? 80 : 50, label: "Experience", feedback: "Add internship" },
      projects: { score: resume.toLowerCase().includes("project") ? 75 : 45, label: "Projects", feedback: "Add projects" },
      format_clarity: { score: 65, label: "Format", feedback: "One page resume" },
    },
    improvements: ["Start AI service for detailed scoring"],
    mode: "gateway-fallback",
  };
}
