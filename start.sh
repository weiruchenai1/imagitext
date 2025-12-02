#!/bin/bash

echo "Starting ImagiText Backend and Frontend..."
echo ""

# Start backend server in background
echo "Starting backend server on port 3001..."
cd server && npm start &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 3

# Return to root directory
cd ..

# Start frontend dev server
echo "Starting frontend dev server on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both services are running:"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
