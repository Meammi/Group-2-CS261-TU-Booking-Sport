// backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\DTO\LoginResponse.java
package com.example.tu_bookingsports.DTO;

public class LoginResponse {
    private String access_token;
    private String refresh_token;

    public LoginResponse(String access_token, String refresh_token) {
        this.access_token = access_token;
        this.refresh_token = refresh_token;
    }

    public String getAccess_token() {
        return access_token;
    }

    public String getRefresh_token() {
        return refresh_token;
    }
}
