# StackQL Middleware

REST API middleware server that enables SQL-based queries against cloud provider APIs using [StackQL](https://github.com/stackql/stackql).

## Features

- SQL query execution against cloud services
- Provider/service/resource discovery
- Query result type generation
- Response metadata
- CORS support

## Quick Start

```bash
# Start dependencies
docker compose up -d runner

# Start server
cd src
deno run --allow-net --allow-env app.ts
```

## API Endpoints

### Query Execution
```http
POST /stackql
Content-Type: application/json

{
  "query": "SELECT name, id FROM google.compute.instances",
  "showMetadata": true
}
```

### Provider Discovery
```http
GET /providers
GET /providers/{provider}/services
GET /providers/{provider}/services/{service}/resources 
GET /providers/{provider}/services/{service}/resources/{resource}
GET /providers/{provider}/services/{service}/resources/{resource}/methods
```

## Development

```bash
# Install Deno
curl -fsSL https://deno.land/x/install/install.sh | sh

# Development with hot reload
deno run --allow-net --allow-env --watch app.ts
```

## Docker

```bash
# Build and start all services
docker compose up --build
```

## Environment Variables

- `HOST` - Server host (default: 0.0.0.0)
- `PORT` - Server port (default: 8080)
- `DB_HOST` - StackQL server host (default: localhost) 
- `DB_PORT` - StackQL server port (default: 5444)
- `LOGLEVEL` - Logging level (default: INFO)

## Architecture

- Oak-based HTTP server (Deno)
- PostgreSQL wire protocol client for StackQL communication
- Modular routing and controller structure
- Centralized error handling
- TypeScript throughout