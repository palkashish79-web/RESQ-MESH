@echo off
title RESQ-MESH Multi-Service Starter
echo ========================================================
echo       STARTING RESQ-MESH SYSTEM PLATFORM
echo ========================================================

echo Starting Python AI Service...
start "AI Service" cmd /k "cd ai-service && python -m pip install fastapi uvicorn && python main.py"

echo Starting Backend Server...
start "Backend Node" cmd /k "cd backend && npm install && node server.js"

echo Starting Frontend Web...
start "Frontend Vite" cmd /k "cd frontend && npm install && npm run dev"

echo All services dispatched! Open browser at http://localhost:3000
pause
