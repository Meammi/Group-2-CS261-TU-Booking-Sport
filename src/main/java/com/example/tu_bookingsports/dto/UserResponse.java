package com.example.tu_bookingsports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String email;
    private String username;
    private String phoneNumber;
    private String role;
}
