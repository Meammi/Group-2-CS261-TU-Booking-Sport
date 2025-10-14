package com.example.tu_bookingsports.DTO;
import java.time.LocalTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationRequest {
    private UUID userId;
    private UUID roomId;
    private UUID slotId;

    public UUID getUserId() {
        return userId;
    }
    public void setUserId(UUID userId) {
        this.userId = userId;
    }

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