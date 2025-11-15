FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /workspace/target/TU_BookingSports-0.0.1-SNAPSHOT.war /app/app.war
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app/app.war"]

