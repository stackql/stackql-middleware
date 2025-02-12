#!/bin/sh
test -f /app/healthy && ./duckdb mydatabase.db ".databases" > /dev/null 2>&1