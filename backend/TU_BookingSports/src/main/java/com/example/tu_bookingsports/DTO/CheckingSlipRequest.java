//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\DTO\CheckingSlipRequest.java
package com.example.tu_bookingsports.DTO;

import java.math.BigDecimal;

public class CheckingSlipRequest {
    private String reservationId;
    private String slipId;
    private BigDecimal amount;

    public CheckingSlipRequest() {}

    public CheckingSlipRequest(String reservationId, String slipId, BigDecimal amount) {
        this.reservationId = reservationId;
        this.slipId = slipId;
        this.amount = amount;
    }

    public String getReservationId() { return reservationId; }
    public String getSlipId() { return slipId; }
    public BigDecimal getAmount() { return amount; }
}
