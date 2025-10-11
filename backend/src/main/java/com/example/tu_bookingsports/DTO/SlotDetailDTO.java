package com.example.tu_bookingsports.dto;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
// สมมติว่าใช้ Lombok
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SlotDetailDTO {
    private String slotTime;
    private String status;

    public SlotDetailDTO(LocalTime slotTime, String status) {
        // จัดรูปแบบเวลาเป็น HH:mm
        this.slotTime = slotTime.format(DateTimeFormatter.ofPattern("HH:mm"));
        this.status = status;
    }
}