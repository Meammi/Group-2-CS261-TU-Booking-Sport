package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.dto.LoginRequest;
import com.example.tu_bookingsports.dto.LoginResponse;
import com.example.tu_bookingsports.dto.RegisterRequest;
import com.example.tu_bookingsports.dto.SimpleMessageResponse;
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
}
