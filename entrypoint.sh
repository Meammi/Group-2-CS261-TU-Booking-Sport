#!/bin/bash
set -e

echo "Starting backend (Spring Boot)..."
java -jar /app/backend/app.war &
BACKEND_PID=$!

echo "Waiting for backend to initialize..."
sleep 5

echo "Starting frontend (Next.js)..."
cd /app/frontend
npm start &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Both services are running!"

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
