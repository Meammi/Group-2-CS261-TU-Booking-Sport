// backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\model\Payment.java
package com.example.tu_bookingsports.model;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_payments_reservation", columnNames = "reservation_id"),
                @UniqueConstraint(name = "uk_payments_txn", columnNames = "transaction_id")
        })

@Data
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

    @Column(name = "token")
    private String token;

    @Column(name = "price")
    private BigDecimal price;


    @PrePersist
    void onCreate() {
        if (paymentDate == null) paymentDate = LocalDateTime.now();
    }

    // getters/setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getReservationId() {
        return reservationId;
    }

    public void setReservationId(UUID reservationId) {
        this.reservationId = reservationId;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentReceiptPhoto() {
        return paymentReceiptPhoto;
    }

    public void setPaymentReceiptPhoto(String paymentReceiptPhoto) {
        this.paymentReceiptPhoto = paymentReceiptPhoto;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

}
