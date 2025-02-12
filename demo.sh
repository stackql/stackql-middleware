LOGLEVEL=DEBUG docker compose up --build

docker compose exec api deno test --allow-net tests/api.test.ts
docker compose exec api deno test --allow-net tests/duckdb.test.ts

curl -X POST http://localhost:8080/stackql \
     -H "Content-Type: application/json" \
     -d '{
           "query": "SELECT COUNT(*) as count FROM aws.ec2.instances_list_only WHERE region = '\''$region'\''",
           "params": {
             "region": "ap-southeast-2"
           },
           "showMetadata": true
         }'

curl -X POST http://localhost:8080/stackql \
     -H "Content-Type: application/json" \
     -d '{
           "query": "SELECT COUNT(*) as count FROM aws.ec2.instances_list_only WHERE region = '\''ap-southeast-2'\''",
           "showMetadata": true
         }'

# SELECT COUNT(*) FROM aws.ec2.instances_list_only WHERE region = 'ap-southeast-2';

export SQL_QUERY="SELECT country_region AS country, CAST(SUM(confirmed) AS INTEGER) AS total_confirmed, CAST(SUM(deaths) AS INTEGER) AS total_deaths, COUNT(*) AS record_count FROM read_csv_auto('s3://covid19-lake/archived/enigma-jhu/csv/Enigma-JHU.csv.gz') GROUP BY country_region ORDER BY total_confirmed DESC LIMIT 5"
curl -X POST http://localhost:8080/duckdb \
     -H "Content-Type: application/json" \
     -d "{\"query\": \"${SQL_QUERY}\", \"showMetadata\": true}"

docker compose down