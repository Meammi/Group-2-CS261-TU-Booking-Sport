//Group-2-CS261-TU-Booking-Sport/backend/TU_BookingSports/src/main/java/com/example/tu_bookingsports/service/TuApiVerifyResponse.java
package com.example.tu_bookingsports.service;

public class TuApiVerifyResponse {
    private boolean status;
    private String message;
    private String type;
    private String username;
    private String tu_status;
    private String statusid;
    private String displayname_th;
    private String displayname_en;
    private String email;

    public boolean isStatus() { return status; }
    public void setStatus(boolean status) { this.status = status; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getTu_status() { return tu_status; }
    public void setTu_status(String tu_status) { this.tu_status = tu_status; }
    public String getStatusid() { return statusid; }
    public void setStatusid(String statusid) { this.statusid = statusid; }
    public String getDisplayname_th() { return displayname_th; }
    public void setDisplayname_th(String displayname_th) { this.displayname_th = displayname_th; }
    public String getDisplayname_en() { return displayname_en; }
    public void setDisplayname_en(String displayname_en) { this.displayname_en = displayname_en; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

