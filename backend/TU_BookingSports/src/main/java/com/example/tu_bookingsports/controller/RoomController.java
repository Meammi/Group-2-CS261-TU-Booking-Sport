package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.RoomResponse;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.repository.RoomRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import com.example.tu_bookingsports.repository.SlotTimeStatusProjection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private SlotRepository slotRepository;

    @GetMapping("/rooms")
    public List<RoomResponse> getRooms() {
        List<Rooms> rooms = roomRepository.findAll();
        return rooms.stream().map(room -> {
            RoomResponse dto = new RoomResponse();
            dto.setRoomId(room.getRoom_id());
            dto.setName(room.getName());
            dto.setType(room.getType());
            dto.setCapacity(room.getCapacity());
            dto.setLocName(room.getLoc_name());
            if (room.getLocation() != null) {
                dto.setLatitude(room.getLocation().getLatitude());
                dto.setLongitude(room.getLocation().getLongitude());
            }
            dto.setPrice(room.getPrice());

            // Fetch associated slots via projection to avoid GUID decoding issues
            List<SlotTimeStatusProjection> slots = slotRepository.findSlotTimeAndStatusByRoomId(room.getRoom_id());
            // Preserve DB ordering by using LinkedHashMap
            LinkedHashMap<String, String> slotMap = new LinkedHashMap<>();
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");
            for (SlotTimeStatusProjection s : slots) {
                String timeStr = s.getSlotTime() != null ? s.getSlotTime().format(fmt) : null;
                String statusStr = s.getStatus() != null ? s.getStatus().toString() : null;
                if (timeStr != null) {
                    slotMap.put(timeStr, statusStr);
                }
            }
            dto.setSlotTime(slotMap);

            return dto;
        }).collect(Collectors.toList());
    }
}
