package com.example.tu_bookingsports.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.List;
import java.util.Map;

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

    public UUID getRoomId() {
        return roomId;
    }

    public void setRoomId(UUID roomId) {
        this.roomId = roomId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getLocName() {
        return locName;
    }

    public void setLocName(String locName) {
        this.locName = locName;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Map<String, String> getSlotTime() {
        return slotTime;
    }

    public void setSlotTime(Map<String, String> slotTime) {
        this.slotTime = slotTime;
    }
}
