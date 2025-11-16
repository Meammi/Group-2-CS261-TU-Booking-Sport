"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import ConfirmModal from "@/components/ConfirmCard";

interface Court {
  name: string;
  type: string;
  capacity: number;
  price: number;
  room_id: string;
  loc_name: string;
  slot_time: { [time: string]: "AVAILABLE" | "BOOKED" | "MAINTENANCE" };
}

interface CourtCardProps {
  court: Court;
  selectedDate?: string;
  onSlotSelected: (court: Court, time: string) => void;
}

interface BookingResponse {
  reservation_id: string;
  room_name: string;
  total_price: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5";
    case "BOOKED":
      return "bg-gray-400 text-gray-200 cursor-not-allowed";
    case "MAINTENANCE":
      return "bg-yellow-500 text-white cursor-not-allowed";
    default:
      return "bg-gray-300";
  }
};

const normalizeTime = (time: string): string => {
  if (time.length > 5) return time.substring(0, 5);
  if (time.length === 4) return `0${time}`;
  return time;
};

const getSlotKey = (roomId: string, time: string) =>
  `${roomId}-${normalizeTime(time)}`.toUpperCase();

const today = new Date().toISOString().split("T")[0];

export default function CourtCard({
  court,
  selectedDate = today,
  onSlotSelected,
}: CourtCardProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [starredSlots, setStarredSlots] = useState<string[]>([]);
  const [favoriteMap, setFavoriteMap] = useState<Record<string, string>>({});
  const [slotMap, setSlotMap] = useState<Record<string, string>>({});

  const timeSlots = Object.entries(court.slot_time);

  function extractTimeFromSlotId(slotId: string): string {
    const match = slotId.match(/(\d{2}:\d{2})$/);
    return match ? match[1] : "00:00"; // fallback
  }

  useEffect(() => {
    const fetchSlotMap = async () => {
      try {
        const res = await axios.get(
          `/slot?room_id=${court.room_id}&date=${selectedDate}`
        );
        const map: Record<string, string> = {};
        res.data.forEach((slot: { slotId: string; slotTime: string }) => {
          const key = getSlotKey(court.room_id, slot.slotTime);
          map[key] = slot.slotId;
        });
        setSlotMap(map);
      } catch (err) {
        console.error("Error fetching slot map:", err);
      }
    };
    fetchSlotMap();
  }, [court.room_id, selectedDate]);

  useEffect(() => {
    async function fetchFavoriteSlots() {
      try {
        const res = await axios.get("/favorite/me"); // returns array of favorites
        const slots: string[] = [];
        const map: Record<string, string> = {};

        res.data.forEach(
          (fav: { favoriteId: string; roomId: string; startTime: string }) => {
            const time = fav.startTime.substring(0, 5); // "16:00:00" → "16:00"
            const slotKey = `${fav.roomId}-${time}`.toUpperCase();
            slots.push(slotKey);
            map[slotKey] = fav.favoriteId;
          }
        );

        setStarredSlots(slots);
        setFavoriteMap(map);
      } catch (error) {
        console.error("Error fetching favorite slots:", error);
      }
    }

    fetchFavoriteSlots();
  }, []);

  const handleSlotClick = (time: string) => {
    setBookingResult(null);
    setSelectedSlot(time);
    setIsModalOpen(true);
    // Notify parent if provided
    if (onSlotSelected) onSlotSelected(court, time);
  };

  useEffect(() => {
    onSlotSelected(court, "TiMe");
  }, [isModalOpen]);

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    setIsLoading(true);
    setBookingResult(null);

    const startTime = new Date(`${selectedDate}T${selectedSlot}:00`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    const slotKey = getSlotKey(court.room_id, selectedSlot);
    const slotId = slotMap[slotKey];

    const payload = {
      user_id: "6709616376",
      room_id: court.room_id.toUpperCase(),
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      num_guests: court.capacity,
      total_price: court.price,
    };

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.error ||
            "Booking failed. Please try again."
        );
      }

      const result: BookingResponse = await response.json();
      setBookingResult({
        type: "success",
        message: `Successfully booked! ID: ${result.reservation_id}`,
      });
    } catch (error: any) {
      setBookingResult({ type: "error", message: error.message });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleStarClick = async (time: string, room_id: string) => {
    const slotKey = getSlotKey(room_id, time);
    let slotId = slotMap[slotKey];
    const starred = starredSlots.includes(slotKey) || !!favoriteMap[slotKey];

    if (!slotId) {
      try {
        const resp = await axios.get(`/api/slot/lookup`, {
          params: { roomId: room_id, time: normalizeTime(time) },
        });
        slotId = resp.data?.slotId;
        if (!slotId) return;
      } catch (err) {
        console.error("Slot lookup error", err);
        return;
      }
    }

    const slotIdToSend = slotId.replace(/-\d{2}:\d{2}$/, "");

    if (!starred) {
      try {
        const response = await axios.post(
          "/favorite/create",
          { roomId: room_id, slotId: slotIdToSend },
          { withCredentials: true }
        );
        let favoriteId =
          response.data?.favorite_id ||
          response.data?.favoriteId ||
          response.data?.id;
        if (!favoriteId) {
          const lookup = await axios.get("/favorite/lookup", {
            params: { roomId: room_id, slotId: slotIdToSend },
          });
          favoriteId =
            lookup.data?.favorite_id ||
            lookup.data?.favoriteId ||
            lookup.data?.id;
        }
        if (favoriteId) {
          setStarredSlots((prev) => [...prev, slotKey]);
          setFavoriteMap((prev) => ({ ...prev, [slotKey]: favoriteId }));
        }
      } catch (err: any) {
        console.error(
          "Error adding favorite:",
          err.response?.data || err.message
        );
      }
    } else {
      let favoriteId = favoriteMap[slotKey];
      if (!favoriteId) {
        try {
          const lookup = await axios.get("/favorite/lookup", {
            params: { roomId: room_id, slotId: slotIdToSend },
          });
          favoriteId =
            lookup.data?.favorite_id ||
            lookup.data?.favoriteId ||
            lookup.data?.id;
          if (favoriteId) {
            setFavoriteMap((prev) => ({ ...prev, [slotKey]: favoriteId }));
          }
        } catch (err) {
          console.warn("Favorite lookup failed for remove", err);
        }
      }

      if (!favoriteId) {
        setStarredSlots((prev) => prev.filter((t) => t !== slotKey));
        setFavoriteMap((prev) => {
          const updated = { ...prev };
          delete updated[slotKey];
          return updated;
        });
        return;
      }

      try {
        await axios.delete(`/favorite/delete/${favoriteId}`, {
          withCredentials: true,
        });
        setStarredSlots((prev) => prev.filter((t) => t !== slotKey));
        setFavoriteMap((prev) => {
          const updated = { ...prev };
          delete updated[slotKey];
          return updated;
        });
      } catch (err) {
        console.error("Error removing favorite:", err);
      }
    }
  };

  return (
    <>
      <ConfirmModal
        open={isModalOpen}
        spot={court.name}
        date={selectedDate}
        time={selectedSlot || ""}
        onClose={() => setIsModalOpen(false)}
        // Let ConfirmModal handle the API call itself
        roomId={court.room_id}
      />

      {/* Card */}
      <div className="m-4 rounded-xl bg-white p-4 shadow-lg border-l-4 border-tu-navy transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-tu-navy">{court.name}</h3>
            <p className="text-sm text-gray-500">
              Capacity: {court.capacity} people
            </p>
          </div>
          <span className="text-lg font-semibold text-gray-800">
            {court.price > 0 ? `${court.price}฿` : "Free"}
          </span>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-semibold mb-3 text-gray-700">
            Available Times:
          </p>
          {timeSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map(([time, status]) => {
                const slotKey = getSlotKey(court.room_id, time);
                const isStarred =
                  starredSlots.includes(slotKey) ||
                  (favoriteMap[slotKey] &&
                    typeof favoriteMap[slotKey] === "string");
                const isHovered = hoveredSlot === time;

                return (
                  <button
                    key={time}
                    disabled={status !== "AVAILABLE"}
                    onClick={() => handleSlotClick(time)}
                    onMouseEnter={() => setHoveredSlot(time)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    className={`relative rounded-lg p-2 text-sm font-mono font-semibold transition-all duration-200 ${getStatusClasses(
                      status
                    )}`}
                  >
                    {time.substring(0, 5)}
                    <img
                      src={
                        isStarred
                          ? "/images/star-open.png"
                          : "/images/star-close.png"
                      }
                      alt="star"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStarClick(time, court.room_id);
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
            <p className="text-sm text-gray-500 text-center py-4">
              No time slots available for this day.
            </p>
          )}
        </div>

        {bookingResult && (
          <div
            className={`mt-4 p-2 rounded-lg text-center text-sm font-semibold ${
              bookingResult.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {bookingResult.message}
          </div>
        )}
      </div>
    </>
  );
}
