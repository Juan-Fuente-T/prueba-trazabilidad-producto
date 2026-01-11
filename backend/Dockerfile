
# Usa la imagen que ya tiene Maven para compilar el código
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copia solo el archivo de dependencias primero (para aprovechar caché)
COPY pom.xml .
# Descarga las librerías (esto tarda la primera vez)
RUN mvn dependency:go-offline -B

# Copia el código fuente
COPY src ./src

# Compila y crea el .jar (saltando los tests para ir rápido)
RUN mvn clean package -DskipTests

# ETAPA EJECUCIÓN 
# Usa una imagen ligera solo para ejecutar
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiael .jar que creó en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Abre el puerto 8080 (interno del contenedor)
EXPOSE 8080

# Comando para arrancar
ENTRYPOINT ["java", "-jar", "app.jar"]