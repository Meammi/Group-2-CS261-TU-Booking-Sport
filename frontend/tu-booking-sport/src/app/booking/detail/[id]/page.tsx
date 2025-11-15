"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, MapPinIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import BookingActions from "@/components/BookingActions";

interface BookingItem {
  id: number;
  name: string;
  locationName: string;
  isCurrent: boolean;
  status: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  imageUrl?: string;
  qrCodeId: string;
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndFindBooking = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (!token) {
          throw new Error("Please login to view your bookings.");
        }

        const meRes = await fetch("http://localhost:8081/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!meRes.ok) {
          throw new Error(`Failed to fetch user info: ${meRes.status}`);
        }
        const me: { id: string } = await meRes.json();
        const userId = me.id;

        const response = await fetch(`http://localhost:8081/MyBookings/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user bookings: ${response.status}`);
        }

        const data: { current: Omit<BookingItem, "id">[]; history: Omit<BookingItem, "id">[] } = await response.json();

        const allBookings = [
          ...data.current.map((item, index) => ({ ...item, id: index })),
          ...data.history.map((item, index) => ({ ...item, id: data.current.length + index })),
        ];

        const bookingIdFromUrl = parseInt(params.id, 10);
        const foundBooking = allBookings.find((b) => b.id === bookingIdFromUrl);

        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          throw new Error(`Booking with ID ${params.id} not found for this user.`);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFindBooking();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ArrowPathIcon className="h-12 w-12 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="text-gray-500 text-center px-4">{error || `Booking with ID ${params.id} could not be loaded.`}</p>
        <Link href="/mybooking" className="mt-4 text-blue-600 hover:underline">
          Go back to My Bookings
        </Link>
      </div>
    );
  }

  const formattedTime = booking.startTime && booking.endTime ? `${booking.startTime.substring(0, 5)} - ${booking.endTime.substring(0, 5)}` : "N/A";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-md bg-white min-h-screen">
        <header className="relative flex items-center justify-center p-4 border-b">
          <Link href="/mybooking" className="absolute left-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold">Detail</h1>
        </header>
        <main className="p-6 font-nunito">
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-md">
            <div className="mx-auto h-36 w-36 bg-gray-100 p-2 border rounded-md flex items-center justify-center">
              <p className="text-xs text-gray-400">QR Code Placeholder</p>
            </div>
            <p className="mt-2 font-mono text-lg tracking-widest">{booking.qrCodeId}</p>
            <div className="mt-6 text-left space-y-2 border-t pt-4">
              <h2 className="text-2xl font-bold text-tu-navy">{booking.name}</h2>
              <p className="text-sm text-gray-600">
                <strong>Location:</strong> {booking.locationName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Date:</strong> {booking.bookingDate}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Time:</strong> {formattedTime}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong>
                </p>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.isCurrent ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
            <BookingActions bookingId={booking.id!} status={booking.status} isCurrent={booking.isCurrent} locationName={booking.locationName} />
          </div>
        </main>
      </div>
    </div>
  );
}
