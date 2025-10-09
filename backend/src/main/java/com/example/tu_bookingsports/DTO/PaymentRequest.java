package com.example.tu_bookingsports.DTO;
import lombok.Data;

import java.util.UUID;
@Data
public class PaymentRequest {
    private UUID reservationId;
    public UUID getReservationId() { return reservationId; }
    public void setReservationId(UUID reservationId) { this.reservationId = reservationId; }
}
