`deno run --allow-env --allow-net  --allow-read app.ts`


```
openssl req -x509 -keyout server_key.pem -out server_cert.pem -config openssl.cnf -days 365
openssl req -x509 -keyout client_key.pem -out client_cert.pem -config openssl.cnf -days 365
chmod 400 creds/client_key.pem
```

```
export PGPORT=5444
export PGSSLCERT=creds/client_cert.pem
export PGSSLKEY=creds/client_key.pem
export PGSSLROOTCERT=creds/server_cert.pem
export PGSSLSRVKEY=creds/server_key.pem
export CLIENT_CERT=$(base64 -w 0 creds/client_cert.pem)
export PGSSLMODE=allow
```

```
export AZ_ACCESS_TOKEN=$(az account get-access-token --query accessToken --output tsv | tr -d '\r')
AUTH='{ "azure": { "type": "api_key", "valuePrefix": "Bearer ", "credentialsenvvar": "AZ_ACCESS_TOKEN" } }'
bin/stackql srv --auth="${AUTH}" \
--pgsrv.address=0.0.0.0 \
--pgsrv.port=$PGPORT \
--pgsrv.tls='{ "keyFilePath": "'${PGSSLSRVKEY}'", "certFilePath": "'${PGSSLROOTCERT}'", "clientCAs": [ "'${CLIENT_CERT}'" ] }'

bin/stackql srv \
--pgsrv.address=0.0.0.0 \
--pgsrv.port=$PGPORT \
--pgsrv.tls='{ "keyFilePath": "'${PGSSLSRVKEY}'", "certFilePath": "'${PGSSLROOTCERT}'", "clientCAs": [ "'${CLIENT_CERT}'" ] }'
```

```
SELECT name, location from azure.compute.virtual_machines where subscriptionId = '631d1c6d-2a65-43e7-93c2-688bfe4e1468'
```