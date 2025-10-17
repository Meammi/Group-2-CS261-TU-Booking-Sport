'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import BookingCard from '@/components/BookingCard';
import { InboxIcon } from '@heroicons/react/24/solid';
import { mockBookings } from '@/lib/data'; 

export default function MyBookingPage() {
  const [bookings, setBookings] = useState(mockBookings);

  const currentBookings = bookings.filter(b => b.status === 'current');
  const historyBookings = bookings.filter(b => b.status === 'history');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-md bg-gray-100 min-h-screen">
        <Header studentId="6709616376" />
        <main className="p-4 font-nunito">
          
          <div className="flex flex-col items-center gap-2 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Booking</h1>
          </div>

          {/* Current Bookings Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 border-t-2 border-gray-300"></div>
               <h2 className="bg-gray-100 text-lg font-bold text-tu-navy px-2">Current</h2>
               <div className="flex-grow border-t-2 border-gray-300"></div>
            </div>
            <div className="space-y-4">
              {currentBookings.length > 0 ? (
                currentBookings.map(item => (
                  <BookingCard
                    key={item.id}
                    id={item.id}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    location={item.location}
                    date={item.date}
                    time={item.time}
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

          {/* History Bookings Section */}
          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 border-t-2 border-gray-300"></div>
               <h2 className="bg-gray-100 text-lg font-bold text-tu-navy px-2">History</h2>
               <div className="flex-grow border-t-2 border-gray-300"></div>
            </div>
            <div className="space-y-4">
              {historyBookings.length > 0 ? (
                historyBookings.map(item => (
                  <BookingCard
                    key={item.id}
                    id={item.id}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    location={item.location}
                    date={item.date}
                    time={item.time}
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
  );
}

