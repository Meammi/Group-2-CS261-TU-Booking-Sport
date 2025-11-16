'use client';
import { API_BASE } from '@/lib/config'

import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import ReservationCard from "@/components/ReservationCard";
import ReservationHeader from "@/components/ReservationHeader";
import AuthGuard from '@/components/AuthGuard';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

// 1. กำหนด "หน้าตา" ข้อมูลดิบที่ได้รับจาก Back-end
interface BackendRoom {
  type: string;
  loc_name: string;
}

// กำหนด "หน้าตา" ข้อมูลที่จัดกลุ่มแล้วสำหรับแสดงผล
interface ReservationCategory {
  id: string; 
  title: string;
  location: string;
  total: number;
  imageUrl: string;
  href: string;
}

// "ฟังก์ชันผู้ช่วย" สำหรับจัดการรูปภาพ
const getImageUrl = (type: string, location: string): string => {
  const normalizedType = type.toLowerCase();
  const normalizedLocation = location.toLowerCase();
  if (normalizedType.includes('badminton') && normalizedLocation.includes('gym 4')) return "/images/gym4.jpg";
  if (normalizedType.includes('badminton')) return "/images/interzone.jpg";
  if (normalizedType.includes('karaoke')) return "/images/karaoke.jpg";
  if (normalizedType.includes('music')) return "/images/musicroom.jpg";
  return 'https://placehold.co/400x300/cccccc/FFFFFF?text=Sport';
}

export default function ReservationPage() {
  const [username, setUsername] = useState("");
  const [reservations, setReservations] = useState<ReservationCategory[]>([]);
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
        const me: { username: string } = await meRes.json();
        setUsername(me.username || "");

        // ===== Fetch reservations =====
        const response = await fetch(API_BASE + '/rooms');
        if (!response.ok) throw new Error('Failed to fetch room data');
        const backendData: BackendRoom[] = await response.json();

        // --- จัดกลุ่มข้อมูล ---
        const groupedData = backendData.reduce((acc, room) => {
          const key = `${room.type}|${room.loc_name}`;
          if (!acc[key]) {
            acc[key] = { 
              id: key,
              title: room.type,
              location: room.loc_name,
              total: 0,
              imageUrl: getImageUrl(room.type, room.loc_name),
              href: `/reservations/${encodeURIComponent(room.type)}/${encodeURIComponent(room.loc_name)}`
            };
          }
          acc[key].total += 1;
          return acc;
        }, {} as Record<string, ReservationCategory>);

        setReservations(Object.values(groupedData));

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
        <p className="mt-4 text-gray-600">Loading reservations...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <AuthGuard>
      <div className="bg-white min-h-screen">
        <div className="mx-auto max-w-md bg-gray-100 min-h-screen">
          {/* ส่ง username ที่ fetch มาให้ Header */}
          <Header studentId={username} />
          <main className="p-4">
            <ReservationHeader />
            <div className="space-y-4">
              {reservations.map((item) => (
                <ReservationCard 
                  key={item.id}
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
    </AuthGuard>
  );
}
