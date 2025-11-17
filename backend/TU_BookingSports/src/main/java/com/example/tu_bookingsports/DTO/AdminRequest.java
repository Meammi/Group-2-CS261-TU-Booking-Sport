package com.example.tu_bookingsports.DTO;

import com.example.tu_bookingsports.model.Slot;
import java.time.LocalTime;
import java.util.UUID;

public class AdminRequest {
    private LocalTime slotTime;
    private Slot.SlotStatus status;
    private RoomIdWrapper room;

    // Getters and setters
    public LocalTime getSlotTime() { return slotTime; }
    public void setSlotTime(LocalTime slotTime) { this.slotTime = slotTime; }
    public Slot.SlotStatus getStatus() { return status; }
    public void setStatus(Slot.SlotStatus status) { this.status = status; }
    public RoomIdWrapper getRoom() { return room; }
    public void setRoom(RoomIdWrapper room) { this.room = room; }

    public static class RoomIdWrapper {
        private UUID room_id;
        public UUID getRoom_id() { return room_id; }
        public void setRoom_id(UUID room_id) { this.room_id = room_id; }
    }
}