#!/bin/bash
set -euo pipefail

DB_HOST=${DB_HOST:-db}
SA_PASSWORD=${SA_PASSWORD:-YourStrong@Passw0rd}
DB_NAME="myDB1"
INIT_FILE="/init.sql"

MAX_RETRIES=60

echo "Waiting for SQL Server ($DB_HOST) to be ready..."
for i in $(seq 1 $MAX_RETRIES); do
    if /opt/mssql-tools/bin/sqlcmd -S "$DB_HOST" -U sa -P "$SA_PASSWORD" -Q "SELECT 1" &>/dev/null; then
        echo "SQL Server is ready!"
        break
    fi
    echo "Waiting for SQL Server... ($i/$MAX_RETRIES)"
    sleep 2
    if [ "$i" -eq "$MAX_RETRIES" ]; then
        echo "Error: SQL Server did not start in time."
        exit 1
    fi
done

sleep 5

echo "Creating database $DB_NAME if it doesn't exist..."
/opt/mssql-tools/bin/sqlcmd -S "$DB_HOST" -U sa -P "$SA_PASSWORD" -d master \
-Q "IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '$DB_NAME') CREATE DATABASE [$DB_NAME]"

sleep 3

echo "Waiting for tables to be created by Spring Boot..."
for i in $(seq 1 $MAX_RETRIES); do
    RESULT=$(/opt/mssql-tools/bin/sqlcmd -S "$DB_HOST" -U sa -P "$SA_PASSWORD" -d "$DB_NAME" \
    -Q "IF OBJECT_ID('rooms', 'U') IS NOT NULL SELECT 1 ELSE SELECT 0" -h -1 -W 2>/dev/null | tr -d '[:space:]' || echo "0")
    
    if [ "$RESULT" = "1" ]; then
        echo "Tables are ready!"
        break
    fi

    echo "Waiting for tables... ($i/$MAX_RETRIES)"
    sleep 5

    if [ "$i" -eq "$MAX_RETRIES" ]; then
        echo "Error: Tables were not created in time."
        exit 1
    fi
done

if [ ! -f "$INIT_FILE" ]; then
    echo "Error: Initialization file $INIT_FILE not found!"
    exit 1
fi

echo "Running initialization script..."
/opt/mssql-tools/bin/sqlcmd -S "$DB_HOST" -U sa -P "$SA_PASSWORD" -d "$DB_NAME" -i "$INIT_FILE"

echo "Database initialization completed successfully!"
