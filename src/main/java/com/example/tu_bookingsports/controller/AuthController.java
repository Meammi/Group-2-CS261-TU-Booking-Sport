//src\main\java\com\example\tu_bookingsports\controller\AuthController.java
package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.LoginRequest;
import com.example.tu_bookingsports.DTO.LoginResponse;
import com.example.tu_bookingsports.DTO.RegisterRequest;
import com.example.tu_bookingsports.DTO.SimpleMessageResponse;
import com.example.tu_bookingsports.DTO.UserResponse;
import com.example.tu_bookingsports.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import java.util.Map;

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
    public ResponseEntity<SimpleMessageResponse> login(@RequestBody LoginRequest req, HttpServletResponse response) {
        LoginResponse tokens = authService.login(req);

        //access token
        ResponseCookie cookie = ResponseCookie.from("access_token", tokens.getAccess_token())
            .httpOnly(true)
            .secure(false)//for http
            .path("/")
            .sameSite("Strict")
            .maxAge(60 * 60) // 1 hour
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        //refresh token
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", tokens.getRefresh_token())
            .httpOnly(true)
            .secure(false)
            .path("/")
            .sameSite("Strict")
            .maxAge(7 * 24 * 60 * 60) // 7 days
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok(new SimpleMessageResponse("Login successful"));
    }
    @GetMapping("/me")
    public ResponseEntity<?> getMe(@CookieValue(value = "access_token", required = false) String token) {
        if (token == null) {
        return ResponseEntity.status(401)
                .body(Map.of("error", "Missing or invalid access_token cookie"));
        }

        if (!authService.getJwtUtils().isTokenValid(token)) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid or expired token"));
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
