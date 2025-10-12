package com.example.tu_bookingsports.DTO;

import java.util.List;
import java.util.UUID;

// Removed Lombok imports

public class RoomReservationDTO {

    // Private Fields (Data Structure)
    private UUID roomId;
    private String name;
    private String type;
    private String locName;
    private List<SlotDetailDTO> availableSlots;

    // Default Constructor (Required by many frameworks like Spring/Jackson)
    public RoomReservationDTO() {
    }

    // --- Public Getter Methods ---

    public UUID getRoomId() {
        return roomId;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getLocName() {
        return locName;
    }

    public List<SlotDetailDTO> getAvailableSlots() {
        return availableSlots;
    }

    // --- Public Setter Methods (Required by RoomService.java) ---

    public void setRoomId(UUID roomId) {
        this.roomId = roomId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setLocName(String locName) {
        this.locName = locName;
    }

    public void setAvailableSlots(List<SlotDetailDTO> availableSlots) {
        this.availableSlots = availableSlots;
    }
}