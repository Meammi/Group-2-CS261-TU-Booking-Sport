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

    private final SlotRepository slotRepository;
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    public ReservationService2(SlotRepository slotRepository, ReservationRepository reservationRepository, RoomRepository roomRepository) {
        this.slotRepository = slotRepository;
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
    }

    @Transactional
    public Reservations createReservation(ReservationRequest request) {
        //UUID slotId = request.getSlotId();
        //UUID roomId = request.getRoomId();

        Slot slot = slotRepository.findById(request.getSlotId()).orElse(null);;
        if (slot == null) {
            throw new RuntimeException("Error: Slot is not found");
        }
        Rooms room = roomRepository.findById(slot.getRoom().getRoom_id()).orElse(null);;
        if (room == null) {
            throw new RuntimeException("Error: Room is not found");
        }

        System.out.println("getStatus from slotRepo         "+slot.getStatus());
        System.out.println(" SlotId from request        "+request.getSlotId());
        //System.out.println(" RoomId from request        "+request.getRoomId());
        System.out.println("found SlotId from slotRepo         "+slot.getSlotId());
        System.out.println("found RoomId from roomRepo         "+room.getRoom_id());

        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new RuntimeException("Error, This court was reserve!, Slot Status: "+slot.getStatus()+", SlotId: "+slot.getSlotId());
        }

        slot.setStatus(SlotStatus.BOOKED);
        slotRepository.save(slot);

        // Build reservation period from slot time
        LocalTime startTime = slot.getSlotTime();
        LocalDateTime startDateTime = LocalDateTime.of(LocalDate.now(), startTime);
        LocalDateTime endDateTime = startDateTime.plusHours(1);

        // Create reservation
        Reservations reservation = new Reservations();

        reservation.setUser(request.getUserId()); //1
        reservation.setRoom(slot.getRoom().getRoom_id()); //2
        reservation.setSlotId(slot.getSlotId()); //3

        reservation.setStartTime(startDateTime); //4
        reservation.setEndTime(endDateTime); //5

        BigDecimal price = roomRepository.findById(reservation.getRoom())
                .map(Rooms::getPrice)
                .orElse(BigDecimal.ZERO);

        if (price.compareTo(BigDecimal.ZERO) <= 0) {
            reservation.setStatus(ReservationStatus.CONFIRMED);//6
        } else {
            reservation.setStatus(ReservationStatus.PENDING);//6
        }

        reservation.setPrice(room.getPrice()); //7

        return reservationRepository.save(reservation);

    }

}
