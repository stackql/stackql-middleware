# src/Dockerfile
FROM denoland/deno:latest
WORKDIR /app
COPY . .
RUN deno cache --reload --unstable app.ts
EXPOSE 8080
CMD ["run", "--allow-net", "--allow-env", "--watch", "app.ts"]