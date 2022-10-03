FROM stackql/stackql:latest

WORKDIR /work
USER root
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y wget && \
    apt-get install -y unzip

RUN wget --no-verbose https://github.com/denoland/deno/releases/download/v1.26.0/deno-x86_64-unknown-linux-gnu.zip && \
    unzip deno-x86_64-unknown-linux-gnu.zip && \
    mv deno /bin/deno && \
    chmod +x /bin/deno && \
    rm deno-x86_64-unknown-linux-gnu.zip

# download stackql providers
RUN stackql exec 'registry pull aws v0.1.3'