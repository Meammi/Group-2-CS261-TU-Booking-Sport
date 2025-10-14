// src/main/java/com/example/demo/model/Payment.java
package com.example.tu_bookingsports.model;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;
@Data
@Entity
@Table(name = "payments",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_payments_reservation", columnNames = "reservation_id"),
                @UniqueConstraint(name = "uk_payments_txn", columnNames = "transaction_id")
        })

public class Payment {
    public enum PaymentStatus {PENDING, APPROVED, REJECTED}

    @Id
    @GeneratedValue
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.UUID)
    @Column(name = "payment_id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "reservation_id", nullable = false)
    private UUID reservationId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 32)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_receipt_photo")
    private String paymentReceiptPhoto;

    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;

    @Column(name = "payment_QRgenerate_photo")
    private String payment_QRgenerate_photo;

    @Column(name = "token")
    private String token;




    @PrePersist
    void onCreate() {
        if (paymentDate == null) paymentDate = LocalDateTime.now();
    }






    // Getters
    public UUID getId() {
        return id;
    }

    public UUID getReservationId() {
        return reservationId;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public String getPaymentReceiptPhoto() {
        return paymentReceiptPhoto;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public String getPayment_QRgenerate_photo() {
        return payment_QRgenerate_photo;
    }

    public String getToken() {
        return token;
    }

    // Setters
    public void setId(UUID id) {
        this.id = id;
    }

    public void setReservationId(UUID reservationId) {
        this.reservationId = reservationId;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public void setPaymentReceiptPhoto(String paymentReceiptPhoto) {
        this.paymentReceiptPhoto = paymentReceiptPhoto;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public void setPayment_QRgenerate_photo(String payment_QRgenerate_photo) {
        this.payment_QRgenerate_photo = payment_QRgenerate_photo;
    }

    public void setToken(String token) {
        this.token = token;
    }

}
