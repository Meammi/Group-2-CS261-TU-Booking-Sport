package com.example.tu_bookingsports.controller;
import com.example.tu_bookingsports.DTO.PaymentRequest;
import com.example.tu_bookingsports.model.Payment;
import com.example.tu_bookingsports.service.PaymentService;
import com.google.zxing.WriterException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "")
public class ReservationController {
    private final RoomService roomService;
    public ReservationController(RoomService roomService) {
        this.roomService = roomService;
    }


    @GetMapping("/rooms")
    public ResponseEntity<List<RoomReservationDTO>> getReservationView(
            @RequestParam(required = true) String type,
            @RequestParam(required = true) String locName) // type อาจถูกบังคับให้ส่งมา
    {
        // เรียก Service โดยส่งตัวกรองเข้าไป
        List<RoomReservationDTO> details = roomService.getRoomDetailsWithSlotsFiltered(type, locName);
        return ResponseEntity.ok(details);
    }
}



/*@GetMapping("/reservations")
    public ResponseEntity<List<RoomResponseDTO>> getAvailableRooms(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String locName)
    {
        // Fetch and map only necessary data (id, name, type, locName)
        List<RoomResponseDTO> availableRooms = roomService.findAvailableRooms(type, locName);
        return ResponseEntity.ok(availableRooms);
    }*/

    /*@GetMapping("/rooms")
    public List<ReservationResponse> getReservationpage() {
        return reservationService.getReservationpageData();
    }*/


/*@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private ReservationService reservationService;

    // หน้าแรกต้อนเปิดหน้ามาแค่ส่งหา backend ขอ reservation ทั้งหมด
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationService.findAll();
        // **Note:** You mentioned 'calculate and send back'.
        // If you need specific calculated data (e.g., total price, duration),
        // you should use a DTO (Data Transfer Object) here instead of the raw Entity.
        return ResponseEntity.ok(reservations);
    }

    // ... Other endpoints (like payment) will go here
}
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

}
// Reservation DTO for input (Data Transfer Object)
public class ReservationRequest {
    private UUID roomId;
    private UUID userId;
    private LocalTime slotTime; // Assuming slot_time from your table is enough to determine start time
    // You might need a date too, e.g., private LocalDate reservationDate;
}

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    // ... existing components

    @Autowired
    private PaymentService paymentService; // Assuming you have this service

    // ตอนกดปุ่มจอง
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {

        // 1. Check Availability (Service will handle this by checking 'Slot' and 'Reservation' tables)
        if (!reservationService.isSlotAvailable(request.getRoomId(), request.getSlotTime())) {
            // return หน้า error ถ้าไม่ว่าง
            return ResponseEntity
                    .status(HttpStatus.CONFLICT) // 409 Conflict is appropriate
                    .body("The selected slot is already booked.");
        }

        // 2. Create Reservation (Status: PENDING)
        Reservation newReservation = reservationService.createPendingReservation(request);

        // 3. Payment Step: Get Payment Info for Frontend
        // getPayment(@PathVariable("id") String id) ส่งให้ front ก่อน
        PaymentDetailsDTO paymentDetails = paymentService.getPaymentDetails(newReservation.getReservationId().toString());

        // 4. Send back confirmation/payment details page
        // else ส่งกลับหน้า confirmation
        return ResponseEntity.ok(paymentDetails);
    }

    // ... Your existing payment flow would handle the callback:
    // ... PaymentRequest พร้อม set reservationId กับ paymentService.createPayment(request.getReservationId());
}*/
