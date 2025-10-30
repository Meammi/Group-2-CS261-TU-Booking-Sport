//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\repository\ReservationRepository.java
package com.example.tu_bookingsports.repository;
import com.example.tu_bookingsports.model.Reservations;
import com.example.tu_bookingsports.model.Reservations.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservations, UUID> {
    Reservations findByReservationID(UUID reservationID);

    List<Reservations> findByStartTimeBetweenAndStatusInAndReminderSentFalse(
            LocalDateTime start,
            LocalDateTime end,
            Collection<ReservationStatus> statuses
    );
}
