//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\DTO\CheckingSlipRequest.java
package com.example.tu_bookingsports.DTO;

import java.math.BigDecimal;

public class CheckingSlipRequest {

    String reservationId;
    String slipId;
    CheckingSlipRequest() {}
    CheckingSlipRequest(String reservationId, String slipId, BigDecimal amount) {
       this.reservationId = reservationId;
       this.slipId = slipId;
    }

    public String getReservationId() { return reservationId; }
    public String getSlipId() { return slipId; }
}
