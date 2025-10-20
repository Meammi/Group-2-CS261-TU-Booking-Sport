//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\repository\UserRepository.java
package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}
