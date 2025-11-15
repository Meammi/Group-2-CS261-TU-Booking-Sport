FROM mcr.microsoft.com/mssql/server:2022-latest

USER root

# ติดตั้ง mssql-tools โดยแก้ปัญหา package conflicts
RUN apt-get update && \
    apt-get install -y curl apt-transport-https gnupg && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/msprod.list && \
    apt-get update && \
    apt-get remove -y unixodbc-common odbcinst libodbcinst2 libodbc2 && \
    ACCEPT_EULA=Y apt-get install -y --allow-downgrades mssql-tools unixodbc-dev && \
    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# สร้างโฟลเดอร์สำหรับ scripts
RUN mkdir -p /docker-entrypoint-initdb.d

# คัดลอก initialization scripts จากโฟลเดอร์ init-scripts
COPY init-scripts/*.sql /docker-entrypoint-initdb.d/

# กลับไปใช้ user mssql
USER mssql

# Expose port
EXPOSE 1433

# เริ่มต้น SQL Server
CMD ["/opt/mssql/bin/sqlservr"]
