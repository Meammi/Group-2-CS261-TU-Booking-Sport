package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface SlotRepository extends JpaRepository<Slot, UUID> {

    // ดึง Slot ทั้งหมดสำหรับ Room ID ที่ระบุ โดยเรียงตามเวลา
    //List<Slot> findByRoom_Room_idOrderBySlotTimeAsc(UUID roomId);
    @Query("SELECT s FROM Slot s WHERE s.room.room_id = :roomId ORDER BY s.slotTime ASC")
    List<Slot> findSlotsByRoomId(@Param("roomId") UUID roomId);
}