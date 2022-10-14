FROM stackql/stackql:latest
EXPOSE 5444
WORKDIR /app
USER stackql
RUN deno cache app.ts
CMD ["run", "--allow-env", "--allow-net", "--allow-read", "--unsafely-ignore-certificate-errors=localhost", "app.ts"]


