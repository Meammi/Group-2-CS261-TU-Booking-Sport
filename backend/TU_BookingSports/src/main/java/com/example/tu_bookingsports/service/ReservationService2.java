package com.example.tu_bookingsports.service;

import com.example.tu_bookingsports.DTO.ReservationRequest;
import com.example.tu_bookingsports.model.Reservations;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.model.Slot.SlotStatus;
import com.example.tu_bookingsports.model.Reservations.ReservationStatus;
import com.example.tu_bookingsports.repository.ReservationRepository;
import com.example.tu_bookingsports.repository.RoomRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReservationService2 {

    @Autowired
    private SlotRepository slotRepository;
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private RoomRepository roomRepository;

    @Transactional
    public Reservations createReservation(ReservationRequest request) {
        UUID slotId = request.getSlotId();
        UUID roomId = request.getRoomId();

        // Validate slot matches room
        Slot slot = slotRepository.findBySlotIdAndRoom_RoomId(slotId, roomId);
        if (slot == null) {
            throw new RuntimeException("Error: Slot ID or Room ID is invalid or mismatched.");
        }

        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new RuntimeException("Error, This court was reserve!");
        }

        // Mark slot as booked
        slot.setStatus(SlotStatus.BOOKED);
        slotRepository.save(slot);

        // Fetch room (for price and validation)
        Rooms room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found."));

        // Build reservation period from slot time
        LocalTime startTime = slot.getSlotTime();
        LocalDateTime startDateTime = LocalDateTime.of(LocalDate.now(), startTime);
        LocalDateTime endDateTime = startDateTime.plusHours(1);

        // Create reservation
        Reservations reservation = new Reservations();
        reservation.setRoom(roomId);
        reservation.setUser(request.getUserId());
        reservation.setStartTime(startDateTime);
        reservation.setEndTime(endDateTime);
        reservation.setStatus(ReservationStatus.PENDING);

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservations cancelReservation(UUID reservationId) {
        Optional<Reservations> resOpt = reservationRepository.findById(reservationId);
        if (!resOpt.isPresent()) {
            throw new RuntimeException("Error: Reservation not found.");
        }

        Reservations reservation = resOpt.get();
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(reservation);

        // Free the slot by resolving it from room + start time (native TIME comparison; pass HH:mm:ss)
        java.time.format.DateTimeFormatter fmt = java.time.format.DateTimeFormatter.ofPattern("HH:mm:ss");
        String timeStr = reservation.getStartTime().toLocalTime().format(fmt);
        Slot slotToUpdate = slotRepository.findByRoomIdAndSlotTimeNative(
                reservation.getRoom(), timeStr
        );
        if (slotToUpdate != null) {
            slotToUpdate.setStatus(SlotStatus.AVAILABLE);
            slotRepository.save(slotToUpdate);
        }

        return reservation;
    }

    @Transactional
    public Reservations confirmReservation(UUID reservationId) {
        Optional<Reservations> resOpt = reservationRepository.findById(reservationId);
        if (!resOpt.isPresent()) {
            throw new RuntimeException("Error: Reservation not found.");
        }

        Reservations reservation = resOpt.get();
        reservation.setUpdatedAt(LocalDateTime.now());

        BigDecimal price = roomRepository.findById(reservation.getRoom())
                .map(Rooms::getPrice)
                .orElse(BigDecimal.ZERO);

        if (price.compareTo(BigDecimal.ZERO) <= 0) {
            reservation.setStatus(ReservationStatus.CONFIRMED);
            return reservationRepository.save(reservation);
        } else {
            // Payment flow can be integrated here; keep reservation pending.
            reservation.setStatus(ReservationStatus.PENDING);
            return reservationRepository.save(reservation);
        }
    }
}
