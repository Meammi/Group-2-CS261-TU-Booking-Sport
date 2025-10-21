package com.example.tu_bookingsports.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class RoomResponse {

    @JsonProperty("room_id")
    private UUID roomId;

    private String name;

    private String type;

    private int capacity;

    @JsonProperty("loc_name")
    private String locName;

    private Double latitude;

    // Intentionally spelled as requested in response example
    @JsonProperty("longtitude")
    private Double longitude;

    private BigDecimal price;

    // Map of slot_time -> status (e.g., {"09:00":"AVAILABLE"})
    @JsonProperty("slot_time")
    private Map<String, String> slotTime;
}
