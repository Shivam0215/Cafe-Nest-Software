# STEP 1: Use Maven with Java 22
FROM maven:3.9.6-eclipse-temurin-22 AS build
WORKDIR /app
COPY Backend/cafe-backend /app
RUN mvn clean package -DskipTests

# STEP 2: Use Java 22 runtime
FROM eclipse-temurin:22-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]
