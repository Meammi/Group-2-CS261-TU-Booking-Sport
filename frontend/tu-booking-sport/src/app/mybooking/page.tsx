'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BookingCard from '@/components/BookingCard';
import AuthGuard from '@/components/AuthGuard';
import { InboxIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

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
}

const getImageForLocation = (locationName: string, roomName?: string): string => {
  const normalizedLocation = locationName.toLowerCase().trim();
  if (normalizedLocation === 'melodysphere') {
    const rn = (roomName || '').toLowerCase();
    if (rn.includes('full')) return '/images/musicroom.jpg';
    if (rn.includes('karaoke')) return '/images/karaoke.jpg';
    return '/images/karaoke.jpg';
  }
  switch (normalizedLocation) {
    case 'gym 4': return '/images/gym4.jpg';
    case 'karaoke': return '/images/karaoke.jpg';
    case 'interzone': return '/images/interzone.jpg';
    default: return 'https://placehold.co/100x100/cccccc/FFFFFF?text=Image';
  }
};

export default function MyBookingPage() {
  const [username, setUsername] = useState("");
  const [currentBookings, setCurrentBookings] = useState<BookingItem[]>([]);
  const [historyBookings, setHistoryBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // ===== Fetch user info =====
        const meRes = await fetch('http://localhost:8081/auth/me', { credentials: 'include' });
        if (!meRes.ok) throw new Error(`Failed to fetch user info: ${meRes.status}`);
        const me: { username: string; id: string } = await meRes.json();
        setUsername(me.username || "");

        // ===== Fetch bookings =====
        const res = await fetch(`http://localhost:8081/MyBookings/${me.id}`, { credentials: 'include' });
        if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`);
        const data: { current: Omit<BookingItem, 'id'>[]; history: Omit<BookingItem, 'id'>[] } = await res.json();

        const processedCurrent = data.current.map((item, index) => ({ ...item, id: index }));
        const processedHistory = data.history.map((item, index) => ({ ...item, id: data.current.length + index }));

        setCurrentBookings(processedCurrent);
        setHistoryBookings(processedHistory);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unexpected error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ArrowPathIcon className="h-12 w-12 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-md bg-gray-100 min-h-screen">
          {/* ส่ง username ที่ fetch มาให้ Header */}
          <Header studentId={username} />

          <main className="p-4 font-nunito">
            <div className="flex flex-col items-center gap-2 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">My Booking</h1>
            </div>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 border-t-2 border-gray-300"></div>
                <h2 className="bg-gray-100 text-lg font-bold text-tu-navy px-2">Current</h2>
                <div className="flex-grow border-t-2 border-gray-300"></div>
              </div>
              <div className="space-y-4">
                {currentBookings.length > 0 ? (
                  currentBookings.map((item) => (
                    <BookingCard
                      key={item.id}
                      id={item.id}
                      imageUrl={getImageForLocation(item.locationName, item.name)}
                      title={item.name}
                      location={item.locationName}
                      date={item.bookingDate}
                      time={`${item.startTime.substring(0, 5)} - ${item.endTime.substring(0, 5)}`}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-8 text-gray-500">
                    <InboxIcon className="h-16 w-16 text-gray-400 mb-2" />
                    <p className="text-sm">No current bookings.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 border-t-2 border-gray-300"></div>
                <h2 className="bg-gray-100 text-lg font-bold text-tu-navy px-2">History</h2>
                <div className="flex-grow border-t-2 border-gray-300"></div>
              </div>
              <div className="space-y-4">
                {historyBookings.length > 0 ? (
                  historyBookings.map((item) => (
                    <BookingCard
                      key={item.id}
                      id={item.id}
                      imageUrl={getImageForLocation(item.locationName, item.name)}
                      title={item.name}
                      location={item.locationName}
                      date={item.bookingDate}
                      time={`${item.startTime.substring(0, 5)} - ${item.endTime.substring(0, 5)}`}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-8 text-gray-500">
                    <InboxIcon className="h-16 w-16 text-gray-400 mb-2" />
                    <p className="text-sm">No booking history.</p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
