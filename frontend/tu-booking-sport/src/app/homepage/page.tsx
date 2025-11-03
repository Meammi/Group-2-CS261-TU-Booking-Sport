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
  roomId: string;
  slotId: string;
  type: string;
  name: string;
  locationName: string;
  startTime: string;
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

  async function fetchFavorites() {
    try {
      const favResp = await axios.get("/favorite/me", { withCredentials: true });
      const favData = favResp.data;

      const validatedFavorites: Favorite[] = [];

      await Promise.all(
        favData.map(async (fav: any) => {
          try {
            const roomId = fav.roomId || fav.room_id;
            const slotId = fav.slotId || fav.slot_id;
            const type = fav.type;
            const name = fav.name;
            const locationName = fav.locationName || fav.loc_name;
            const startTime = fav.startTime || fav.start_time || '';

            if (roomId && slotId) {
              validatedFavorites.push({
                roomId,
                slotId,
                type,
                name,
                locationName,
                startTime,
              });
            }
          } catch (err) {
            console.error("Error validating favorite:", err);
          }
        })
      );

      setFavorites(validatedFavorites);
    } catch (err: any) {
      console.error("Error fetching favorites:", err.response?.data || err.message);
      setFavorites([]);
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const sportsResp = await fetch("http://localhost:8081/homepage");
        if (!sportsResp.ok) throw new Error("Failed to fetch sports data");
        const backendData: BackendSport[] = await sportsResp.json();

        const sortedData = backendData.sort((a, b) => {
          const aBad = a.type.toLowerCase().includes("badminton");
          const bBad = b.type.toLowerCase().includes("badminton");
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

        await fetchFavorites();
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

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
                </p>
              </AnnouncementCard>
              <AnnouncementCard type="alert" title="ปิดใช้บริการสนาม">
                <p>สนามสควอช และสนามแบดมินตัน อินเตอร์โซน จะปิดให้บริการทุกวันเสาร์</p>
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
                    key={fav.slotId}
                    roomId={fav.roomId}
                    slotId={fav.slotId}
                    type={fav.type}
                    name={fav.name}
                    locationName={fav.locationName}
                    startTime={fav.startTime}
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
