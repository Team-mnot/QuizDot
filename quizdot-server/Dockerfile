FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp

ARG JAR_FILE=build/libs/*.jar

COPY ${JAR_FILE} app.jar
COPY application-key.yml /app/config/application-key.yml

ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8081