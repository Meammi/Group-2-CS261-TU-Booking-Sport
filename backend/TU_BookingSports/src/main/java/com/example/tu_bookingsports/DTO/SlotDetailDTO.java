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

    public SlotDetailDTO() {
    }
    public SlotDetailDTO(UUID slotId, LocalTime slotTime, String status) {
    	this.slotId = slotId;
        this.slotTime = slotTime;
        this.status = status;
    }
    
    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
    }

    public LocalTime getSlotTime() {
        return slotTime;
    }

    public void setSlotTime(LocalTime slotTime) {
        this.slotTime = slotTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}