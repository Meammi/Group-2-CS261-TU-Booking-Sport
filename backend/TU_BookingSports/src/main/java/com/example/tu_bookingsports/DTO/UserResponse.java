//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\DTO\UserResponse.java
package com.example.tu_bookingsports.DTO;

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
