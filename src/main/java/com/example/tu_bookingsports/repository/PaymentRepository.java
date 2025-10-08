package com.example.tu_bookingsports.repository;
import com.example.tu_bookingsports.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByTransactionId(String transactionId);
}
