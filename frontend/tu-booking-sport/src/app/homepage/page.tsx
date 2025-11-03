'use client';

import { useState, useEffect } from 'react';
import SportCard from "@/components/SportCard";
import Header from "@/components/Header";
import AnnouncementCard from "@/components/AnnouncementCard";
import CoverFlowCarousel from "@/components/Carousel";
import AuthGuard from '@/components/AuthGuard';
import FavoriteCard from '@/components/FavoriteCard';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import axios from '@/lib/axios';

interface BackendSport {
  type: string;
  locationName: string;
}

interface Sport {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
}

interface Favorite {
  id: number;
  name: string;
  imageUrl: string;
  title: string;
  location: string;
  date: string;
  time: string;
}

const getImageForSport = (type: string, locationName: string): string => {
  const normalizedType = type.toLowerCase();
  const normalizedLocation = locationName.toLowerCase();

  if (normalizedType.includes('badminton') && normalizedLocation.includes('gym 4')) {
    return '/images/gym4.jpg';
  }
  if (normalizedType.includes('badminton')) return '/images/interzone.jpg';
  if (normalizedType.includes('karaoke')) return '/images/karaoke.jpg';
  if (normalizedType.includes('music')) return '/images/musicroom.jpg';

  return 'https://placehold.co/400x300/cccccc/FFFFFF?text=Sport';
};

const announcementImages = [
  { id: 1, imageUrl: "/images/karaoke.jpg", alt: "Announcement 1" },
  { id: 2, imageUrl: "/images/announce1.jpg", alt: "Announcement 2" },
  { id: 3, imageUrl: "/images/announce2.jpg", alt: "Announcement 3" },
];

const userStudentId = "6709616376";

export default function HomePage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ ฟังก์ชันโหลดข้อมูล Favorites
  async function fetchFavorites() {
    try {
      let favData: any[] = [];

      // ดึงข้อมูล favorites ของ user จาก backend
      try {
        const favResp = await axios.get("/favorite/me", {
          withCredentials: true, // ต้องมี cookie ถึงจะเข้าถึง user ได้
        });
        favData = favResp.data;
      } catch (err: any) {
        console.error('Error fetching /favorite/me:', err.response?.data || err.message);
      }

      // ✅ ตรวจสอบ slot แต่ละ favorite (ย้ายเข้ามาในนี้)
      const validatedFavorites: Favorite[] = [];

      await Promise.all(
        favData.map(async (fav: any) => {
          try {
            const roomId = fav.roomId || fav.room_id;
            const slotIdFromFav = fav.slotId || fav.slot_id;
            const startTime = fav.startTime || fav.start_time || fav.time || '';
            const normalizedTime = startTime.length >= 5 ? startTime.substring(0, 5) : startTime;

            if (!roomId || !normalizedTime) return;

            const lookupResp = await axios.get(`http://localhost:8081/api/slot/lookup`, {
              params: { roomId, time: normalizedTime },
              withCredentials: true,
            });

            const slotIdFromLookup = lookupResp.data.slotId || lookupResp.data.slot_id;

            if (slotIdFromLookup === slotIdFromFav) {
              validatedFavorites.push({
                id: fav.favoriteId || fav.favorite_id,
                name: fav.type || fav.sport_type || fav.name || 'Sport',
                imageUrl: fav.image_url || '/images/placeholder.jpg',
                title: fav.room_name || fav.roomName || 'Room',
                location: fav.locationName || fav.location || 'Location',
                date: startTime.includes('T') ? startTime.split('T')[0] : (fav.date || ''),
                time: normalizedTime,
              });
            }
          } catch (err) {
            console.error('Error validating favorite:', err, fav);
          }
        })
      );

      return validatedFavorites; // ✅ คืนค่า favorites ที่ตรวจสอบแล้ว
    } catch (err) {
      console.error('Unexpected error in fetchFavorites:', err);
      return [];
    }
  }

  // ✅ โหลดข้อมูลทั้งหมด
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // โหลด sports
        const sportsResp = await fetch('http://localhost:8081/homepage');
        if (!sportsResp.ok) throw new Error('Failed to fetch sports data');
        const backendData: BackendSport[] = await sportsResp.json();

        const sortedData = backendData.sort((a, b) => {
          const aBad = a.type.toLowerCase().includes('badminton');
          const bBad = b.type.toLowerCase().includes('badminton');
          if (aBad && !bBad) return -1;
          if (!aBad && bBad) return 1;
          return 0;
        });

        const transformedData: Sport[] = sortedData.map((item, index) => ({
          id: index,
          title: item.type,
          subtitle: item.locationName,
          imageUrl: getImageForSport(item.type, item.locationName),
          href: `/reservations/${encodeURIComponent(item.type)}/${encodeURIComponent(item.locationName)}`,
        }));
        setSports(transformedData);

        // โหลด favorites
        await fetchFavorites();
      } catch (err: any) {
        setError(err.message || 'Unexpected error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ✅ Loading / Error state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ArrowPathIcon className="h-12 w-12 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Loading sports...</p>
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

  // ✅ UI หลัก
  return (
    <AuthGuard>
      <div className="max-w-md mx-auto bg-gray-100 min-h-screen font-nunito">
        <Header studentId={userStudentId} />
        <main className="p-4">
          <header className="text-center my-4 text-tu-navy">
            <h1 className="text-lg font-bold">Welcome to TU Booking Sports</h1>
            <p className="text-sm text-gray-500">Book your sport!!!</p>
          </header>

          <div className="my-4 bg-white p-2 border rounded-md text-center text-gray-400">
            Search Bar Placeholder
          </div>

          <section className="my-8">
            <div className="mb-4 flex justify-center">
              <CoverFlowCarousel items={announcementImages} />
            </div>
            <div className="space-y-4">
              <AnnouncementCard type="success" title="ยินดีต้อนรับ #TU91">
                <p>
                  นักศึกษารหัส 68 สามารถใช้งานระบบ โดยใช้ User: รหัสประจำตัวนักศึกษา 10 หลัก และ Password: เบอร์โทรศัพท์ 10 หลัก
                  (เบอร์โทรศัพท์ที่นักศึกษาให้ข้อมูลไว้กับสำนักงานทะเบียนนักศึกษา)
                </p>
              </AnnouncementCard>
              <AnnouncementCard type="alert" title="ปิดใช้บริการสนาม">
                <p>
                  สนามสควอช และสนามแบดมินตัน อินเตอร์โซน จะปิดให้บริการ ทุกวันเสาร์ ของเดือน
                </p>
              </AnnouncementCard>
            </div>
          </section>

          <section className="my-8">
            <h2 className="text-xl text-tu-navy font-bold text-center mb-4">Sports</h2>
            <div className="grid grid-cols-2 gap-4">
              {sports.map((sport) => (
                <SportCard
                  key={sport.id}
                  title={sport.title}
                  subtitle={sport.subtitle}
                  imageUrl={sport.imageUrl}
                  href={sport.href}
                />
              ))}
            </div>
          </section>

          <section className="my-8">
            <h2 className="text-xl text-tu-navy font-bold text-center mb-4">Your Favorite</h2>
            {favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.map((fav) => (
                  <FavoriteCard
                    key={fav.id}
                    name={fav.name}
                    id={fav.id}
                    imageUrl={fav.imageUrl}
                    title={fav.title}
                    location={fav.location}
                    date={fav.date}
                    time={fav.time}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">No favorites yet.</p>
            )}
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
