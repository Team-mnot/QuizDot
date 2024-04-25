FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp

ARG JAR_FILE=build/libs/*.jar
ARG KEY_FILE_PATH

COPY ${JAR_FILE} app.jar
COPY ${KEY_FILE_PATH} /app/config/application-key.yml

ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8081