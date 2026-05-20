"""Resume matching, gap analysis, scoring — rule-based + optional RAG."""
import re
from typing import Optional

COMPANY_PROFILES = {
    "tcs-software": {
        "name": "TCS / Infosys — Software Engineer",
        "required_skills": [
            "java", "python", "sql", "data structures", "dsa", "oop", "dbms",
            "communication", "aptitude", "problem solving", "git",
        ],
        "gd_topics": ["teamwork", "ethics in technology", "digital transformation", "AI and jobs"],
        "interview_focus": ["coding basics", "project deep-dive", "HR behavioral"],
    },
    "deloitte-analyst": {
        "name": "Deloitte / EY — Business Analyst",
        "required_skills": [
            "excel", "sql", "power bi", "statistics", "communication", "case study",
            "mba", "analytics", "presentation",
        ],
        "gd_topics": ["startup ecosystem", "leadership", "data-driven decisions"],
        "interview_focus": ["case interview", "resume walkthrough", "guesstimates"],
    },
    "finance-analyst": {
        "name": "Goldman / Finance Analyst (Mkt&Fin)",
        "required_skills": [
            "excel", "financial modeling", "valuation", "accounting", "finance",
            "communication", "internship", "market analysis",
        ],
        "gd_topics": ["market volatility", "RBI policy", "investment risks"],
        "interview_focus": ["technical finance", "fit questions", "market awareness"],
    },
    "product-analyst": {
        "name": "Amazon / Product Analyst",
        "required_skills": [
            "sql", "excel", "product analytics", "metrics", "a/b testing",
            "storytelling", "python", "data analysis",
        ],
        "gd_topics": ["customer obsession", "e-commerce growth", "product ethics"],
        "interview_focus": ["case studies", "metric definition", "STAR behavioral"],
    },
    "mba-general": {
        "name": "General MBA Campus Placement",
        "required_skills": [
            "communication", "leadership", "teamwork", "internship", "excel",
            "presentation", "domain knowledge", "aptitude",
        ],
        "gd_topics": ["current affairs", "group coordination", "business ethics"],
        "interview_focus": ["why MBA", "why company", "career goals", "resume deep-dive"],
    },
}


def _normalize_skills(text: str) -> set[str]:
    text = text.lower()
    tokens = re.split(r"[,;\n|]+", text)
    found = set()
    for t in tokens:
        t = t.strip()
        if len(t) >= 2:
            found.add(t)
    # also scan resume for known keywords
    all_keywords = set()
    for profile in COMPANY_PROFILES.values():
        all_keywords.update(profile["required_skills"])
    for kw in all_keywords:
        if kw in text:
            found.add(kw)
    return found


def match_resume_to_company(
    resume_text: str,
    user_skills: str,
    company_id: str,
) -> dict:
    profile = COMPANY_PROFILES.get(company_id, COMPANY_PROFILES["mba-general"])
    combined = f"{resume_text}\n{user_skills}".lower()
    user_set = _normalize_skills(f"{user_skills}\n{resume_text}")

    required = profile["required_skills"]
    matched = [s for s in required if s in combined or s in user_set]
    missing = [s for s in required if s not in matched]

    match_pct = round((len(matched) / max(len(required), 1)) * 100)

    gaps = []
    for skill in missing:
        severity = "high" if skill in required[:4] else "medium"
        gaps.append({
            "skill": skill.title(),
            "severity": severity,
            "recommendation": _gap_tip(skill),
        })

    return {
        "company": profile["name"],
        "match_percentage": match_pct,
        "matched_skills": [s.title() for s in matched],
        "missing_skills": [s.title() for s in missing],
        "skill_gaps": gaps,
        "gd_topics": profile["gd_topics"],
        "interview_focus": profile["interview_focus"],
        "verdict": _verdict(match_pct),
    }


def _gap_tip(skill: str) -> str:
    tips = {
        "java": "Practice HackerRank Java + 2 small Spring/React projects",
        "python": "Build 1 analytics/ML mini-project on GitHub",
        "sql": "Complete SQL joins & window functions on LeetCode",
        "excel": "Learn pivot tables, VLOOKUP, basic dashboards",
        "communication": "Join Toastmasters or mock GD sessions weekly",
        "financial modeling": "Take FMVA-style modeling exercises on Excel",
        "dsa": "Solve 50 easy-medium problems on LeetCode",
    }
    return tips.get(skill, f"Add coursework, project, or certification demonstrating {skill}")


def _verdict(pct: int) -> str:
    if pct >= 75:
        return "Strong match — focus on mock interviews and GD practice."
    if pct >= 50:
        return "Moderate match — close skill gaps in 4–6 weeks before placements."
    return "Low match — prioritize upskilling on missing core skills first."


def score_resume(resume_text: str, user_skills: str) -> dict:
    text = f"{resume_text}\n{user_skills}".lower()
    categories = {
        "education": _score_education(text),
        "skills": _score_skills(text, user_skills),
        "experience": _score_experience(text),
        "projects": _score_projects(text),
        "format_clarity": _score_format(resume_text),
    }
    overall = round(sum(c["score"] for c in categories.values()) / len(categories))
    return {
        "overall_score": overall,
        "grade": _grade(overall),
        "categories": categories,
        "improvements": _improvements(categories, text),
    }


