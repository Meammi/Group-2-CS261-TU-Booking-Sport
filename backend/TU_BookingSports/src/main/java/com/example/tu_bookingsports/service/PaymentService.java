//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\service\PaymentService.java
package com.example.tu_bookingsports.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pheerathach.ThaiQRPromptPay;
import com.example.tu_bookingsports.model.Payment;
import com.example.tu_bookingsports.repository.PaymentRepository;
import com.google.zxing.WriterException;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpHeaders;


import java.io.IOException;
import java.math.BigDecimal;
import org.springframework.http.*;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.client.RestTemplate;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationService reservationService;

    public PaymentService(PaymentRepository paymentRepository, ReservationService reservationService) {
        this.paymentRepository = paymentRepository;
        this.reservationService = reservationService;
    }

    public Payment createPayment(UUID reservationId) throws IOException, WriterException {
        Payment payment = new Payment();
        BigDecimal price = reservationService.getPriceByReservationId(reservationId);
        ThaiQRPromptPay qr = new ThaiQRPromptPay.Builder()
                .staticQR()
                .creditTransfer()
                .mobileNumber("0822821693")
                .amount(price)
                .build();


        payment.setToken(qr.toString());
        payment.setReservationId(reservationId);
        payment.setPrice(price);

        return paymentRepository.save(payment);
    }

    public Map<String,Object> checkSlipData(UUID reservationId,String qrData) {
        Map<String, Object> result = new HashMap<>();
        Payment payment = paymentRepository.findByReservationId(reservationId).orElse(null);
        try{
            if(payment != null) {
                String branchId = System.getenv("BRANCH_ID");
                String apiKey = System.getenv("API_KEY");
                String url = "https://api.slipok.com/api/line/apikey/"+branchId;
                HttpHeaders headers;
                headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.add("x-authorization", apiKey);

                BigDecimal price = reservationService.getPriceByReservationId(reservationId);

                Map<String, Object> body = new HashMap<>();
                body.put("data", qrData);
                body.put("log", true);
                if (price != null) {
                    body.put("amount", price);
                }
                HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response.getBody());
                boolean success = root.path("success").asBoolean();
                result.put("success", success);
                result.put("message", "การชำระเงินสำเร็จ");
                payment.setPaymentStatus(Payment.PaymentStatus.APPROVED);
                paymentRepository.save(payment);
            }else {
                result.put("success", false);
                result.put("message", "Don't have payment data");
            }

        }catch (Exception e){
            result.put("success", false);
            String fullMessage = e.getMessage();
            String search = "\"message\":\"";
            int start = fullMessage.indexOf(search);
            if (start != -1) {
                start += search.length();
                int end = fullMessage.indexOf("\"", start);
                if (end != -1) {
                    String message = fullMessage.substring(start, end);
                    result.put("message", message);
                }
            }

            if(payment != null) {
                payment.setPaymentStatus(Payment.PaymentStatus.REJECTED);
                paymentRepository.save(payment);
            }
                    }
        return result;

    }


    public Payment getPaymentByReservationId(UUID reservationId) {
        return paymentRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }


}
