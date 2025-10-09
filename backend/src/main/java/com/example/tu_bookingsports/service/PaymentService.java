package com.example.tu_bookingsports.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pheerathach.ThaiQRPromptPay;
import com.example.tu_bookingsports.model.Payment;
import com.example.tu_bookingsports.repository.PaymentRepository;
import com.google.zxing.WriterException;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpHeaders;


import java.io.File;
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

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment createPayment(UUID reservationId) throws IOException, WriterException {
        Payment payment = new Payment();

        ThaiQRPromptPay qr = new ThaiQRPromptPay.Builder()
                .staticQR()
                .creditTransfer()
                .mobileNumber("0634199693")
                .amount(new BigDecimal("1.00"))
                .build();
        String folderPath = "uploads";
        File folder = new File(folderPath);
        if (!folder.exists()) folder.mkdirs();

        String filePath = folderPath + "/qr-" + reservationId + ".png";
        File outputFile = new File(filePath);
        qr.draw(300, 300, outputFile);

        payment.setToken(qr.toString());
        payment.setPayment_QRgenerate_photo(filePath);
        payment.setReservationId(reservationId);

        return paymentRepository.save(payment);
    }
    public Map<String,Object> checkSlipData(UUID reservationId,String qrData,BigDecimal amount) {
        Map<String, Object> result = new HashMap<>();
        Payment payment = paymentRepository.findByReservationId(reservationId).orElse(null);
        try{
            if(payment != null) {
                HttpHeaders headers;
                headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, Object> body = new HashMap<>();
                body.put("data", qrData);
                body.put("log", true);
                if (amount != null) {
                    body.put("amount", amount);
                }
                HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response.getBody());
                String message = root.path("data").path("message").asText();
                boolean success = root.path("success").asBoolean();
                result.put("success", success);
                result.put("message", message);
                payment.setPaymentStatus(Payment.PaymentStatus.APPROVED);
                paymentRepository.save(payment);
            }else {
                result.put("success", false);
                result.put("message", "Don't have payment data");
            }

        }catch (Exception e){
            result.put("success", false);
            result.put("message", "เกิดข้อผิดพลาด: " + e.getMessage());
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
