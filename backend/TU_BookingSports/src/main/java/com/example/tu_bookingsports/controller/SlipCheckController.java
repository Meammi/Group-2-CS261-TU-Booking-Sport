//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\controller\SlipCheckController.java
package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.DTO.CheckingSlipRequest;
import com.example.tu_bookingsports.model.Payment;
import com.example.tu_bookingsports.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/slipChecking")
@CrossOrigin(origins = "http://localhost:3000")
public class SlipCheckController {
    private final PaymentService paymentService;

    public SlipCheckController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public Map<String, Object> checkSlip(@RequestBody CheckingSlipRequest request) {
        return paymentService.checkSlipData(java.util.UUID.fromString(request.getReservationId()),request.getSlipId());
    }
}
