package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.model.GeoLocation;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.repository.RoomRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import com.example.tu_bookingsports.DTO.RoomReservationDTO; // Import DTO
import com.example.tu_bookingsports.DTO.SlotDetailDTO;   // Import DTO
import com.example.tu_bookingsports.DTO.GeolocationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

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

        // 1. ดึง Rooms ที่กรองแล้ว (Assuming RoomRepository method follows Spring Data JPA convention)
        // NOTE: The method in the repository should ideally be findByTypeAndLocName
        // to match the DTO/Service convention, but we must use loc_name for now to match the Rooms entity field.
        List<Rooms> rooms;
        rooms = roomRepository.findByTypeAndLoc_name(type, locName);

        // 2. Map แต่ละ Room ไปยัง RoomReservationDTO.java
        return rooms.stream()
                .map(this::mapToRoomReservationDTO)
                .collect(Collectors.toList());
    }

    private RoomReservationDTO mapToRoomReservationDTO(Rooms room) {
        RoomReservationDTO dto = new RoomReservationDTO();

        // CORRECTION 1: Align DTO setter with DTO field naming convention (camelCase)
        // DTO has roomId, so setter is setRoomId(). Model has getRoom_id().
        dto.setRoomId(room.getRoom_id());

        // CORRECTION 2: Align DTO setter with DTO field naming convention (camelCase)
        // DTO has locName, so setter is setLocName(). Model has getLoc_name().
        dto.setLocName(room.getLoc_name());

        // These fields are already in sync
        dto.setName(room.getName());
        dto.setType(room.getType());

        // 3. ดึง Slots ที่เกี่ยวข้องกับ Room ID นี้
        // Method name in repository should be findSlotsByRoomId
        List<Slot> slots = slotRepository.findSlotsByRoomId(room.getRoom_id());

        // 4. แปลง Slot Entities ไปยัง SlotDetailDTOs
        List<SlotDetailDTO> slotDTOs = slots.stream()
                .map(slot -> new SlotDetailDTO(
                        slot.getSlotId(),
                        slot.getSlotTime(),
                        slot.getStatus().toString()
                ))
                .collect(Collectors.toList());

        dto.setSlots(slotDTOs);
        return dto;
    }

    public GeolocationResponse getLocationByName(String locationName) {
        //ค้นหา Room "แรก" ที่เจอด้วย loc_name นี้
        List<Rooms> rooms = roomRepository.findFirstByLocName(locationName);

        if (rooms.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found: " + locationName);
        }

        GeoLocation locationModel = rooms.get(0).getLocation();
        return new GeolocationResponse(
                locationModel.getLatitude(),
                locationModel.getLongitude()
        );
    }
}