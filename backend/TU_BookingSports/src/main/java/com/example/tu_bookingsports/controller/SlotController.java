package com.example.tu_bookingsports.controller;

import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.repository.SlotRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/slot")
@CrossOrigin(origins = "http://localhost:3000")
public class SlotController {

    private final SlotRepository slotRepository;

    public SlotController(SlotRepository slotRepository) {
        this.slotRepository = slotRepository;
    }

    // Lookup slotId by roomId and time (HH:mm or HH:mm:ss)
    @GetMapping("/lookup")
    public ResponseEntity<?> lookupSlot(@RequestParam("roomId") UUID roomId,
                                        @RequestParam("time") String time) {
        String timeStr = time;
        if (timeStr != null && timeStr.length() == 5) { // HH:mm -> HH:mm:ss
            timeStr = timeStr + ":00";
        }
        Slot slot = slotRepository.findByRoomIdAndSlotTimeNative(roomId, timeStr);
        if (slot == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Slot not found for roomId=" + roomId + " time=" + time);
        }
        Map<String, Object> resp = new HashMap<>();
        resp.put("slotId", slot.getSlotId());
        return ResponseEntity.ok(resp);
    }
}