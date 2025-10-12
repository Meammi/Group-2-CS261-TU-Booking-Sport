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
import com.example.tu_bookingsports.repository.VerificationTokenRepository;
import com.example.tu_bookingsports.model.VerificationToken;
import com.example.tu_bookingsports.service.EmailService;


import java.util.HashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       JwtUtils jwtUtils,
                       PasswordEncoder passwordEncoder,
                       VerificationTokenRepository tokenRepository,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
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

        // Create a verification token
        String token = java.util.UUID.randomUUID().toString();

        VerificationToken verification = new VerificationToken();
        verification.setToken(token);
        verification.setUser(user);
        verification.setExpiresAt(java.time.LocalDateTime.now().plusHours(1));
        tokenRepository.save(verification);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), token);
    }
    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        if (!user.isVerified()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email not verified");
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
    public void verifyAccount(String token) {
        VerificationToken vt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token"));

        if (vt.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token expired");
        }

        User user = vt.getUser();
        user.setVerified(true);
        userRepository.save(user);

        tokenRepository.delete(vt);
    }


    public JwtUtils getJwtUtils() {
        return jwtUtils;
    }

    public UserRepository getUserRepository() {
        return userRepository;
    }
}
