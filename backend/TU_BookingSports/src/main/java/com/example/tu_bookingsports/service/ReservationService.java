//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\service\ReservationService.java
package com.example.tu_bookingsports.service; //this is for testing another pc

import com.example.tu_bookingsports.DTO.ReservationRequest;
import com.example.tu_bookingsports.model.Reservations;
import com.example.tu_bookingsports.model.Rooms;
import com.example.tu_bookingsports.model.Slot;
import com.example.tu_bookingsports.repository.HomepageRepository;
import com.example.tu_bookingsports.repository.ReservationRepository;
import com.example.tu_bookingsports.repository.RoomRepository;
import com.example.tu_bookingsports.repository.SlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final HomepageRepository roomsRepository;
    private final SlotRepository slotRepository;
    private final RoomRepository roomRepository;

    private final int MAX_RESERVATION = 10;

    public ReservationService(ReservationRepository reservationRepository, HomepageRepository roomsRepository, SlotRepository slotRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.roomsRepository = roomsRepository;

        this.slotRepository = slotRepository;
        this.roomRepository = roomRepository;
    }

    public BigDecimal getPriceByReservationId(UUID reservationId) {
        Reservations reservation = reservationRepository.findByReservationID(reservationId);
        if (reservation == null) {
            throw new IllegalArgumentException("Reservation not found: " + reservationId);
        }

        UUID roomId = reservation.getRoom();
        Rooms room = roomsRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomId));
        return room.getPrice();
    }



    @Transactional
    public Reservations createReservation(ReservationRequest request,UUID loggedInUserId) {
        System.out.println("request getUserId: "+request.getUserId());
        System.out.println("token getUserId: "+loggedInUserId);
        System.out.println("request getSlotId: "+request.getSlotId());





        Optional<Slot> slotOptional = Optional.empty();
        if (request.getSlotId() != null) {

            slotOptional = slotRepository.findById(request.getSlotId());

        }

        Slot slot = slotOptional.orElseThrow(() -> new RuntimeException("Error: Slot is not found"));;

        //got slot now start making reservation

        //Rooms room = roomRepository.findById(slot.getRoom().getRoom_id()).orElse(null);
        Rooms room = slot.getRoom();

        if (room == null) {
            throw new RuntimeException("Error: Room is not found");
        }

        System.out.println("getStatus from slotRepo         "+slot.getStatus());
        System.out.println(" SlotId from request        "+request.getSlotId());

        System.out.println("found SlotId from slotRepo         "+slot.getSlotId());
        System.out.println("found RoomId from roomRepo         "+room.getRoom_id());

        if (slot.getStatus() == Slot.SlotStatus.BOOKED || slot.getStatus() == Slot.SlotStatus.MAINTENANCE ) {
            throw new RuntimeException("Error, This court was reserve!, Slot Status: "+slot.getStatus()+", SlotId: "+slot.getSlotId());
        }

        slot.setStatus(Slot.SlotStatus.BOOKED);
        slotRepository.save(slot);

        // Build reservation period from slot time
        LocalTime startTime = slot.getSlotTime();
        LocalDateTime startDateTime = LocalDateTime.of(LocalDate.now().plusDays(1), startTime);
        LocalDateTime endDateTime = startDateTime.plusHours(1);

        // Check if current Reservation >=10
        List<Reservations> reservations = reservationRepository.findByUser(loggedInUserId);
        long tomorrowReservationsCount = reservations.stream()
                .filter(b -> {
                    return b.getEndTime().isAfter(LocalDateTime.now());
                })
                .count();
        if (tomorrowReservationsCount >= MAX_RESERVATION) {
            throw new RuntimeException("Error: Reached current maximum number of reservations: "+tomorrowReservationsCount+"/"+MAX_RESERVATION);
        }


        // Create reservation
        Reservations reservation = new Reservations();

        reservation.setUser(loggedInUserId); //1
        reservation.setRoom(slot.getRoom().getRoom_id()); //2
        reservation.setSlot(slot.getSlotId()); //3

        reservation.setStartTime(startDateTime); //4
        reservation.setEndTime(endDateTime); //5

        BigDecimal price = roomRepository.findById(reservation.getRoom())
                .map(Rooms::getPrice)
                .orElse(BigDecimal.ZERO);

        if (price.compareTo(BigDecimal.ZERO) <= 0) {
            reservation.setStatus(Reservations.ReservationStatus.CONFIRMED);//6
        } else {
            reservation.setStatus(Reservations.ReservationStatus.PENDING);//6
        }

        reservation.setPrice(price); //7

        return reservationRepository.save(reservation);

    }
}
