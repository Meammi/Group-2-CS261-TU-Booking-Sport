package com.example.tu_bookingsports.DTO;

import java.time.LocalTime;
import java.util.UUID;
// สมมติว่าใช้ Lombok
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SlotDetailDTO {
	private UUID slotId;
    private LocalTime slotTime;
    private String status;

    public SlotDetailDTO(UUID slotId, LocalTime slotTime, String status) {
    	this.slotId = slotId;
        this.slotTime = slotTime;
        this.status = status;
    }
}