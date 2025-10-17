//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\DTO\CheckingSlipRequest.java
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
}
