#!/bin/sh
./duckdb mydatabase.db ".databases" > /dev/null 2>&1 || ./duckdb mydatabase.db
touch /app/healthy
tail -f /dev/null