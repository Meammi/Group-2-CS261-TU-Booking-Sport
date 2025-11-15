-- สร้าง database ถ้ายังไม่มี
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'myDB1')
BEGIN
    CREATE DATABASE myDB1;
    PRINT 'Database myDB1 created successfully';
END
ELSE
BEGIN
    PRINT 'Database myDB1 already exists';
END
GO

-- ใช้ database myDB1
USE myDB1;
GO

PRINT 'Database myDB1 is ready';
GO