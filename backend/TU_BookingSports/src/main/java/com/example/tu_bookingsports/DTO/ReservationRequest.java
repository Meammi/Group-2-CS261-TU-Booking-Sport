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
    private String slotTime;
}