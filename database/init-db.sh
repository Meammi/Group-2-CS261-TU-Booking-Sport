#!/bin/bash
set -euo pipefail

DB_HOST=${DB_HOST:-db}
SA_PASSWORD=${SA_PASSWORD:-YourStrong@Passw0rd}

echo "Waiting for SQL Server ($DB_HOST) to be ready..."
for i in {1..60}; do
    if /opt/mssql-tools/bin/sqlcmd -S "$DB_HOST" -U sa -P "$SA_PASSWORD" -Q "SELECT 1" &> /dev/null; then
        echo "SQL Server is ready!"
        break
    fi
    echo "Waiting for SQL Server... ($i/60)"
    sleep 2
done

sleep 5

echo "Creating database myDB1 if it doesn't exist..."
/opt/mssql-tools/bin/sqlcmd -S "$DB_HOST" -U sa -P "$SA_PASSWORD" -d master -Q "IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'myDB1') CREATE DATABASE myDB1"

sleep 3

echo "Waiting for tables to be created by Spring Boot..."
for i in {1..60}; do
    RESULT=$(/opt/mssql-tools/bin/sqlcmd -S "$DB_HOST" -U sa -P "$SA_PASSWORD" -d myDB1 -Q "IF OBJECT_ID('rooms', 'U') IS NOT NULL SELECT 1 ELSE SELECT 0" -h -1 -W 2>/dev/null | tr -d '[:space:]' || echo "0")
    if [ "$RESULT" = "1" ]; then
        echo "Tables are ready!"
        break
    fi
    echo "Waiting for tables... ($i/60)"
    sleep 5
done

echo "Running initialization script..."
/opt/mssql-tools/bin/sqlcmd -S "$DB_HOST" -U sa -P "$SA_PASSWORD" -d myDB1 -i /init.sql

echo "Database initialization completed successfully!"
