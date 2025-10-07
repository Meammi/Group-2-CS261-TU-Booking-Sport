//src\main\java\com\example\tu_bookingsports\service\AuthService.java
package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.dto.LoginRequest;
import com.example.tu_bookingsports.dto.LoginResponse;
import com.example.tu_bookingsports.dto.RegisterRequest;
import com.example.tu_bookingsports.exception.DuplicateResourceException;
import com.example.tu_bookingsports.model.User;
import com.example.tu_bookingsports.repository.UserRepository;
import com.example.tu_bookingsports.config.JwtUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        User user = new User();
        user.setRole("USER");
        user.setEmail(req.getEmail());
        user.setUsername(req.getUsername());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setPassword(req.getPassword()); // stored plain text for now
        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // plain text comparison (no encryption yet)
        if (!user.getPassword().equals(req.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        var claims = new HashMap<String, Object>();
        claims.put("role", user.getRole());
        claims.put("username", user.getUsername());

        String accessToken = jwtUtils.generateToken(user.getEmail(), claims);
        String refreshToken = jwtUtils.generateToken(user.getEmail(), new HashMap<>());

        return new LoginResponse(accessToken, refreshToken);
    }
}
