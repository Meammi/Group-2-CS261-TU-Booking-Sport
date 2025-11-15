import Image from "next/image";
import { useEffect ,useState } from "react";
import axios from "@/lib/axios";

interface cardProps {
  roomId: string;
  slotId: string;
  type: string;
  name: string;
  locationName: string;
  startTime: string;
}

const defaultUrl = "/images/interzone.jpg";

export default function FavoriteCard({
  roomId,
  slotId,
  type,
  name,
  locationName,
  startTime,
}: cardProps) {

  let imageUrl = defaultUrl;

  if (locationName === "Gym 4") {
    imageUrl = "/images/gym4.jpg";
  } else if (locationName === "karaoke") {
    imageUrl = "/images/karaoke.jpg";
  } else if (locationName === "Melodysphere") {
    if (type === "Karaoke Room") {
      imageUrl = "/images/karaoke.jpg";
    }else {
      imageUrl = "/images/musicroom.jpg";
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  // ...rest of your code

  useEffect(() => {
    async function fetchFavoriteStatus() {
      try {
        const res = await axios.get("/favorite/me");
        const match = res.data.find(
          (fav: any) => fav.roomId === roomId && fav.slotId === slotId
        );
        if (match) {
          setIsStarred(true);
          setFavoriteId(match.favoriteId);
        }
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    }
    fetchFavoriteStatus();
  }, [roomId, slotId]);

  const handleStarClick = async () => {
    if (!isStarred) {
      try {
        const res = await axios.post("/favorite/create", { roomId, slotId });
        setIsStarred(true);
        setFavoriteId(res.data.favoriteId);
      } catch (err) {
        console.error("Error adding favorite:", err);
      }
    } else {
      try {
        if (favoriteId) {
          await axios.delete(`/favorite/delete/${favoriteId}`);
          setIsStarred(false);
          setFavoriteId(null);
        }
      } catch (err) {
        console.error("Error removing favorite:", err);
      }
    }
  };


  const handleConfirmBooking = async () => {
    setIsLoading(true);

    const payload = {
      user_id: "6709616376",
      room_id: roomId,
      slot_id: slotId,
      start_time: `${startTime}`,
      end_time: `${startTime}`, // You might want to calculate +1 hour here
    };

    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Booking failed");

      const result = await res.json();
      console.log("Booking success:", result);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsLoading(false);
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
              <span className="font-bold">{name}</span> at <span className="font-bold">{startTime}</span>?
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
                {isLoading ? "Booking..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card */}
      <div
        className="relative flex items-center gap-4 rounded-lg bg-white p-3 shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={imageUrl}
            alt={`Image of ${type}`}
            layout="fill"
            objectFit="cover"
            className="bg-gray-200"
          />
        </div>

        <div className="flex-grow">
          <h3 className="text-lg font-bold text-blue-600">{type}</h3>
          <p className="text-sm text-gray-600">Location: {locationName}</p>
          <p className="text-sm text-gray-600">Court: {name}</p>
          <p className="text-sm text-gray-600">Time: {startTime}</p>
        </div>
        <div>
          <img
            src={isStarred ? "/images/star-open.png" : "/images/star-close.png"}
            alt="star"
            onClick={(e) => {
              e.stopPropagation();
              handleStarClick();
            }}
            className="absolute top-2.5 right-2.5 w-5 h-5 cursor-pointer transition-transform hover:scale-110"
          />
        </div>
      </div>
    </>
  );
}