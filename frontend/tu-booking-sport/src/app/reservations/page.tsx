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
  // เพิ่ม field อื่นๆ ที่อาจจะจำเป็นในอนาคต
}

// กำหนด "หน้าตา" ข้อมูลที่จัดกลุ่มแล้วสำหรับแสดงผล
interface ReservationCategory {
  id: string; // สร้าง ID ที่ไม่ซ้ำกันจาก type และ location
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
  // 2. เตรียม State ให้พร้อมสำหรับทุกสถานการณ์
  const [reservations, setReservations] = useState<ReservationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessRooms = async () => {
      try {
        const response = await fetch(API_BASE + '/rooms');
        if (!response.ok) {
          throw new Error('Failed to fetch room data');
        }
        const backendData: BackendRoom[] = await response.json();

        // --- 3. ประมวลผลและจัดกลุ่มข้อมูล ---
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
          acc[key].total += 1; // นับจำนวนคอร์ท
          return acc;
        }, {} as Record<string, ReservationCategory>);

        // แปลง Object กลับเป็น Array เพื่อนำไปแสดงผล
        const processedReservations = Object.values(groupedData);
        
        setReservations(processedReservations);
        // ---------------------------------

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessRooms();
  }, []);

  // --- UI สำหรับ Loading และ Error ---
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
        <Header studentId="6709616376" />
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






