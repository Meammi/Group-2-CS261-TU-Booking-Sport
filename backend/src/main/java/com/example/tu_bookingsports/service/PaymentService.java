package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.model.Payment;
import com.example.tu_bookingsports.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment createPayment(UUID reservationId) {
        Payment payment = new Payment();
        payment.setReservationId(reservationId);
        return paymentRepository.save(payment);
    }

    public Payment getPaymentByReservationId(UUID reservationId) {
        return paymentRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }


}
