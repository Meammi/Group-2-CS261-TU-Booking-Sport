//C:\Users\print\OneDrive\Desktop\MyWork\CS261\Group-2-CS261-TU-Booking-Sport\backend\src\main\java\com\example\tu_bookingsports\DTO\HomepageResponse.java
package com.example.tu_bookingsports.DTO;

public class HomepageResponse {
    private String type;
    private String locationName;
    private Long count;

    // Constructor
    public HomepageResponse(String type, String locName, Long count) {
        this.type = type;
        this.locationName = locName;
        this.count = count;
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

    public Long getCount() {return count;}

    public void setCount(Long count) {this.count = count;}
}
