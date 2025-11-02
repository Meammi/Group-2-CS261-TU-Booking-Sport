'use client';
import { use, useState } from 'react';
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
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [starredSlots, setStarredSlots] = useState<string[]>([]);
  const [favoriteMap, setFavoriteMap] = useState<Record<string, string>>({}); // time -> favoriteId

  const timeSlots = Object.entries(court.slot_time);

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

    const payload = {
      user_id: "6709616376",
      room_id: court.room_id,
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed. Please try again.');
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
    const slotKey = `${room_id}-${time}`;
    const isStarred = starredSlots.includes(slotKey);

    if (!isStarred) {
      // Add favorite
      try {
        const response = await axios.post("/favorite/create", {
          //mock รอ backend
          userId: "6709616376",
          roomId: room_id,
          slotTime: time,
        });
        const favoriteId = response.data.favoriteId;
        setStarredSlots((prev) => [...prev, time]);
        setFavoriteMap((prev) => ({ ...prev, [time]: favoriteId }));
        console.log("⭐ Added:", response.data);
      } catch (err: any) {
        console.error("Error adding favorite:", err.response?.data || err.message);
      }
    } else {
      // Remove favorite
      const favoriteId = favoriteMap[time];
      try {
        await axios.post(`/delete/${favoriteId}`, { time });
        setStarredSlots((prev) => prev.filter((t) => t !== time));
        setFavoriteMap((prev) => {
          const updated = { ...prev };
          delete updated[time];
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
                const isStarred = starredSlots.includes(time);
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
                      src={isStarred ? "/images/star-open.png" : "/images/star-close.png"}
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