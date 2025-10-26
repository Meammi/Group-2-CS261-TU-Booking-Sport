package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.Reservations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MyBookingRepository extends JpaRepository<Reservations, UUID> {
    List<Reservations> findByUser(UUID userId);
}