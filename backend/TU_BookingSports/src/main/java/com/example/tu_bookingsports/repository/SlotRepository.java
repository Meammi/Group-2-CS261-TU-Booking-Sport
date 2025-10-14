package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.Rooms;
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
    @Query("SELECT s FROM Slot s WHERE s.room.roomId = :roomId ORDER BY s.slotTime ASC")
    List<Slot> findSlotsByRoomId(@Param("roomId") UUID roomId);

    @Query("SELECT s FROM Slot s WHERE s.slotId = :slotId AND s.room.roomId = :roomId")
    Slot findBySlotIdAndRoom_RoomId(@Param("slotId") UUID slotId, @Param("roomId") UUID roomId);
    // ใน SlotRepository.java


    Slot findByRoom_RoomIdAndSlotTime(UUID roomId,LocalTime slotTime);
}