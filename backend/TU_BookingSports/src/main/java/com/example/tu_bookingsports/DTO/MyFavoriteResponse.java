package com.example.tu_bookingsports.DTO;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Data
public class MyFavoriteResponse {

    private UUID favoriteId;
    private UUID roomId;
    private UUID slotId;
    private String name;
    private String locationName;
    private LocalTime startTime;
    private LocalTime endTime;

    public MyFavoriteResponse(UUID favoriteId, UUID roomId,
                            UUID slotId,String name,String locationName,LocalTime startTime,LocalTime endTime) {
        this.favoriteId = favoriteId;
        this.roomId = roomId;
        this.slotId = slotId;
        this.name = name;
        this.locationName = locationName;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
