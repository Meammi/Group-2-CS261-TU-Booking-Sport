package com.example.tu_bookingsports.DTO;
import java.time.LocalTime;
import java.util.UUID;

import com.example.tu_bookingsports.model.Reservations;
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



    private UUID reservationId;



    public enum ReservationStatus {
        PENDING,     // 0 รอการยืนยัน
        CONFIRMED,   // 1 ยืนยันแล้ว
        CANCELLED,   // 2 ยกเลิก
    }
    private ReservationStatus status;
    public ReservationStatus getStatus() {
        return status;
    }
    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
    public UUID getReservationId() {
        return reservationId;
    }
    public void setReservationId(UUID reservationId) {
        this.reservationId = reservationId;
    }
}