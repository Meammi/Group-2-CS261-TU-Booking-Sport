package com.example.tu_bookingsports.DTO;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfirmationRequest {
    private UUID reservationId;
    
    public UUID getReservationId() {
        return reservationId;
    }
    public void setReservationId(UUID reservationId) {
        this.reservationId = reservationId;
    }
}