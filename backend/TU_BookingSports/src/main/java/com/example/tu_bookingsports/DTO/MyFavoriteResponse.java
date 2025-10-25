package com.example.tu_bookingsports.DTO;

import com.example.tu_bookingsports.model.Reservations;
import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class MyFavoriteResponse {

    private UUID favoriteId;
    private UUID userId;
    private UUID roomId;
    private UUID slotId;

    private String name;
    private String locationName;
    private LocalTime startTime;
    private LocalTime endTime;

    public MyFavoriteResponse(UUID favoriteId, UUID userId, UUID roomId,
                              UUID slotId,String name,String locationName,LocalTime startTime,LocalTime endTime) {
        this.favoriteId = favoriteId;
        this.userId = userId;
        this.roomId = roomId;
        this.slotId = slotId;

        this.name = name;
        this.locationName = locationName;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
