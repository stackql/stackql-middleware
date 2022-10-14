FROM stackql/stackql:latest
EXPOSE 5444
WORKDIR /app
RUN adduser --system --uid 1001 stackql
RUN addgroup --system --gid 1001 stackql
USER stackql
RUN stackql exec 'registry pull aws v0.1.3'
RUN stackql exec 'registry pull azure v0.3.0'
RUN stackql exec 'registry pull google v1.0.4'
RUN stackql exec 'registry pull github v0.3.6'
RUN stackql exec 'registry pull k8s v0.1.1'
RUN stackql exec 'registry pull netlify v0.2.0'
RUN stackql exec 'registry pull okta v0.1.0'