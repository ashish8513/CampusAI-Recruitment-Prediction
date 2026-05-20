# CampusAI System Architecture

## Microservices

1. **frontend** — Next.js 14, TypeScript, client-side routing, REST to gateway
2. **api-gateway** — BFF pattern, aggregates ML + AI + Auth, MongoDB audit logs
3. **ml-service** — Stateless inference, Ridge + StandardScaler
4. **ai-service** — RAG pipeline, optional OpenAI, Chroma vector store, career agent
5. **auth-service** — Spring Boot JWT-style demo auth

## Data Flow — Prediction

User → Next.js → Gateway POST /api/predict → ML encode features → scaler → model → JSON salary

## Data Flow — RAG Chat

User question → Gateway → AI service → Chroma retrieve top-k chunks → LangChain prompt → OpenAI (or fallback)

## Scalability (AWS-ready)

- Containerize each service (Dockerfile provided)
- Gateway behind ALB
- MongoDB Atlas / DocumentDB
- ECS or EKS deployment via docker-compose extension
