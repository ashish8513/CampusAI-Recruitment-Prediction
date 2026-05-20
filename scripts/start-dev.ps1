# Start all CampusAI microservices (Windows PowerShell)
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Starting ML Service (5001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\services\ml-service'; pip install -q -r requirements.txt; uvicorn app:app --host 127.0.0.1 --port 5001"

Start-Sleep -Seconds 2
Write-Host "Starting AI Service (5002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\services\ai-service'; pip install -q fastapi uvicorn pydantic; python -m uvicorn main:app --host 127.0.0.1 --port 5002"

Start-Sleep -Seconds 2
Write-Host "Starting API Gateway (4000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\services\api-gateway'; npm install; npm run dev"

Start-Sleep -Seconds 3
Write-Host "Starting Frontend (3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm install; npm run dev"

Write-Host ""
Write-Host "Open: http://localhost:3000" -ForegroundColor Green
Write-Host "API:  http://127.0.0.1:4000/health" -ForegroundColor Yellow
Write-Host "AI:   http://127.0.0.1:5002/health  (required for AI Coach chat)" -ForegroundColor Yellow
