//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\service\AuthService.java
package com.example.tu_bookingsports.service;
//DTO
import com.example.tu_bookingsports.DTO.LoginRequest;
import com.example.tu_bookingsports.DTO.LoginResponse;
import com.example.tu_bookingsports.DTO.RegisterRequest;
//Model
import com.example.tu_bookingsports.model.PasswordResetToken;
import com.example.tu_bookingsports.model.User;
import com.example.tu_bookingsports.model.VerificationToken;
//Repository
import com.example.tu_bookingsports.repository.VerificationTokenRepository;
import com.example.tu_bookingsports.repository.PasswordResetTokenRepository;
import com.example.tu_bookingsports.repository.UserRepository;
//Config
import com.example.tu_bookingsports.config.JwtUtils;
//Exception
import com.example.tu_bookingsports.exception.DuplicateResourceException;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.web.server.ResponseStatusException;

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
    private final VerificationTokenRepository verificationRepo;
    private final PasswordResetTokenRepository resetRepo;
    private final EmailService emailService;
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    public AuthService(UserRepository userRepository,
                       JwtUtils jwtUtils,
                       PasswordEncoder passwordEncoder,
                       VerificationTokenRepository verificationRepo,
                       EmailService emailService,
                       PasswordResetTokenRepository resetRepo) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.verificationRepo = verificationRepo;
        this.emailService = emailService;
        this.resetRepo = resetRepo;
    }

    /* ---------- Helper methods ---------- */

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteOldVerificationTokens(User user) {
        verificationRepo.deleteAllByUser_UserId(user.getUserId());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createVerificationToken(User user) {
        deleteOldVerificationTokens(user);
        VerificationToken vt = new VerificationToken();
        vt.setUser(user);
        vt.setToken(UUID.randomUUID().toString());
        vt.setExpiresAt(LocalDateTime.now().plusHours(1));
        verificationRepo.saveAndFlush(vt);
        emailService.sendVerificationEmail(user.getEmail(), vt.getToken());
    }
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    private void createPasswordResetToken(User user) {
        resetRepo.deleteAllByUser_UserId(user.getUserId());
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        resetRepo.saveAndFlush(token);
        emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());
    }
    /* ---------- Registration ---------- */

    //register logic
    @Transactional(noRollbackFor = ResponseStatusException.class)
    public void register(RegisterRequest req) {
        Optional<User> existingUserOpt = userRepository.findByEmail(req.getEmail());
        //handle duplicated email
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            if (!existingUser.isVerified()) {
                // Token regeneration
                deleteOldVerificationTokens(existingUser);
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
    /* ---------- Login ---------- */
    //Login logic
    public LoginResponse login(LoginRequest req) {
        //Handle invalid login
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        if (!user.isVerified()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email not verified");
        }
        //Login (Bcrypt) 
        var claims = new HashMap<String, Object>();
        claims.put("role", user.getRole());
        claims.put("username", user.getUsername());

        String accessToken = jwtUtils.generateToken(user.getEmail(), claims);
        String refreshToken = jwtUtils.generateToken(user.getEmail(), new HashMap<>());

        return new LoginResponse(accessToken, refreshToken);
    }
    /* ---------- Verification ---------- */

    // verify account -> find token in database
    public void verifyAccount(String token) {
        VerificationToken vt = verificationRepo.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token"));

        if (vt.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token expired");
        }

        User user = vt.getUser();
        user.setVerified(true);
        userRepository.save(user);

        verificationRepo.delete(vt);
    }
    public JwtUtils getJwtUtils() {
        return jwtUtils;
    }
    public UserRepository getUserRepository() {
        return userRepository;
    }

    /* ---------- Password reset ---------- */
    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        createPasswordResetToken(user);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken reset = resetRepo.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token"));
        if (reset.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token expired");

        User user = reset.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetRepo.delete(reset);
    }

    /* ---------- Utility ---------- */
    // decode the token → get the email → fetch the user
    public User getCurrentUser(String token) {
        if (!jwtUtils.isTokenValid(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }

        String email = jwtUtils.getSubject(token);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
