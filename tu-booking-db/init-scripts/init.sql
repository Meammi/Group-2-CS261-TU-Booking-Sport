-- สร้าง database ถ้ายังไม่มี
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'myDB1')
BEGIN
    CREATE DATABASE myDB1;
END
GO

