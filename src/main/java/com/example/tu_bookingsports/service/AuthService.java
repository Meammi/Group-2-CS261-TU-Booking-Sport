//src\main\java\com\example\tu_bookingsports\service\AuthService.java
package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.DTO.LoginRequest;
import com.example.tu_bookingsports.DTO.LoginResponse;
import com.example.tu_bookingsports.DTO.RegisterRequest;
import com.example.tu_bookingsports.exception.DuplicateResourceException;
import com.example.tu_bookingsports.model.User;
import com.example.tu_bookingsports.repository.UserRepository;
import com.example.tu_bookingsports.config.JwtUtils;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtils jwtUtils, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
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
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);
    }
    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        var claims = new HashMap<String, Object>();
        claims.put("role", user.getRole());
        claims.put("username", user.getUsername());

        String accessToken = jwtUtils.generateToken(user.getEmail(), claims);
        String refreshToken = jwtUtils.generateToken(user.getEmail(), new HashMap<>());

        return new LoginResponse(accessToken, refreshToken);
    }
    // decode the token → get the email → fetch the user
    public User getCurrentUser(String token) {
        if (!jwtUtils.isTokenValid(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }

        String email = jwtUtils.getSubject(token);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public JwtUtils getJwtUtils() {
        return jwtUtils;
    }

    public UserRepository getUserRepository() {
        return userRepository;
    }
}
