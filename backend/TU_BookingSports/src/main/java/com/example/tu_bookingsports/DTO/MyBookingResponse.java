package com.example.tu_bookingsports.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import com.example.tu_bookingsports.model.Reservations;
import lombok.Data;

@Data
public class MyBookingResponse {

    private UUID reservationId;
    private String name;
    private String locationName;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isCurrent;
    private Reservations.ReservationStatus status;

    public MyBookingResponse(UUID reservationId,String name, String locationName,
                             LocalDateTime startDateTime, LocalDateTime endDateTime,
                             Boolean isCurrent, Reservations.ReservationStatus status) {
        this.reservationId = reservationId;
        this.name = name;
        this.locationName = locationName;
        this.bookingDate = startDateTime.toLocalDate();
        this.startTime = startDateTime.toLocalTime();
        this.endTime = endDateTime.toLocalTime();
        this.isCurrent = isCurrent;
        this.status = status;
    }
}
