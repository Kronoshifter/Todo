FROM node:20.10.0 AS ng-build
WORKDIR /home/web/src
COPY web/package*.json ./
RUN npm install --legacy-peer-deps
COPY web/ .
RUN npm run build:prod

FROM gradle:8.4-jdk17 AS gradle-build
COPY --chown=gradle:gradle . /home/gradle/src
COPY --from=ng-build /home/web/src/dist/todo /home/gradle/src/src/main/resources/web
WORKDIR /home/gradle/src
RUN gradle buildFatJar --no-daemon

FROM eclipse-temurin:17
EXPOSE 12188
RUN mkdir /app
COPY --from=gradle-build /home/gradle/src/build/libs/*.jar /app/app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
