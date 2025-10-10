"use client";
import React, { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

type Props = {
  title: string;
  slotTimes?: string[];
  onSelectTime?: (payload: { spot: string; time: string }) => void; // ✅ รับ callback
};

export default function RsvInterzoneCard({
  title,
  slotTimes = ["16:00", "17:00", "18:00", "19:00", "20:00"],
  onSelectTime, // ✅ รับจาก props
}: Props) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = (time: string) => {
    setSelectedTime(time);
    // ส่งข้อมูลให้หน้า parent ถ้ามี onSelectTime
    if (onSelectTime) {
      onSelectTime({ spot: title, time }); // ✅ ปลอดภัยสุด
    } else {
      console.warn("onSelectTime not passed!");
    }
  };

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <div className="relative flex items-center gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
      {/* ⭐ ปุ่มดาว */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 text-gray-400 hover:text-yellow-500 transition"
      >
        {isFavorite ? (
          <FaStar className="text-yellow-400 text-xl" />
        ) : (
          <FaRegStar className="text-xl" />
        )}
      </button>

      {/* 🏸 รูป */}
      <div className="w-32 h-24 overflow-hidden rounded-md bg-gray-200 flex-shrink-0">
        <img
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhAwJaSG_wgOtVj06BOUspGXRpQF_znpSZlC9eEZlHWItjRxmpyYntGNrBiuo-a4RVhgU0V9SitMSDcurYTHFmMetk0-fZ_QTUjEj9MAz8GiTuMaNb1dbpXVW9TXTjND1reTuP0DHYa8mo/s1133/Inter02.jpg"
          alt="Interzone court"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 🕐 เนื้อหาฝั่งขวา */}
      <div className="flex-1 text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <div className="h-[2px] w-full bg-black mb-3" />

        <div className="flex flex-wrap justify-center gap-2">
          {slotTimes.map((t) => (
            <button
              key={t}
              onClick={() => handleClick(t)} // ✅ ใช้ฟังก์ชันใน scope
              className={`rounded-md px-3 py-1 text-white font-semibold text-sm shadow transition ${
                selectedTime === t
                  ? "bg-red-600"
                  : "bg-black hover:bg-gray-800 active:scale-95"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}