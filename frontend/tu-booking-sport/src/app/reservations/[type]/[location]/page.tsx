'use client'; // 1. ทำให้หน้านี้เป็น Client Component ทั้งหมด

import { useState, useEffect } from 'react'; // 2. Import hooks ที่จำเป็น
import Header from "@/components/Header";
import CourtCard from "@/components/CourtCard";
import Link from "next/link";
import ReservationHeader from "@/components/ReservationHeader";
import AuthGuard from '@/components/AuthGuard';

import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

interface Court {
  name: string;
  type: string;
  capacity: number;
  price: number;
  room_id: string;
  loc_name: string;
  slot_time: { [time: string]: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' };
}

// 3. Component จะยังคงรับ params จาก URL เหมือนเดิม
export default function ReservationDetailPage({ params }: { params: { type: string, location: string } }) {
  const type = decodeURIComponent(params.type);
  const location = decodeURIComponent(params.location);

  // 4. สร้าง State สำหรับเก็บข้อมูล, สถานะ Loading, และ Error
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. ใช้ useEffect เพื่อดึงและคัดกรองข้อมูลที่ฝั่ง Client
  useEffect(() => {
    const fetchAndFilterCourts = async () => {
      try {
        const response = await fetch(`http://localhost:8081/rooms`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }
        const allCourts: Court[] = await response.json();
        
        // คัดกรองข้อมูลที่นี่
        const filtered = allCourts.filter(
          (court) => court.type === type && court.loc_name === location
        );
        
        setCourts(filtered); // อัปเดต State ด้วยข้อมูลที่คัดกรองแล้ว
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterCourts();
  }, [type, location]); // ให้ Effect นี้ทำงานใหม่เมื่อ type หรือ location เปลี่ยนไป

  // --- UI สำหรับสถานะ Loading และ Error ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ArrowPathIcon className="h-12 w-12 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Loading courts for {location}...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
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
                <CourtCard key={court.room_id} court={court} />
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

