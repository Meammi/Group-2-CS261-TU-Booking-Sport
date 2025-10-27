# =========================
# Stage 1: Build Spring Boot
# =========================
FROM maven:3.9.4-eclipse-temurin-17 as backend-build
WORKDIR /app/backend
COPY backend/TU_BookingSports ./TU_BookingSports
WORKDIR /app/backend/TU_BookingSports
RUN mvn clean package -DskipTests

# =========================
# Stage 2: Build Next.js
# =========================
FROM node:20-slim as frontend-build
WORKDIR /app/frontend
COPY frontend/tu-booking-sport ./tu-booking-sport
WORKDIR /app/frontend/tu-booking-sport
RUN npm ci
RUN npm run build

# =========================
# Stage 3: Final Image
# =========================
FROM openjdk:17-jdk-slim

# Install Node.js + tini
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs tini bash && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend/TU_BookingSports/target/TU_BookingSports-0.0.1-SNAPSHOT.war ./backend/app.war

# Copy frontend (รวมทุกอย่างในโฟลเดอร์เดียว)
COPY --from=frontend-build /app/frontend/tu-booking-sport ./frontend

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
# Normalize line endings (CRLF -> LF) to avoid shebang interpreter issues and ensure executable
RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Expose ports
EXPOSE 8081 3000

# Start both backend and frontend
ENTRYPOINT ["/usr/bin/tini", "--", "/app/entrypoint.sh"]
