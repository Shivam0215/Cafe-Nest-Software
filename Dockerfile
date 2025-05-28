# STEP 1: Build jar file
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY Backend/cafe-backend /app
RUN mvn clean package -DskipTests

# STEP 2: Run the jar
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]
