package com.example.tu_bookingsports.repository;
import com.example.tu_bookingsports.model.Reservations;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservations,UUID>{
    Reservations findByReservationId(UUID reservationId);
}