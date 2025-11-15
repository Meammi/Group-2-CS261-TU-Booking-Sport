package com.example.tu_bookingsports.DTO;

import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Data
public class FavoriteRequest {
    // private UUID userId;
    private UUID roomId;
    private UUID slotId;

    public UUID getRoomId() {
        return roomId;
    }

    public void setRoomId(UUID roomId) {
        this.roomId = roomId;
    }

    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
    }
}
