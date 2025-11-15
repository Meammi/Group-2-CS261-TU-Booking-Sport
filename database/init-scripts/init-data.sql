USE [myDB1];
GO

-- Delete existing data (if tables exist)
IF OBJECT_ID('slots', 'U') IS NOT NULL
    DELETE FROM slots;
IF OBJECT_ID('rooms', 'U') IS NOT NULL
    DELETE FROM rooms;
GO

-- 🏸 Gym 4
DECLARE @i INT = 1;
WHILE @i <= 13
BEGIN
    INSERT INTO rooms (room_id, name, type, capacity, loc_name, price, created_at, updated_at, id, latitude, longitude)
    VALUES (
        NEWID(),
        CONCAT('Court ', @i),
        'Badminton',
        10,
        'Gym 4',
        0,
        GETDATE(),
        GETDATE(),
        @i,
        14.065960200330666,
        100.60368867644468
    );
    SET @i += 1;
END
GO

-- 🏸 Interzone
DECLARE @i INT = 1;
WHILE @i <= 20
BEGIN
    INSERT INTO rooms (room_id, name, type, capacity, loc_name, price, created_at, updated_at, id, latitude, longitude)
    VALUES (
        NEWID(),
        CONCAT('Court ', @i),
        'Badminton',
        4,
        'Interzone',
        0,
        GETDATE(),
        GETDATE(),
        @i,
        14.076520,
        100.597078
    );
    SET @i += 1;
END
GO

-- 🎤 Karaoke
INSERT INTO rooms (room_id, name, type, capacity, loc_name, price, created_at, updated_at, id, latitude, longitude)
VALUES 
(NEWID(), 'Karaoke S', 'Karaoke Room', 4, 'Melodysphere', 150, GETDATE(), GETDATE(), 1, 14.069712613500355, 100.60072111203567),
(NEWID(), 'Karaoke M1', 'Karaoke Room', 8, 'Melodysphere', 180, GETDATE(), GETDATE(), 2, 14.069712613500355, 100.60072111203567),
(NEWID(), 'Karaoke M2', 'Karaoke Room', 8, 'Melodysphere', 180, GETDATE(), GETDATE(), 3, 14.069712613500355, 100.60072111203567),
(NEWID(), 'Karaoke XL', 'Karaoke Room', 15, 'Melodysphere', 200, GETDATE(), GETDATE(), 4, 14.069712613500355, 100.60072111203567),
(NEWID(), 'Karaoke XXL', 'Karaoke Room', 20, 'Melodysphere', 250, GETDATE(), GETDATE(), 5, 14.069712613500355, 100.60072111203567);
GO

-- 🎸 Music Room
INSERT INTO rooms (room_id, name, type, capacity, loc_name, price, created_at, updated_at, id, latitude, longitude)
VALUES
(NEWID(), 'Full Band 1', 'Music Room', 15, 'Melodysphere', 280, GETDATE(), GETDATE(), 1, 14.069712613500355, 100.60072111203567),
(NEWID(), 'Full Band 2', 'Music Room', 15, 'Melodysphere', 280, GETDATE(), GETDATE(), 2, 14.069712613500355, 100.60072111203567);
GO

-- 🕐 Slot Times
IF OBJECT_ID('tempdb..#SlotTimes') IS NOT NULL DROP TABLE #SlotTimes;

CREATE TABLE #SlotTimes (
    type NVARCHAR(50),
    loc_name NVARCHAR(50),
    slot_time TIME
);

-- Badminton Interzone (5 slots)
INSERT INTO #SlotTimes VALUES
('Badminton', 'Interzone', '16:00:00'),
('Badminton', 'Interzone', '17:00:00'),
('Badminton', 'Interzone', '18:00:00'),
('Badminton', 'Interzone', '19:00:00'),
('Badminton', 'Interzone', '20:00:00');

-- Badminton Gym4 (4 slots)
INSERT INTO #SlotTimes VALUES
('Badminton', 'Gym 4', '17:00:00'),
('Badminton', 'Gym 4', '18:00:00'),
('Badminton', 'Gym 4', '19:00:00'),
('Badminton', 'Gym 4', '20:00:00');

-- Karaoke Room (12 slots)
INSERT INTO #SlotTimes VALUES
('Karaoke Room', 'Melodysphere', '10:00:00'),
('Karaoke Room', 'Melodysphere', '11:00:00'),
('Karaoke Room', 'Melodysphere', '12:00:00'),
('Karaoke Room', 'Melodysphere', '13:00:00'),
('Karaoke Room', 'Melodysphere', '14:00:00'),
('Karaoke Room', 'Melodysphere', '15:00:00'),
('Karaoke Room', 'Melodysphere', '16:00:00'),
('Karaoke Room', 'Melodysphere', '17:00:00'),
('Karaoke Room', 'Melodysphere', '18:00:00'),
('Karaoke Room', 'Melodysphere', '19:00:00'),
('Karaoke Room', 'Melodysphere', '20:00:00'),
('Karaoke Room', 'Melodysphere', '21:00:00');

-- Music Room (12 slots)
INSERT INTO #SlotTimes VALUES
('Music Room', 'Melodysphere', '10:00:00'),
('Music Room', 'Melodysphere', '11:00:00'),
('Music Room', 'Melodysphere', '12:00:00'),
('Music Room', 'Melodysphere', '13:00:00'),
('Music Room', 'Melodysphere', '14:00:00'),
('Music Room', 'Melodysphere', '15:00:00'),
('Music Room', 'Melodysphere', '16:00:00'),
('Music Room', 'Melodysphere', '17:00:00'),
('Music Room', 'Melodysphere', '18:00:00'),
('Music Room', 'Melodysphere', '19:00:00'),
('Music Room', 'Melodysphere', '20:00:00'),
('Music Room', 'Melodysphere', '21:00:00');
GO

-- 🔁 Insert slots (only if tables exist)
IF OBJECT_ID('rooms', 'U') IS NOT NULL AND OBJECT_ID('slots', 'U') IS NOT NULL
BEGIN
    INSERT INTO slots (slot_id, room_id, slot_time, status)
    SELECT 
        NEWID(),
        r.room_id,
        t.slot_time,
        'AVAILABLE'
    FROM rooms r
    JOIN #SlotTimes t
        ON r.type = t.type
       AND r.loc_name = t.loc_name;
END
GO

-- ✅ ตรวจสอบผลลัพธ์ (only if tables exist)
IF OBJECT_ID('rooms', 'U') IS NOT NULL AND OBJECT_ID('slots', 'U') IS NOT NULL
BEGIN
    SELECT r.loc_name, r.name AS RoomName, COUNT(s.slot_id) AS TotalSlots
    FROM rooms r
    JOIN slots s ON r.room_id = s.room_id
    GROUP BY r.loc_name, r.name
    ORDER BY r.loc_name, r.name;
END
GO