def _score_education(text: str) -> dict:
    score = 50
    if any(w in text for w in ["mba", "b.tech", "btech", "m.tech", "degree", "university", "college"]):
        score += 25
    if re.search(r"\b\d{1,2}(\.\d+)?\s*%|\bcgpa\b|\bgpa\b", text):
        score += 15
    if any(w in text for w in ["distinction", "merit", "honors"]):
        score += 10
    return {"score": min(100, score), "label": "Education", "feedback": "Include degree, institution, and GPA/percentage."}


def _score_skills(text: str, user_skills: str) -> dict:
    count = len(_normalize_skills(user_skills or text))
    score = min(100, 40 + count * 8)
    return {"score": score, "label": "Skills", "feedback": "List 8–12 role-relevant skills with proficiency level."}


def _score_experience(text: str) -> dict:
    score = 40
    if any(w in text for w in ["intern", "internship", "work experience", "workex", "full-time", "trainee"]):
        score += 35
    if re.search(r"\b(20\d{2}|19\d{2})\b", text):
        score += 15
    return {"score": min(100, score), "label": "Experience", "feedback": "Add internships with measurable outcomes (%, ₹, users)."}


def _score_projects(text: str) -> dict:
    score = 45
    if any(w in text for w in ["project", "github", "developed", "built", "implemented"]):
        score += 35
    if any(w in text for w in ["team", "led", "deployed"]):
        score += 15
    return {"score": min(100, score), "label": "Projects", "feedback": "Add 2–3 projects with tech stack and business impact."}


def _score_format(resume_text: str) -> dict:
    score = 55
    lines = [l for l in resume_text.split("\n") if l.strip()]
    if 80 <= len(resume_text) <= 4000:
        score += 20
    if len(lines) >= 8:
        score += 15
    if any(w in resume_text.lower() for w in ["email", "phone", "linkedin"]):
        score += 10
    return {"score": min(100, score), "label": "Format & Contact", "feedback": "Keep 1 page, clear sections, contact info on top."}


def _grade(score: int) -> str:
    if score >= 85:
        return "A — Placement Ready"
    if score >= 70:
        return "B — Good, minor fixes"
    if score >= 55:
        return "C — Needs improvement"
    return "D — Major revision required"


def _improvements(categories: dict, text: str) -> list[str]:
    tips = []
    for key, cat in categories.items():
        if cat["score"] < 65:
            tips.append(f"**{cat['label']}:** {cat['feedback']}")
    if "github.com" not in text:
        tips.append("Add GitHub/LinkedIn links for credibility.")
    if not tips:
        tips.append("Resume structure looks solid — tailor keywords per company JD.")
    return tips


def prepare_interview(
    company_id: str,
    user_skills: str,
    resume_text: str = "",
) -> dict:
    profile = COMPANY_PROFILES.get(company_id, COMPANY_PROFILES["mba-general"])
    match = match_resume_to_company(resume_text, user_skills, company_id)
    skills_list = [s.strip() for s in user_skills.split(",") if s.strip()][:8]

    hr_questions = [
        "Tell me about yourself (60 sec structure: present → past → future).",
        "Why this company and role?",
        "Strengths and weaknesses with real examples.",
        "Describe a conflict in a team and how you resolved it.",
        "Where do you see yourself in 5 years?",
    ]
    technical = _technical_questions(company_id, skills_list)
    gd = [
        f"Practice GD on: **{t}** — take a stand, use data, invite others.",
        "Focus on body language, listening, and summarizing the group view.",
        "Avoid dominating; add 2–3 solid points with examples.",
    ]
    for topic in profile["gd_topics"][:3]:
        gd.append(f"Topic: {topic}")

    checklist = [
        "Research company news (last 3 months)",
        "Prepare 3 STAR stories (Situation, Task, Action, Result)",
        "Mock PI with friend — record and review",
        "Dress formal, test video link if virtual",
        "Keep resume facts ready — every bullet may be questioned",
    ]
    if match["match_percentage"] < 60:
        checklist.insert(0, f"Upskill first: {', '.join(match['missing_skills'][:4])}")

    return {
        "company": profile["name"],
        "match_percentage": match["match_percentage"],
        "hr_questions": hr_questions,
        "technical_questions": technical,
        "gd_preparation": gd,
        "interview_checklist": checklist,
        "focus_areas": profile["interview_focus"],
    }


def _technical_questions(company_id: str, skills: list[str]) -> list[str]:
    base = {
        "tcs-software": [
            "Explain OOP pillars with examples.",
            "SQL: difference between INNER JOIN and LEFT JOIN.",
            "Time complexity of binary search.",
            "Describe your best coding project.",
        ],
        "deloitte-analyst": [
            "How would you estimate market size for EV scooters in India?",
            "Explain a dashboard you would build for sales drop.",
            "SQL: find top 5 customers by revenue.",
        ],
        "finance-analyst": [
            "Walk through DCF at a high level.",
            "Difference between EBIT and EBITDA.",
            "How does RBI repo rate affect markets?",
        ],
        "product-analyst": [
            "Define metric for measuring search quality.",
            "How would you investigate a 10% drop in checkout conversion?",
            "Design experiment for new homepage layout.",
        ],
        "mba-general": [
            "Why MBA after your degree stream?",
            "Explain a live project from resume in 2 minutes.",
            "Current affair: impact of AI on campus hiring.",
        ],
    }
    qs = list(base.get(company_id, base["mba-general"]))
    for s in skills[:3]:
        qs.append(f"Question on your skill **{s}**: give a real project example.")
    return qs
