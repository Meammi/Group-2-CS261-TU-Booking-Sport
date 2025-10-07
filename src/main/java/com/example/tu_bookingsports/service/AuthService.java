package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.dto.RegisterRequest;
import com.example.tu_bookingsports.exception.DuplicateResourceException;
import com.example.tu_bookingsports.model.User;
import com.example.tu_bookingsports.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    //private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository/*,PasswordEncoder passwordEncoder*/) {
        this.userRepository = userRepository;
        //this.passwordEncoder = passwordEncoder;
    }

    // @Transactional ensures DB writes are atomic (all-or-nothing).
    @Transactional
    public void register(RegisterRequest req) {
        // 1) Email must be unique
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        // 2) Create User entity & hash the password (BCrypt)
        User user = new User();
        user.setRole("USER");
        user.setEmail(req.getEmail());
        user.setUsername(req.getUsername());
        user.setPhoneNumber(req.getPhoneNumber());

        // Hash the password with BCrypt (includes salt internally)
        //user.setPassword(passwordEncoder.encode(req.getPassword()));
        // No Hash
        user.setPassword(req.getPassword());

        // 3) Persist
        userRepository.save(user);
    }
}
