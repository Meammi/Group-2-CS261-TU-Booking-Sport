"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CourtCard from "@/components/CourtCard";
import ReservationHeader from "@/components/ReservationHeader";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

interface Court {
  name: string;
  type: string;
  capacity: number;
  price: number;
  room_id: string;
  loc_name: string;
  slot_time: { [time: string]: "AVAILABLE" | "BOOKED" | "MAINTENANCE" };
}

const lockPastSlots = (courts: Court[], selectedDate: string): Court[] => {
  const today = new Date();
  const selected = new Date(`${selectedDate}T00:00:00`);
  if (Number.isNaN(selected.getTime())) return courts;
  const isToday = selected.toDateString() === today.toDateString();
  if (!isToday) return courts;

  const currentMinutes = today.getHours() * 60 + today.getMinutes();

  return courts.map((court) => {
    const updatedSlots: Court["slot_time"] = {};
    Object.entries(court.slot_time).forEach(([time, status]) => {
      let nextStatus = status;
      if (status === "AVAILABLE") {
        const [hourStr = "0", minuteStr = "0"] = time.split(":");
        const slotMinutes = parseInt(hourStr, 10) * 60 + parseInt(minuteStr, 10);
        if (!Number.isNaN(slotMinutes) && slotMinutes < currentMinutes) {
          nextStatus = "BOOKED";
        }
      }
      updatedSlots[time] = nextStatus;
    });
    return { ...court, slot_time: updatedSlots };
  });
};

export default function ReservationDetailPage({ params }: { params: { type: string; location: string } }) {
  const type = decodeURIComponent(params.type);
  const location = decodeURIComponent(params.location);

  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split("T")[0]);

  const fetchAndFilterCourts = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch("http://localhost:8081/rooms", { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }
      const allCourts: Court[] = await response.json();
      const filtered = allCourts.filter((court) => court.type === type && court.loc_name === location);
      setCourts(lockPastSlots(filtered, selectedDate));
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setError("Request timed out, please try again");
      } else if (typeof err?.message === "string" && err.message.startsWith("HTTP_")) {
        const status = Number(err.message.replace("HTTP_", ""));
        setErrorCode(status);
        if (status === 404) setError("Data not found (404)");
        else if (status >= 500) setError("Server error, please try later");
        else setError(`Request failed (${status})`);
      } else {
        setError("Network or unknown error");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndFilterCourts();
  }, [type, location, selectedDate]);

  const handleSlotSelected = (_court: Court, _time: string) => {
    fetchAndFilterCourts();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ArrowPathIcon className="h-12 w-12 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Loading courts for {location}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
        {errorCode && <p className="text-gray-500 mt-1">Code: {errorCode}</p>}
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
            fetchAndFilterCourts();
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
        >
          <ArrowPathIcon className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-md bg-gray-100 min-h-screen">
          <Header studentId="6709616376" />
          <ReservationHeader />

          <main className="p-4 font-nunito">
            <header className="relative flex items-center justify-center mb-6">
              <Link href="/reservations" className="bg-gray-200 absolute left-0 p-2 rounded-full hover:bg-gray-300">
                <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
              </Link>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-tu-navy">{type}</h1>
                <p className="text-md text-gray-600">{location}</p>
              </div>
            </header>

            {courts.length > 0 ? (
              <div className="space-y-4">
                {courts.map((court) => (
                  <CourtCard
                    key={court.room_id}
                    court={court}
                    onSlotSelected={handleSlotSelected}
                    selectedDate={selectedDate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No courts available for this selection.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}