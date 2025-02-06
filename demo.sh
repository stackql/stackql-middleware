LOGLEVEL=DEBUG docker compose up --build

docker compose exec api deno test --allow-net tests/api.test.ts

curl -X POST http://localhost:8080/stackql \
     -H "Content-Type: application/json" \
     -d '{
           "query": "SELECT COUNT(*) FROM aws.ec2.instances_list_only WHERE region = '\''$region'\''",
           "params": {
             "region": "ap-southeast-2"
           },
           "showMetadata": true
         }'

curl -X POST http://localhost:8080/stackql \
     -H "Content-Type: application/json" \
     -d '{
           "query": "SELECT COUNT(*) FROM aws.ec2.instances_list_only WHERE region = '\''ap-southeast-2'\''",
           "showMetadata": true
         }'

# SELECT COUNT(*) FROM aws.ec2.instances_list_only WHERE region = 'ap-southeast-2';

docker compose down