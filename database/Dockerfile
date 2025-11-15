FROM mcr.microsoft.com/mssql/server:2022-latest

# Elevate permissions
USER root

# Create a folder for scripts
RUN mkdir -p /var/opt/mssql/scripts

# Copy initialization scripts
COPY init.sql /var/opt/mssql/scripts/init.sql
COPY init-db.sh /var/opt/mssql/scripts/init-db.sh

# Make script executable
RUN chmod +x /var/opt/mssql/scripts/init-db.sh

# Switch back to mssql user
USER mssql
