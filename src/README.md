## 1. generate keys

```
openssl req -x509 -keyout creds/server_key.pem -out creds/server_cert.pem -config creds/openssl.cnf -days 365
openssl req -x509 -keyout creds/client_key.pem -out creds/client_cert.pem -config creds/openssl.cnf -days 365
chmod 400 creds/client_key.pem
```

## 2. set env vars

```
export PGPORT=5444
export PGSSLCERT=creds/client_cert.pem
export PGSSLKEY=creds/client_key.pem
export PGSSLROOTCERT=creds/server_cert.pem
export PGSSLSRVKEY=creds/server_key.pem
export CLIENT_CERT=$(base64 -w 0 creds/client_cert.pem)
export PGSSLMODE=allow
```

## 3a. start stackql sever with no auth

```
bin/stackql srv \
--pgsrv.address=0.0.0.0 \
--pgsrv.port=$PGPORT \
--pgsrv.tls='{ "keyFilePath": "'${PGSSLSRVKEY}'", "certFilePath": "'${PGSSLROOTCERT}'", "clientCAs": [ "'${CLIENT_CERT}'" ] }'
```

## 3b. start stackql server with auth

```
export AZ_ACCESS_TOKEN=$(az account get-access-token --query accessToken --output tsv | tr -d '\r')
AUTH='{ "azure": { "type": "api_key", "valuePrefix": "Bearer ", "credentialsenvvar": "AZ_ACCESS_TOKEN" } }'
bin/stackql srv --auth="${AUTH}" \
--pgsrv.address=0.0.0.0 \
--pgsrv.port=$PGPORT \
--pgsrv.tls='{ "keyFilePath": "'${PGSSLSRVKEY}'", "certFilePath": "'${PGSSLROOTCERT}'", "clientCAs": [ "'${CLIENT_CERT}'" ] }'
```

## 4. start middleware server

```
deno run --allow-env --allow-net  --allow-read app.ts
```

