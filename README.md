# CampusAI — Full-Stack Gen AI Campus Recruitment Platform

> **College Top Project Ready** · Microservices · ML Salary Prediction · RAG Career Coach · LangChain AI Agents

![Stack](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![LangChain](https://img.shields.io/badge/LangChain-RAG-green) ![Docker](https://img.shields.io/badge/Docker-Compose-blue) ![Spring](https://img.shields.io/badge/Spring_Boot-3.2-green)

---

## Project Highlights (For Judges / Submission)

| Category | Implementation |
|----------|----------------|
| **Gen AI** | OpenAI APIs, LangChain, RAG, Prompt Engineering, AI Agents, Chroma Vector DB |
| **Languages** | TypeScript, JavaScript, Java, Python |
| **Frontend** | React, Next.js 14, Tailwind CSS, Framer Motion (SPA home + 5 pages) |
| **Backend** | Node.js Express Gateway, FastAPI ML/AI, Spring Boot Auth |
| **Databases** | MongoDB (logs), CSV analytics, Chroma (vectors) |
| **DevOps** | Docker Compose, GitHub Actions CI/CD, AWS-ready layout |
| **ML** | Ridge Regression + StandardScaler on 215 MBA records |

---

## Architecture (Microservices)

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Next.js + TypeScript)          :3000             │
│  SPA Home · Predict · AI Coach · Analytics · About          │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  API Gateway (Node.js + TypeScript)         :4000           │
└─┬──────────────┬──────────────┬──────────────┬──────────────┘
  │              │              │              │
  ▼              ▼              ▼              ▼
ML :5001    AI :5002    Auth :8081    MongoDB :27017
(FastAPI)   (RAG+Agent) (Spring)     (chat logs)
```

---

## Folder Structure

```
project-code/
├── frontend/                 # Next.js 14 + TypeScript
│   └── src/
│       ├── app/              # Pages (SPA home + routes)
│       ├── components/       # UI components
│       ├── lib/api.ts        # API client
│       └── types/
├── services/
│   ├── api-gateway/          # Express + MongoDB
│   ├── ml-service/           # FastAPI salary prediction
│   ├── ai-service/           # LangChain RAG + Agents
│   └── auth-service/         # Java Spring Boot
├── data/
│   ├── train.csv
│   └── knowledge/            # RAG documents
├── scripts/start-dev.ps1     # One-click Windows start
├── docker-compose.yml
├── .github/workflows/ci.yml
├── legacy/                   # Original Flask app (reference)
│   ├── app.py
│   └── templates/
└── notebook.ipynb
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | **Single-page application** — Hero, Features, How it Works, Tech Stack |
| `/dashboard` | Student dashboard — stats, quick actions, services status |
| `/predict` | ML salary prediction form |
| `/ai-coach` | RAG chat + LangChain AI Agent career plan |
| `/analytics` | Dataset statistics dashboard |
| `/career-hub` | Resume match, skill gaps, scoring, interview & GD prep |
| `/coding-profiles` | GitHub, LinkedIn, HackerRank, LeetCode & more profile links |
| `/about` | Project documentation for submission |

**Color theme:** Mint `#a5dacc` · Accent `#007BFF` · White cards (original campus branding)

---

## Quick Start (Windows)

### 1. Prerequisites
- Node.js 20+, Python 3.11+, Java 17+ (optional for auth)
- Copy `.env.example` → `.env` and add `OPENAI_API_KEY` (optional)

### 2. Train ML model (if `model.pkl` missing)
```powershell
cd services\ml-service
pip install pandas scikit-learn
python train_model.py
```
Or run `notebook.ipynb` and copy `model.pkl`, `scaler.pkl` to `services/ml-service/`.

### 3. Start all services
```powershell
.\scripts\start-dev.ps1
```

### 4. Open browser
**http://localhost:3000**

---

## Manual Start (step by step)

```powershell
# Terminal 1 — ML
cd services\ml-service
pip install -r requirements.txt
uvicorn app:app --port 5001

# Terminal 2 — AI (RAG works offline; OpenAI optional)
cd services\ai-service
pip install -r requirements.txt
uvicorn main:app --port 5002

# Terminal 3 — Gateway
cd services\api-gateway
npm install && npm run dev

# Terminal 4 — Frontend
cd frontend
npm install && npm run dev
```

---

## Docker (Full Stack)

```bash
docker compose up --build
```

---

## Gen AI Stack Details

| Tech | File | Purpose |
|------|------|---------|
| **OpenAI** | `services/ai-service/rag_engine.py` | LLM answers with RAG context |
| **LangChain** | `rag_engine.py`, `agent.py` | Chains, prompts, agents |
| **RAG** | `data/knowledge/` + Chroma | Retrieval-augmented career advice |
| **Vector DB** | Chroma (`chroma_db/`) | Embeddings storage |
| **AI Agents** | `agent.py` | Multi-step readiness + action plan |
| **Prompt Engineering** | `SYSTEM_PROMPT` in RAG | Structured coach persona |

Without `OPENAI_API_KEY`, the system runs in **offline RAG fallback mode** (still demo-ready).

---

## API Endpoints (Gateway :4000)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | All services health |
| POST | `/api/predict` | Salary prediction |
| POST | `/api/chat` | RAG career Q&A |
| POST | `/api/agent/plan` | AI agent career plan |
| POST | `/api/resume/match` | Resume vs company + skill gaps + GD |
| POST | `/api/resume/score` | Resume scoring (5 categories) |
| POST | `/api/interview/prep` | HR, technical, GD, checklist |
| GET | `/api/companies` | Target company list |
| GET | `/api/analytics` | Dataset stats |
| POST | `/api/auth/login` | Spring auth (demo JWT) |

---

## College Submission Checklist

- [x] Full-stack microservices architecture diagram
- [x] TypeScript frontend with multiple pages
- [x] ML model with real dataset (`train.csv`)
- [x] Gen AI: RAG + LangChain + Agents + Vector DB
- [x] OpenAI integration (with offline fallback)
- [x] MongoDB logging, Spring auth, Docker, CI/CD
- [x] README with run instructions
- [x] Original campus color branding preserved

---

## Legacy Flask App

Original single-file app moved to `legacy/` for reference. Use the new **Next.js frontend** for submission.

---

## Author

Campus Recruitment Prediction — Enhanced to **CampusAI** Full-Stack Gen AI Platform for college project submission.
