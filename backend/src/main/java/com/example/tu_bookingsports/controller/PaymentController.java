package com.example.tu_bookingsports.controller;
import com.example.tu_bookingsports.DTO.PaymentRequest;
import com.example.tu_bookingsports.model.Payment;
import com.example.tu_bookingsports.service.PaymentService;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "")
public class PaymentController {
    private final PaymentService paymentService;
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public Payment createPayment(@RequestBody PaymentRequest request) {
        return paymentService.createPayment(request.getReservationId());
    }
    @GetMapping("/{id}")
    public Payment getPayment(@PathVariable("id") String id) {
        return paymentService.getPaymentByReservationId(java.util.UUID.fromString(id));
    }
}
