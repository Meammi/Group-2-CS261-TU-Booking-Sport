//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\repository\PasswordResetTokenRepository.java
package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteAllByUser_UserId(UUID userId);
}
