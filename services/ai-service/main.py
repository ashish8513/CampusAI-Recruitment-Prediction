"""AI Microservice — OpenAI + LangChain + RAG + Agents."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from rag_engine import rag_answer, build_vectorstore
from agent import run_career_agent
from resume_tools import match_resume_to_company, score_resume, prepare_interview, COMPANY_PROFILES

app = FastAPI(title="Campus AI Service", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class ChatRequest(BaseModel):
    message: str
    profile: Optional[dict] = None


class AgentRequest(BaseModel):
    goal: str
    profile: dict


class ResumeMatchRequest(BaseModel):
    resume_text: str = ""
    user_skills: str = ""
    company_id: str = "mba-general"


class ResumeScoreRequest(BaseModel):
    resume_text: str = ""
    user_skills: str = ""


class InterviewPrepRequest(BaseModel):
    company_id: str = "mba-general"
    user_skills: str = ""
    resume_text: str = ""


@app.on_event("startup")
def startup():
    build_vectorstore()


@app.get("/health")
def health():
    import os
    return {
        "service": "ai-service",
        "status": "ok",
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "features": ["RAG", "LangChain", "AI Agents", "Chroma Vector DB", "Prompt Engineering"],
    }


@app.post("/chat")
def chat(req: ChatRequest):
    result = rag_answer(req.message, req.profile)
    return {"reply": result["answer"], "mode": result["mode"], "sources": result["sources_used"]}


@app.post("/agent/plan")
def agent_plan(req: AgentRequest):
    return run_career_agent(req.goal, req.profile)


@app.get("/companies")
def list_companies():
    return {
        "companies": [
            {"id": k, "name": v["name"]} for k, v in COMPANY_PROFILES.items()
        ]
    }


@app.post("/resume/match")
def resume_match(req: ResumeMatchRequest):
    return match_resume_to_company(req.resume_text, req.user_skills, req.company_id)


@app.post("/resume/score")
def resume_score(req: ResumeScoreRequest):
    return score_resume(req.resume_text, req.user_skills)


@app.post("/interview/prep")
def interview_prep(req: InterviewPrepRequest):
    return prepare_interview(req.company_id, req.user_skills, req.resume_text)
