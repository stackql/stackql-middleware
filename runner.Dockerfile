FROM stackql/stackql:latest
EXPOSE 5444
WORKDIR /home/stackql
RUN adduser --system --uid 1001 stackql
RUN addgroup --system --gid 1001 stackql
RUN chown stackql:stackql /home/stackql
RUN chown stackql:stackql /srv
USER stackql
RUN stackql exec 'registry pull aws'
RUN stackql exec 'registry pull azure'
RUN stackql exec 'registry pull google'
RUN stackql exec 'registry pull github'
RUN stackql exec 'registry pull k8s'
RUN stackql exec 'registry pull netlify'
RUN stackql exec 'registry pull okta'