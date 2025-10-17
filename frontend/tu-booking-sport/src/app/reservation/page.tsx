'use client'; 

import { useState } from 'react';
import Header from "@/components/Header";
import ReservationCard from "@/components/ReservationCard";
import ReservationHeader from "@/components/ReservationHeader";

const initialReservations = [
  { id: 1, title: "Badminton", location: "Interzone", total: 20, imageUrl:"/images/interzone.jpg " ,href: "/rsvinterzone"},
  { id: 2, title: "Badminton", location: "Gym 4", total: 13, imageUrl:"/images/gym4.jpg" ,href: "/rsvinterzone"},
  { id: 3, title: "Karaoke", location: "Melody Sphere", total: 5, imageUrl:"/images/karaoke.jpg",href: "/rsvinterzone" },
  { id: 4, title: "Music Room", location: "Melody Sphere", total: 2, imageUrl:"/images/musicroom.jpg",href: "/rsvinterzone" },
];

export default function ReservationPage() {
  const [reservations, setReservations] = useState(initialReservations);

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-md bg-gray-100 min-h-screen">
        <Header studentId="6709616376" />
        <main className="p-4">
          <ReservationHeader />
          <div className="space-y-4">
            {reservations.map((item) => (
              <ReservationCard 
                key={item.id}
                id={item.id} 
                title={item.title}
                location={item.location}
                total={item.total}
                imageUrl={item.imageUrl}
                href={item.href}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

