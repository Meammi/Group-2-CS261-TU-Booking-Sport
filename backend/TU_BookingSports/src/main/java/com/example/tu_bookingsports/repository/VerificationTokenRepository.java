//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\repository\VerificationTokenRepository.java
package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {
    Optional<VerificationToken> findByToken(String token);

    void deleteAllByUser_UserId(UUID userId);
}

