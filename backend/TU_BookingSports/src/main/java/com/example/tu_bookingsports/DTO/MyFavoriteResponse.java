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
    private String type;
    private String name;
    private String locationName;
    private LocalTime startTime;
    private LocalTime endTime;

    public MyFavoriteResponse(UUID favoriteId, UUID roomId, UUID slotId,
                              String type,String name,String locationName,LocalTime startTime,LocalTime endTime) {
        this.favoriteId = favoriteId;
        this.roomId = roomId;
        this.slotId = slotId;
        this.type = type;
        this.name = name;
        this.locationName = locationName;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
