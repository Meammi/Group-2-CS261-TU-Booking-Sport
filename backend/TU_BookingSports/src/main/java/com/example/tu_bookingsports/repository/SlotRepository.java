package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {

    // ดึง Slot ทั้งหมดสำหรับ Room ID ที่ระบุ โดยเรียงตามเวลา
    List<Slot> findByRoom_RoomIdOrderBySlotTimeAsc(UUID roomId);
}