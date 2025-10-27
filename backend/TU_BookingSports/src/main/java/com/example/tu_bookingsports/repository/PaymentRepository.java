//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\repository\PaymentRepository.java
package com.example.tu_bookingsports.repository;
import com.example.tu_bookingsports.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByReservationId(UUID reservationId);
}