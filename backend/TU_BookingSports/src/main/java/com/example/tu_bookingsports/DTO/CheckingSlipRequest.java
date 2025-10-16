package com.example.tu_bookingsports.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;
@Data
public class CheckingSlipRequest {
    String reservationId;
    String slipId;
    BigDecimal amount;
    CheckingSlipRequest() {}
    CheckingSlipRequest(String reservationId, String slipId, BigDecimal amount) {
       this.reservationId = reservationId;
       this.slipId = slipId;
       this.amount = amount;
    }


    // ----------------------
    // GETTERS
    // ----------------------

    public String getReservationId() {
        return reservationId;
    }

    public String getSlipId() {
        return slipId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    // ----------------------
    // SETTERS
    // ----------------------

    public void setReservationId(String reservationId) {
        this.reservationId = reservationId;
    }

    public void setSlipId(String slipId) {
        this.slipId = slipId;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
