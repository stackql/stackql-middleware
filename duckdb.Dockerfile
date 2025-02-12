FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y wget \
    && wget https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip \
    && apt-get install -y unzip \
    && unzip duckdb_cli-linux-amd64.zip \
    && rm duckdb_cli-linux-amd64.zip \
    && apt-get remove -y wget unzip \
    && apt-get autoremove -y \
    && apt-get clean

WORKDIR /app

COPY scripts/startup.sh /app/
COPY scripts/healthcheck.sh /app/

RUN chmod +x /app/startup.sh /app/healthcheck.sh && \
    mv /duckdb /app/duckdb

EXPOSE 5433

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
    CMD ["/app/healthcheck.sh"]

CMD ["/app/startup.sh"]