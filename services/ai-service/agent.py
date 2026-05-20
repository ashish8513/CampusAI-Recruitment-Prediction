"""LangChain AI Agent — multi-step career planning."""
import os
from rag_engine import rag_answer, retrieve_context

AGENT_TOOLS_DESC = """
Tools available:
1. search_placement_knowledge — RAG over campus guides
2. estimate_readiness — score profile 0-100
"""


def run_career_agent(goal: str, profile: dict) -> dict:
    """Agent orchestration: retrieve → analyze → recommend."""
    steps = []

    ctx = retrieve_context(goal)
    steps.append({"step": "retrieve", "detail": f"Retrieved {len(ctx)} chars of context"})

    readiness = _score_profile(profile)
    steps.append({"step": "analyze", "detail": f"Readiness score: {readiness}/100"})

    rag = rag_answer(
        f"Career goal: {goal}. Give a 3-step action plan.",
        student_profile=profile,
    )
    steps.append({"step": "recommend", "detail": "Generated personalized plan"})

    plan = rag["answer"]
    if readiness < 50:
        plan += "\n\n⚠️ Focus on improving MBA % and e-test scores first."

    return {
        "goal": goal,
        "readiness_score": readiness,
        "action_plan": plan,
        "agent_steps": steps,
        "mode": rag["mode"],
    }


def _score_profile(p: dict) -> int:
    score = 40
    for key, weight in [
        ("mba_p", 25), ("etest_p", 20), ("degree_p", 15),
        ("hsc_p", 10), ("ssc_p", 10),
    ]:
        v = float(p.get(key, 0) or 0)
        if v >= 70:
            score += weight
        elif v >= 60:
            score += weight // 2
    if p.get("workex") == 1 or str(p.get("workex")).lower() == "yes":
        score += 10
    return min(100, score)
