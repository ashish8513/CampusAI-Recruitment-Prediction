# CampusAI — Live Deploy Guide

## 1. Vercel (Frontend UI — recommended)

### GitHub se auto deploy
1. https://vercel.com → Login with GitHub  
2. **Add New Project** → Import `ashish8513/CampusAI-Recruitment-Prediction`  
3. **Root Directory:** `frontend`  
4. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL` = leave empty (uses built-in `/api` proxy)  
   - `BACKEND_URL` = your API URL (after Render deploy) e.g. `https://campusai-gateway.onrender.com`  
5. Deploy → Live URL: `https://campusai-recruitment-prediction.vercel.app` (example)

### CLI
```bash
cd frontend
npx vercel --prod
```

---

## 2. Docker (Full stack local / server)

### Run locally
```bash
docker compose -f docker-compose.prod.yml up --build
```
- **UI:** http://localhost:3000  
- **API:** http://localhost:4000  

### Push to Docker Hub
```bash
docker login
docker compose -f docker-compose.prod.yml build
docker push ashish8513/campusai-frontend:latest
docker push ashish8513/campusai-gateway:latest
docker push ashish8513/campusai-ml:latest
docker push ashish8513/campusai-ai:latest
```

**Docker Hub links:**
- https://hub.docker.com/r/ashish8513/campusai-frontend  
- https://hub.docker.com/r/ashish8513/campusai-gateway  
- https://hub.docker.com/r/ashish8513/campusai-ml  

### Pull & run (anyone)
```bash
docker pull ashish8513/campusai-frontend:latest
# Use docker-compose.prod.yml from repo for full stack
```

---

## 3. Render (Free backend API)

1. https://render.com → New **Blueprint** → connect GitHub repo  
2. Uses `render.yaml` in repo root  
3. Copy **campusai-gateway** URL → paste in Vercel `BACKEND_URL`  
4. Redeploy Vercel  

---

## Quick links summary

| What | URL |
|------|-----|
| GitHub | https://github.com/ashish8513/CampusAI-Recruitment-Prediction |
| Vercel UI | *your-project*.vercel.app (after import) |
| Docker local | http://localhost:3000 |
