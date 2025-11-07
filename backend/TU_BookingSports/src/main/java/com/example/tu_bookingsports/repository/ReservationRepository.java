//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\repository\ReservationRepository.java
package com.example.tu_bookingsports.repository;
import com.example.tu_bookingsports.model.Reservations;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservations, UUID> {
    Reservations findByReservationID(UUID reservationID);
    List<Reservations> findByUser(UUID userId);
}
