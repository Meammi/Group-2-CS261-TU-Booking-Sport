"use client";
export const dynamic = "force-dynamic";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";

// แยก component ที่ใช้ useSearchParams ออกมา
function SuccessfulContent() {
  const router = useRouter();
  const q = useSearchParams();

  // รับค่าจาก query string ถ้ามี (จะโชว์บนหน้า)
  const spot = q.get("spot") ?? "Interzone 01";
  const date = q.get("date") ?? new Date().toLocaleDateString("en-GB");
  const time = q.get("time") ?? "20:00";
  const code = q.get("code") ?? "7POJKQN4";

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* กรอบขาวกลางจอ ขนาดเดียวกับหน้า rsvinterzone */}
      <div className="mx-auto max-w-md bg-white min-h-screen">
        {/* header เดิม */}
        <Header studentId="6709616376" />
        <main className="p-4">
          <h2 className="text-2xl font-bold text-center mb-6">
            Booking Successful
          </h2>
          {/* กล่อง QR + โค้ด */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-44 h-44 rounded-md bg-gray-100 flex items-center justify-center">
              <span className="text-4xl font-semibold text-gray-400">QR</span>
            </div>
            <p className="tracking-widest font-semibold">{code}</p>
          </div>
          {/* เส้นคั่น + รายละเอียด */}
          <h3 className="text-center font-semibold mb-4">Detail</h3>
          <div className="text-center flex items-center justify-center mt-6 border-t border-dashed pt-4">
            {/* ตารางสองคอลัมน์เหมือนในภาพ */}
            <dl className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
              <dt className="text-gray-500">Spot</dt>
              <dd>: {spot}</dd>
              <dt className="text-gray-500">Date</dt>
              <dd>: {date}</dd>
              <dt className="text-gray-500">Time</dt>
              <dd>: {time}</dd>
              <dt className="text-gray-500">Location</dt>
              <dd>: Interzone</dd>
              <dt className="text-gray-500">Success</dt>
              <dd>: 00:01:32</dd>
            </dl>
          </div>
          {/* ปุ่ม Cancel กลางจอ */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.push("/rsvinterzone")}
              className="bg-red-500 text-white px-6 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// Component หลักที่ wrap ด้วย Suspense
export default function BookingSuccessful() {
  return (
    <Suspense
      fallback={
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessfulContent />
    </Suspense>
  );
}
