FROM maven:3.8.5-openjdk-17
WORKDIR /app
COPY . .
RUN mvn clean package
CMD ["java", "-jar", "target/SimpleServer-1.0.jar"]