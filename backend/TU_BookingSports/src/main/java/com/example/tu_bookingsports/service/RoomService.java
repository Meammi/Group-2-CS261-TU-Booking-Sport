package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.repository.RoomRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import com.example.tu_bookingsports.DTO.RoomReservationDTO; // Import DTO
import com.example.tu_bookingsports.DTO.SlotDetailDTO;   // Import DTO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private SlotRepository slotRepository;

    /**
     * ดึง Room ทั้งหมด พร้อมรายละเอียด Slot ที่เกี่ยวข้อง โดยมีการกรอง (Filter)
     * @param type ประเภทกีฬา (Required)
     * @param locName ชื่อสถานที่ (Optional)
     * @return List ของ RoomReservationDTO.java
     */
    public List<RoomReservationDTO> getRoomDetailsWithSlotsFiltered(String type, String locName) {

        // 1. ดึง Rooms ที่กรองแล้ว (ใช้ findByType และ findByTypeAndLocName ใน RoomRepository)
        List<Rooms> rooms;
        rooms = roomRepository.findByTypeAndLoc_name(type, locName);

        // 2. Map แต่ละ Room ไปยัง RoomReservationDTO.java
        return rooms.stream()
                .map(this::mapToRoomReservationDTO)
                .collect(Collectors.toList());
    }

    private RoomReservationDTO mapToRoomReservationDTO(Rooms room) {
        RoomReservationDTO dto = new RoomReservationDTO();
        dto.setRoomId(room.getRoom_id());
        dto.setName(room.getName());
        dto.setType(room.getType());
        dto.setLocName(room.getLoc_name());

        // 3. ดึง Slots ที่เกี่ยวข้องกับ Room ID นี้
        List<Slot> slots = slotRepository.findSlotsByRoomId(room.getRoom_id());

        // 4. แปลง Slot Entities ไปยัง SlotDetailDTOs
        List<SlotDetailDTO> slotDTOs = slots.stream()
                .map(slot -> new SlotDetailDTO(
                        slot.getSlotTime(),
                        slot.getStatus().toString()
                ))
                .collect(Collectors.toList());

        dto.setAvailableSlots(slotDTOs);
        return dto;
    }
}