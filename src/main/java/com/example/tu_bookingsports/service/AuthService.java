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
import org.springframework.transaction.annotation.Propagation;
import org.springframework.web.server.ResponseStatusException;
import com.example.tu_bookingsports.repository.VerificationTokenRepository;
import com.example.tu_bookingsports.model.VerificationToken;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

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
    //delete verify token 
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteOldTokens(User user) {
        tokenRepository.deleteAllByUser_UserId(user.getUserId());
        tokenRepository.flush();
    }
    //create verify token 
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createVerificationToken(User user) {
        String newToken = UUID.randomUUID().toString();

        VerificationToken vt = new VerificationToken();
        vt.setUser(user);
        vt.setToken(newToken);
        vt.setExpiresAt(LocalDateTime.now().plusHours(1));

        tokenRepository.saveAndFlush(vt);
        emailService.sendVerificationEmail(user.getEmail(), newToken);
    }

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public void register(RegisterRequest req) {
        Optional<User> existingUserOpt = userRepository.findByEmail(req.getEmail());

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            if (!existingUser.isVerified()) {
                // Token regeneration
                deleteOldTokens(existingUser);
                createVerificationToken(existingUser);
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Account already exists but not verified. New verification link sent."
                );
            }
            throw new DuplicateResourceException("Email is already registered and verified.");
        }

        User user = new User();
        user.setRole("USER");
        user.setEmail(req.getEmail());
        user.setUsername(req.getUsername());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);

        createVerificationToken(user);
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
