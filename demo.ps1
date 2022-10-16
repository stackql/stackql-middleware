## credentials
$Env:AWS_ACCESS_KEY_ID = "YOURAWSACCESSKEYID"
$Env:AWS_SECRET_ACCESS_KEY = "YOURAWSSECRETACCESSKEY"
$Env:AZ_ACCESS_TOKEN = "$(az account get-access-token --query accessToken --output tsv)".Trim("`r")
$Env:GITHUB_CREDS = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("yourusername:ghp_YOURPERSONALACCESSTOKEN"))
$Env:OKTA_SECRET_KEY = "YOUROKTASECRETKEY"
$Env:NETLIFY_TOKEN = "YOURAPITOKEN"

# auth objects
$aws = "{ 'type': 'aws_signing_v4', 'credentialsenvvar': 'AWS_SECRET_ACCESS_KEY', 'keyIDenvvar': 'AWS_ACCESS_KEY_ID' }"
$azure = "{ 'type': 'bearer', 'credentialsenvvar': 'AZ_ACCESS_TOKEN' }"
$github = "{ 'type': 'basic', 'credentialsenvvar': 'GITHUB_CREDS' }"
$okta = "{ 'type': 'api_key', 'credentialsenvvar': 'OKTA_SECRET_KEY' }"
$netlify = "{ 'type': 'bearer', 'credentialsenvvar': 'NETLIFY_TOKEN' }"

## auth struct
$Env:AUTH_STR = "{ 'aws': $($aws), 'azure': $($azure), 'github': $($github), 'okta': $($okta), 'netlify': $($netlify) }"

## build and run env
docker compose up --build

## demo playground @ localhost:3000
## demo API using Postman or curl @ localhost:8080

## remove containers
docker compose down