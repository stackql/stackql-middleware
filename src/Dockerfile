FROM denoland/deno:latest
EXPOSE 8080
WORKDIR /app
USER deno
# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
# COPY deps.ts .
# RUN deno cache deps.ts
# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache app.ts
CMD ["run", "--allow-env", "--allow-net", "--allow-read", "--unsafely-ignore-certificate-errors=localhost", "app.ts"]
