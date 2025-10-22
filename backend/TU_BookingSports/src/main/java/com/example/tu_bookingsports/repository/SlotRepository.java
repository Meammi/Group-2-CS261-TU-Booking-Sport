package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalTime;

@Repository
public interface SlotRepository extends JpaRepository<Slot, UUID> {

    // ดึง Slot ทั้งหมดสำหรับ Room ID ที่ระบุ โดยเรียงตามเวลา
    //List<Slot> findByRoom_Room_idOrderBySlotTimeAsc(UUID roomId);
    @Query("SELECT s FROM Slot s WHERE s.room.room_id = :roomId ORDER BY s.slotTime ASC")
    List<Slot> findSlotsByRoomId(@Param("roomId") UUID roomId);

    @Query("SELECT s FROM Slot s WHERE s.slotId = :slotId AND s.room.room_id = :roomId")
    Slot findBySlotIdAndRoom_RoomId(@Param("slotId") UUID slotId, @Param("roomId") UUID roomId);
    // ใน SlotRepository.java

    @Query("SELECT s FROM Slot s WHERE s.room.room_id = :roomId AND s.slotTime = :slotTime")
    Slot findByRoomIdAndSlotTime(@Param("roomId") UUID roomId, @Param("slotTime") LocalTime slotTime);

    // Lightweight projection to avoid reading GUID columns on Slot
    @Query("SELECT s.slotTime AS slotTime, s.status AS status FROM Slot s WHERE s.room.room_id = :roomId ORDER BY s.slotTime ASC")
    List<SlotTimeStatusProjection> findSlotTimeAndStatusByRoomId(@Param("roomId") UUID roomId);

    // Native query to compare SQL TIME properly (avoids time vs datetime mismatch)
    @Query(value = "SELECT TOP 1 s.* FROM slots s WHERE s.room_id = :roomId AND s.slot_time = CAST(:slotTime AS time)", nativeQuery = true)
    Slot findByRoomIdAndSlotTimeNative(@Param("roomId") UUID roomId, @Param("slotTime") String slotTime);
}
