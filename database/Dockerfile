FROM mcr.microsoft.com/mssql/server:2022-latest

USER root

RUN apt-get update && \
    apt-get install -y curl apt-transport-https gnupg && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list | tee /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 mssql-tools unixodbc-dev && \
    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> /etc/profile

# สร้างโฟลเดอร์สำหรับ scripts
RUN mkdir -p /var/opt/mssql/scripts

# คัดลอก initialization scripts
COPY init.sql /var/opt/mssql/scripts/init.sql
COPY init-db.sh /var/opt/mssql/scripts/init-db.sh

# ทำให้ script executable
RUN chmod +x /var/opt/mssql/scripts/init-db.sh

USER mssql
