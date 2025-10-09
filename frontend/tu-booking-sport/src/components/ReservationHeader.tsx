'use client'; 

import { useState, useEffect } from 'react';

export default function ReservationHeader() {
  const [currentDate, setCurrentDate] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    setCurrentDate(formattedDate);

    
    const timer = setInterval(() => {
      const now = new Date();
      
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

     
      const diffInSeconds = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
      
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;
      
      
      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

   
    return () => clearInterval(timer);
  }, []); 

  return (
    <div className="my-6 text-center">
      <h1 className="font-mali text-4xl font-bold text-gray-800">Reservation</h1>
      <p className="mt-2 text-lg text-gray-600">{currentDate}</p>
      
      <div className="mt-4 inline-block rounded-md bg-black px-3 py-1 text-white">
        <p className="font-mono text-2xl tracking-widest">{timeLeft}</p>
      </div>
      <p className="mt-1 text-xs text-gray-500">Countdown</p>
    </div>
  );
}
