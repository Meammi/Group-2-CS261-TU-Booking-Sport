package com.example.tu_bookingsports.DTO;

import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Data
public class FavoriteRequest {
    private UUID userId;
    private UUID roomId;
    private UUID slotId;
}
