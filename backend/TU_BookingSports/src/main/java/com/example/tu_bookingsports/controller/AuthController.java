//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\controller\AuthController.java
package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.LoginRequest;
import com.example.tu_bookingsports.DTO.LoginResponse;
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
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Registration and email verification are handled by TU authentication; endpoints removed.

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletResponse response) {
        LoginResponse tokens = authService.login(req);

        //access token
        ResponseCookie cookie = ResponseCookie.from("access_token", tokens.getAccess_token())
            .httpOnly(true)
            .secure(false) //for http
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
            .maxAge(24 * 60 * 60) // 1 days
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        // Return tokens in the body for SPA clients while also setting cookies.
        return ResponseEntity.ok(tokens);
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
                user.getType(),
                user.getUsername(),
                user.getEmail(),
                user.getTuStatus(),
                user.getStatusId(),
                user.getDisplayNameTh(),
                user.getDisplayNameEn()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(value = "refresh_token", required = false) String refreshToken,HttpServletResponse response){
         if (refreshToken == null || !authService.getJwtUtils().isTokenValid(refreshToken)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or missing refresh token"));
        }

        String email = authService.getJwtUtils().getSubject(refreshToken);

        var userOpt = authService.getUserRepository().findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        var user = userOpt.get();

        //new access token
        var claims = new HashMap<String, Object>();
        claims.put("type", user.getType());
        claims.put("username", user.getUsername());

        String newAccessToken = authService.getJwtUtils().generateToken(user.getEmail(), claims);

        //set new access_token cookie
        ResponseCookie accessCookie = ResponseCookie.from("access_token", newAccessToken)
            .httpOnly(true)
            .secure(false)
            .path("/")
            .sameSite("Strict")
            .maxAge(60 * 60)    // 1 hour
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

        return ResponseEntity.ok(new SimpleMessageResponse("Access token refreshed"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie clearAccess = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Strict")
                .maxAge(0)
                .build();
        ResponseCookie clearRefresh = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Strict")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, clearAccess.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, clearRefresh.toString());
        return ResponseEntity.ok(new SimpleMessageResponse("Logged out"));
    }

    // Password reset is not supported in TUAPI login flow on this backend.

}
