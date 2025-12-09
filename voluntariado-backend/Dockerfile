# 1. Build del proyecto usando Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos el proyecto
COPY . .

# Construimos el JAR (sin tests)
RUN mvn clean package -DskipTests

# 2. Imagen final con Java
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copiamos el jar compilado desde el paso anterior
COPY --from=build /app/target/*.jar app.jar

# Render asigna el puerto por variable de entorno PORT
ENV PORT=8080
EXPOSE 8080

# Ejecutamos la app
ENTRYPOINT ["java", "-jar", "app.jar"]
