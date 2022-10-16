## credentials
export AWS_ACCESS_KEY_ID=YOURAWSACCESSKEYID
export AWS_SECRET_ACCESS_KEY=YOURAWSSECRETACCESSKEY
AZ_ACCESS_TOKEN_RAW=$(az account get-access-token --query accessToken --output tsv)
export AZ_ACCESS_TOKEN=`echo $AZ_ACCESS_TOKEN_RAW | tr -d '\r'`
export GITHUB_CREDS=$(echo -n 'yourusername:ghp_YOURPERSONALACCESSTOKEN' | base64)
export OKTA_SECRET_KEY=YOUROKTASECRETKEY # Okta API Token
export NETLIFY_TOKEN=YOURAPITOKEN

# auth objects
AWS_AUTH='{ "type": "aws_signing_v4", "credentialsenvvar": "AWS_SECRET_ACCESS_KEY", "keyIDenvvar": "AWS_ACCESS_KEY_ID" }'
AZURE_AUTH='{ "type": "bearer", "credentialsenvvar": "AZ_ACCESS_TOKEN" }'
GITHUB_AUTH='{ "type": "basic", "credentialsenvvar": "GITHUB_CREDS" }'
OKTA_AUTH='{ "type": "api_key", "credentialsenvvar": "OKTA_SECRET_KEY" }'
NETLIFY_AUTH='{ "type": "bearer", "credentialsenvvar": "NETLIFY_TOKEN" }'

## auth struct
template='{ "aws": %s, "azure": %s, "github": %s, "okta": %s, "netlify": %s }'
export AUTH_STR=$(printf "$template" "$AWS_AUTH","$AZURE_AUTH","$GITHUB_AUTH","$OKTA_AUTH","$NETLIFY_AUTH")

## build and run env
docker compose up --build

## demo playground @ localhost:3000
## demo API using Postman or curl @ localhost:8080

## remove containers
docker compose down