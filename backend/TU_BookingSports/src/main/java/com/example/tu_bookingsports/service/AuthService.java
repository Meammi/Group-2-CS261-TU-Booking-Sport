//Group-2-CS261-TU-Booking-Sport/backend/TU_BookingSports/src/main/java/com/example/tu_bookingsports/service/AuthService.java
package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.DTO.LoginRequest;
import com.example.tu_bookingsports.DTO.LoginResponse;
import com.example.tu_bookingsports.config.JwtUtils;
import com.example.tu_bookingsports.model.User;
import com.example.tu_bookingsports.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final TuApiClient tuApiClient;

    public AuthService(UserRepository userRepository,
                       JwtUtils jwtUtils,
                       TuApiClient tuApiClient) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.tuApiClient = tuApiClient;
    }

    @Transactional
    public LoginResponse login(LoginRequest req) {
        TuApiVerifyResponse vr = tuApiClient.verify(req.getUsername(), req.getPassword());
        if (vr == null || !vr.isStatus()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        User user = userRepository.findByEmail(vr.getEmail())
                .or(() -> userRepository.findByUsername(vr.getUsername()))
                .orElseGet(User::new);

        user.setType(vr.getType());
        user.setUsername(vr.getUsername());
        user.setEmail(vr.getEmail());
        user.setTuStatus(vr.getTu_status());
        user.setStatusId(vr.getStatusid());
        user.setDisplayNameTh(vr.getDisplayname_th());
        user.setDisplayNameEn(vr.getDisplayname_en());
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword("TUAPI"); // placeholder to satisfy NOT NULL legacy column
        }

        userRepository.save(user);

        var claims = new HashMap<String, Object>();
        claims.put("type", user.getType());
        claims.put("username", user.getUsername());

        String accessToken = jwtUtils.generateToken(user.getEmail(), claims);
        String refreshToken = jwtUtils.generateToken(user.getEmail(), new HashMap<>());
        return new LoginResponse(accessToken, refreshToken);
    }

    public JwtUtils getJwtUtils() { return jwtUtils; }
    public UserRepository getUserRepository() { return userRepository; }

    public User getCurrentUser(String token) {
        if (!jwtUtils.isTokenValid(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
        String email = jwtUtils.getSubject(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
