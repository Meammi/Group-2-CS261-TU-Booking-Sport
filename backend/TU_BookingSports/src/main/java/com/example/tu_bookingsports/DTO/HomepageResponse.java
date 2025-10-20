package com.example.tu_bookingsports.DTO;

public class HomepageResponse {
    private String type;
    private String locationName;

    // Constructor
    public HomepageResponse(String type, String locName) {
        this.type = type;
        this.locationName = locName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }
}