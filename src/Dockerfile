# src/Dockerfile
FROM denoland/deno:latest

# Install DuckDB dependencies
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install DuckDB shared library
RUN wget https://github.com/duckdb/duckdb/releases/download/v1.2.0/libduckdb-linux-amd64.zip \
    && unzip libduckdb-linux-amd64.zip \
    && mv libduckdb.so /usr/lib/ \
    && rm libduckdb-linux-amd64.zip

WORKDIR /app

COPY . .

# Cache the dependencies
RUN deno cache deps.ts

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "--allow-ffi", "--unstable", "--watch", "app.ts"]