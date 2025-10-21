package com.example.tu_bookingsports.repository;

import com.example.tu_bookingsports.model.Slot;
import java.time.LocalTime;

public interface SlotTimeStatusProjection {
    LocalTime getSlotTime();
    Slot.SlotStatus getStatus();
}

