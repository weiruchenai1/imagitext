@echo off
echo Starting ImagiText Backend and Frontend...
echo.

REM Start backend server in a new window
start "ImagiText Backend" cmd /k "cd server && npm start"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak > nul

REM Start frontend dev server in a new window
start "ImagiText Frontend" cmd /k "npm run dev"

echo.
echo Both services are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
pause
