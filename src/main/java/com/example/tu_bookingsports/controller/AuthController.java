//src\main\java\com\example\tu_bookingsports\controller\AuthController.java
package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.dto.LoginRequest;
import com.example.tu_bookingsports.dto.LoginResponse;
import com.example.tu_bookingsports.dto.RegisterRequest;
import com.example.tu_bookingsports.dto.SimpleMessageResponse;
import com.example.tu_bookingsports.dto.UserResponse;
import com.example.tu_bookingsports.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Base path for auth endpoints: /auth/...
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<SimpleMessageResponse> register(@Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new SimpleMessageResponse("Registration successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        LoginResponse response = authService.login(req);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String token = authService.getJwtUtils().extractTokenFromHeader(authHeader);

        if (token == null) {
            return ResponseEntity.status(401).body("{\"error\": \"Missing or invalid Authorization header\"}");
        }
        var user = authService.getCurrentUser(token);
        UserResponse response = new UserResponse(
                user.getUserId().toString(),
                user.getEmail(),
                user.getUsername(),
                user.getPhoneNumber(),
                user.getRole()
        );
        return ResponseEntity.ok(response);
    }
}
