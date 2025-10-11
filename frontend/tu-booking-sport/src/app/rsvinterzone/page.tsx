"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ReservationHeader from "@/components/ReservationHeader";
import RsvInterzoneCard from "@/components/rsvinterzoneCard";
import ConfirmModal from "@/components/confirmcard";

// ---- data เดิมของหน้า ----
const reservations = [
  { id: 1, title: "Interzone 01", location: "Interzone", total: 5 },
  { id: 2, title: "Interzone 02", location: "Interzone", total: 5 },
  { id: 3, title: "Interzone 03", location: "Interzone", total: 5 },
  { id: 4, title: "Interzone 04", location: "Interzone", total: 5 },
  { id: 5, title: "Interzone 05", location: "Interzone", total: 5 },
  { id: 6, title: "Interzone 06", location: "Interzone", total: 5 },
  { id: 7, title: "Interzone 07", location: "Interzone", total: 5 },
  { id: 8, title: "Interzone 08", location: "Interzone", total: 5 },
  { id: 9, title: "Interzone 09", location: "Interzone", total: 5 },
  { id: 10, title: "Interzone 10", location: "Interzone", total: 5 },
  { id: 11, title: "Interzone 11", location: "Interzone", total: 5 },
  { id: 12, title: "Interzone 12", location: "Interzone", total: 5 },
  { id: 13, title: "Interzone 13", location: "Interzone", total: 5 },
  { id: 14, title: "Interzone 14", location: "Interzone", total: 5 },
  { id: 15, title: "Interzone 15", location: "Interzone", total: 5 },
  { id: 16, title: "Interzone 16", location: "Interzone", total: 5 },
  { id: 17, title: "Interzone 17", location: "Interzone", total: 5 },
  { id: 18, title: "Interzone 18", location: "Interzone", total: 5 },
  { id: 19, title: "Interzone 19", location: "Interzone", total: 5 },
  { id: 20, title: "Interzone 20", location: "Interzone", total: 5 },
];

export default function ReservationPage() {
  // ------ state สำหรับ modal ยืนยัน ------
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [spot, setSpot] = React.useState("");
  const [time, setTime] = React.useState("");
  const dateStr = new Date().toLocaleDateString("en-GB");

  // รับ event จากการ์ด
  const handleSelectTime = ({ spot, time }: { spot: string; time: string }) => {
    setSpot(spot);
    setTime(time);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpen(false);
    router.push('/successful?spot=' + encodeURIComponent(spot) + '&date=' + encodeURIComponent(dateStr) + '&time=' + encodeURIComponent(time));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* กล่องขาวความกว้างเท่าเดิม */}
      <div className="mx-auto max-w-md bg-white min-h-screen">
        {/* header เดิม */}
        <Header studentId="6709616376" />

        <main className="p-4">
          <ReservationHeader />

          {/* ส่วนหัว “Badminton / Interzone” (สไตล์เดิม) */}
          <div className="text-2xl font-nunito font-bold text-center mb-4">
            <h2 className="text-2xl font-bold text-center mb-4">Badminton</h2>
            <p className="text-2xl font-bold text-center mb-4">Interzone</p>
          </div>

          {/* แสดงการ์ดแบบ list แนวตั้งระยะห่างเดิม */}
          <div className="space-y-4">
            {reservations.map((item) => (
              <RsvInterzoneCard
                key={item.id}
                title={item.title}
                // ส่ง callback ไปยังการ์ด
                onSelectTime={handleSelectTime}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Modal ยืนยันการจอง */}
      <ConfirmModal
        open={open}
        spot={spot}
        date={dateStr}
        time={time}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}