'use client';
import { useEffect, useState } from 'react';
import axios from "@/lib/axios";

interface Court {
  name: string;
  type: string;
  capacity: number;
  price: number;
  room_id: string;
  loc_name: string;
  slot_time: { [time: string]: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' };
}

interface CourtCardProps {
  court: Court;
  selectedDate?: string;
}

interface BookingResponse {
  reservation_id: string;
  room_name: string;
  total_price: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5';
    case 'BOOKED':
      return 'bg-gray-400 text-gray-200 cursor-not-allowed';
    case 'MAINTENANCE':
      return 'bg-yellow-500 text-white cursor-not-allowed';
    default:
      return 'bg-gray-300';
  }
};

const today = new Date().toISOString().split('T')[0];

export default function CourtCard({ court, selectedDate = today }: CourtCardProps) {
  // const [userId, setUserId] = useState<string | null>(null);
  const [slotMap, setSlotMap] = useState<Record<string, string>>({}); // timeKey -> slotId
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [starredSlots, setStarredSlots] = useState<string[]>([]);
  const [favoriteMap, setFavoriteMap] = useState<Record<string, string>>({}); // time -> favoriteId

  const timeSlots = Object.entries(court.slot_time);

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     try {
  //       const res = await axios.get("/auth/me");
  //       setUserId(res.data.id);
  //     } catch (err) {
  //       console.error("Error fetching user ID:", err);
  //     }
  //   };
  //   fetchUserId();
  // }, []);

  useEffect(() => {
    const fetchSlotMap = async () => {
      try {
        console.log('Fetching slots for:', { room_id: court.room_id, date: selectedDate });
        const res = await axios.get(`/slot?room_id=${court.room_id}&date=${selectedDate}`);
        const map: Record<string, string> = {};

        console.log('Raw API Response:', res.data);

        res.data.forEach((slot: { slotId: string; slotTime: string }) => {
          // Ensure time is in HH:mm format
          let normalizedTime = slot.slotTime;
          if (normalizedTime.length > 5) {
            normalizedTime = normalizedTime.substring(0, 5);
          } else if (normalizedTime.length === 4) {
            // If format is H:mm, add leading zero
            normalizedTime = `0${normalizedTime}`;
          }
          
          const key = `${court.room_id}-${normalizedTime}`.toUpperCase();
          map[key] = slot.slotId;
          console.log('Processing slot:', { 
            original: slot.slotTime,
            normalized: normalizedTime,
            key,
            slotId: slot.slotId
          });
          console.log("Created mapping:", { key, slotId: slot.slotId });
        });

        setSlotMap(map);
        // เพิ่ม logging
        console.log("Final slotMap:", map);
      } catch (err) {
        console.error("Error fetching slot map:", err);
      }
    };

    fetchSlotMap();
  }, [court.room_id, selectedDate]);


  const handleSlotClick = (time: string) => {
    setBookingResult(null);
    setSelectedSlot(time);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;

    setIsLoading(true);
    setBookingResult(null);

    const startTime = new Date(`${selectedDate}T${selectedSlot}:00`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    const slotId = slotMap[`${court.room_id}-${timeSlots}`];

    const payload = {
      user_id: "6709616376",
      room_id: court.room_id.toUpperCase(),
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      num_guests: court.capacity,
      total_price: court.price,
    };

    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMessage = 'Booking failed. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonErr) {
          console.warn("Failed to parse error response as JSON:", jsonErr);
        }
        throw new Error(errorMessage);
      }


      const result: BookingResponse = await response.json();
      setBookingResult({ type: 'success', message: `Successfully booked! ID: ${result.reservation_id}` });

    } catch (error: any) {
      setBookingResult({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleStarClick = async (time: string, room_id: string) => {
    // Ensure time is in HH:mm format
    let normalizedTime = time;
    if (time.length > 5) {
      normalizedTime = time.substring(0, 5);
    } else if (time.length === 4) {
      // If format is H:mm, add leading zero
      normalizedTime = `0${time}`;
    }
    
    const slotKey = `${room_id}-${normalizedTime}`.toUpperCase();
    
    // Debug logging
    console.log("Original time:", time);
    console.log("Normalized time:", normalizedTime);
    console.log("SlotKey:", slotKey);
    console.log("SlotMap keys:", Object.keys(slotMap));
    
    const isStarred = starredSlots.includes(slotKey);
    let slotId = slotMap[slotKey];

    // Fallback: ถ้าไม่เจอ slotId ใน slotMap ให้เรียก backend lookup
    if (!slotId) {
      try {
        const resp = await axios.get(`/api/slot/lookup`, {
          params: {
            roomId: room_id,
            time: normalizedTime
          }
        });
        if (resp.data && resp.data.slotId) {
          slotId = resp.data.slotId;
          console.log("[FALLBACK] slotId from backend lookup:", slotId);
        } else {
          console.error("Missing slotId for", slotKey);
          console.log("Available slots:", Object.entries(slotMap).map(([key, value]) => ({
            key,
            slotId: value,
            matches: key === slotKey
          })));
          return;
        }
      } catch (err) {
        console.error("Slot lookup error", err);
        return;
      }
    }

    // ตัด -เวลา (เช่น -21:00, -18:00) ออกจาก slotId ทุกครั้ง
    let slotIdToSend = slotId;
    if (typeof slotIdToSend === "string") {
      slotIdToSend = slotIdToSend.replace(/-\d{2}:\d{2}$/, "");
    }

    if (!isStarred) {
      // Add favorite
      try {
        // Log ข้อมูลก่อนสร้าง favorite
        console.log("Try to create favorite", { roomId: room_id, slotId: slotIdToSend });
        const response = await axios.post("/favorite/create", {
          roomId: room_id,
          slotId: slotIdToSend
        }, {
          withCredentials: true
        });

        console.log("Create response:", response.data);
        // support multiple possible field names returned by backend
        let favoriteId: string | null = (response.data && (response.data.favorite_id || response.data.favoriteId || response.data.id)) || null;
        if (!favoriteId && response.data && typeof response.data === 'object') {
          // try nested data
          // @ts-ignore
          favoriteId = response.data.data?.favorite_id || response.data.data?.id || favoriteId;
        }

        // If still not found, try lookup endpoint as a fallback
        if (!favoriteId) {
          try {
            const lookup = await axios.get('/favorite/lookup', { params: { roomId: room_id, slotId: slotIdToSend } });
            console.log('[FALLBACK] favorite lookup response:', lookup.data);
            // @ts-ignore
            favoriteId = lookup.data?.favorite_id || lookup.data?.favoriteId || lookup.data?.id || favoriteId;
          } catch (lookupErr) {
            console.warn('Favorite lookup failed', lookupErr);
          }
        }

        if (favoriteId) {
          setStarredSlots((prev) => [...prev, slotKey]);
          setFavoriteMap((prev) => ({ ...prev, [slotKey]: favoriteId }));
          console.log("★ Added:", time, { favoriteId });
        } else {
          console.error('Failed to determine favoriteId after create', response.data);
        }
      } catch (err: any) {
        console.error("Error adding favorite:", err.response?.data || err.message);
      }
    } else {
      // Remove favorite
      let favoriteId = favoriteMap[slotKey];
      // If favoriteId missing in map, try lookup by room+slot
      if (!favoriteId) {
        console.log('favoriteId missing locally, attempting lookup before remove', { slotKey, slotIdToSend });
        try {
          const lookup = await axios.get('/favorite/lookup', { params: { roomId: room_id, slotId: slotIdToSend } });
          console.log('[FALLBACK] favorite lookup response for remove:', lookup.data);
          // @ts-ignore
          favoriteId = lookup.data?.favorite_id || lookup.data?.favoriteId || lookup.data?.id || favoriteId;
          if (favoriteId) {
            // cache it for future
            setFavoriteMap((prev) => ({ ...prev, [slotKey]: favoriteId }));
          }
        } catch (lookupErr) {
          console.warn('Favorite lookup failed for remove', lookupErr);
        }
      }

      if (!favoriteId) {
        console.error("Cannot remove favorite: favoriteId is invalid", { slotKey, favoriteId, favoriteMap });
        // To avoid stuck UI, remove starred mark locally
        setStarredSlots((prev) => prev.filter((t) => t !== slotKey));
        setFavoriteMap((prev) => {
          const updated = { ...prev };
          delete updated[slotKey];
          return updated;
        });
        return;
      }

      // เพิ่ม log ตรวจสอบก่อนลบ
      console.log("Try to remove favorite", { slotKey, favoriteId, starredSlots, favoriteMap });
      try {
        await axios.delete(`/favorite/delete/${favoriteId}`, { withCredentials: true });
        setStarredSlots((prev) => prev.filter((t) => t !== slotKey));
        setFavoriteMap((prev) => {
          const updated = { ...prev };
          delete updated[slotKey];
          return updated;
        });
        console.log("☆ Removed:", time);
      } catch (err) {
        console.error("Error removing favorite:", err);
      }
    }
  };



  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold text-tu-navy mb-2">Confirm Your Booking</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to book <br />
              <span className="font-bold">{court.name}</span> at <span className="font-bold">{selectedSlot}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="px-6 py-2 rounded-lg bg-tu-navy hover:bg-tu-navy/90 text-white font-semibold transition disabled:opacity-50"
              >
                {isLoading ? 'Booking...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card */}
      <div className="m-4 rounded-xl bg-white p-4 shadow-lg border-l-4 border-tu-navy transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-tu-navy">{court.name}</h3>
            <p className="text-sm text-gray-500">Capacity: {court.capacity} people</p>
          </div>
          <span className="text-lg font-semibold text-gray-800">{court.price > 0 ? `${court.price}฿` : 'Free'}</span>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-semibold mb-3 text-gray-700">Available Times:</p>
          {timeSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map(([time, status]) => {
                // Normalize time ให้เหมือนใน handleStarClick
                let normalizedTime = time;
                if (time.length > 5) {
                  normalizedTime = time.substring(0, 5);
                } else if (time.length === 4) {
                  normalizedTime = `0${time}`;
                }
                const slotKey = `${court.room_id}-${normalizedTime}`.toUpperCase();
                const isStarred = starredSlots.includes(slotKey);
                const isHovered = hoveredSlot === time;


                return (
                  <button
                    key={time}
                    disabled={status !== 'AVAILABLE'}
                    onClick={() => handleSlotClick(time)}
                    onMouseEnter={() => setHoveredSlot(time)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    className={`relative rounded-lg p-2 text-sm font-mono font-semibold transition-all duration-200 ${getStatusClasses(status)}`}
                  >
                    {time.substring(0, 5)}
                    <img
                      src={
                        isStarred
                          ? "/images/star-open.png"
                          : "/images/star-close.png"}
                      alt="star"
                      onClick={(e) => {
                      e.stopPropagation();
                      handleStarClick(time, court.room_id);
                      console.log("slots:", slotMap);
                    }}
                      className={`absolute top-1 right-1 w-4 h-4 cursor-pointer transition-transform duration-200 ${
                        isHovered ? "scale-110" : "scale-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No time slots available for this day.</p>
          )}
        </div>

        {bookingResult && (
          <div
            className={`mt-4 p-2 rounded-lg text-center text-sm font-semibold ${
              bookingResult.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {bookingResult.message}
          </div>
        )}
      </div>
    </>
  );
}