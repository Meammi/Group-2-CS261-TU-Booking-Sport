import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import ConfirmModal from "@/components/ConfirmCard"; // (คุณใช้ชื่อ ConfirmCard.tsx หรือ ConfirmModal.tsx ให้แน่ใจว่า import ถูกต้องนะครับ)

interface cardProps {
  roomId: string;
  slotId: string;
  type: string;
  name: string;
  locationName: string;
  startTime: string;
}

const defaultUrl = "/images/interzone.jpg";

// --- 1. เพิ่มฟังก์ชันนี้สำหรับสร้างวันที่ปัจจุบัน ---
const getTodayDateString = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // JavaScript นับเดือน 0-11
  const year = today.getFullYear();
  return `${day}/${month}/${year}`; // Format: DD/MM/YYYY
};
// ----------------------------------------

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
    } else {
      imageUrl = "/images/musicroom.jpg";
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

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

  const [datePart, timePartRaw] = startTime.includes("T")
    ? startTime.split("T")
    : ["", startTime];
  
  // --- 2. แก้ไขบรรทัดนี้: ถ้าไม่มี datePart ให้ใช้ "วันที่ปัจจุบัน" แทน "N/A" ---
  const displayDate = datePart || getTodayDateString();
  // -----------------------------------------------------------
  
  const displayTime = (timePartRaw || startTime || "").substring(0, 5);

  return (
    <>
      <ConfirmModal
        open={isModalOpen}
        spot={name}
        date={displayDate} // <-- ตอนนี้จะส่ง "16/11/2025" (หรือวันที่ปัจจุบัน)
        time={displayTime} // <-- จะส่ง "17:00"
        roomId={roomId}
        slotId={slotId}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
        }}
      />

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
      {confirmationMessage && (
        <p className="mt-2 text-sm text-green-600 text-center">
          {confirmationMessage}
        </p>
      )}
    </>
  );
}