import { API_BASE } from '@/lib/config'
'use client'; 

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPinIcon, ArrowRightIcon, TagIcon } from '@heroicons/react/24/solid';
import { renderToString } from 'react-dom/server';

// ✅ แก้ปัญหา icon marker ของ Leaflet
const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const heroIcon = L.divIcon({
  html: renderToString(<MapPinIcon className="h-10 w-10 text-red-600" />),
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const userIcon = L.divIcon({
  html: renderToString(<TagIcon className="h-8 w-8 text-blue-600" />),
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// ✅ Dynamic import (ใช้เฉพาะ client)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

interface BookingActionsProps {
  bookingId: number;
  status: string;
  isCurrent: boolean;
  locationName: string;
}



export default function BookingActions({ bookingId, status, isCurrent, locationName }: BookingActionsProps) {
  const [modalState, setModalState] = useState<'closed' | 'confirm' | 'success' | 'error'>('closed');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ พิกัดปลายทาง (จาก backend)
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // ✅ พิกัดผู้ใช้
  const [userPos, setUserPos] = useState<{ latitude: number; longitude: number } | null>(null);

  // ✅ เส้นทาง (polyline)
  const [route, setRoute] = useState<[number, number][]>([]);

  // ✅ ดึงพิกัดสถานที่จาก API เมื่อเปิดแผนที่
  useEffect(() => {
    if (!isMapOpen) return;

    const fetchLocation = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:8081/location/${locationName}`);
        if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลตำแหน่งได้');

        const data = await res.json();
        setCoords({ latitude: data.latitude, longitude: data.longitude });
      } catch (err: any) {
        console.error(err);
        setErrorMessage('เกิดข้อผิดพลาดในการดึงข้อมูลพิกัด');
      } finally {
        setIsLoading(false);
      }
    };

      // 1) Resolve userId from /auth/me
      const meRes = await fetch(API_BASE + '/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!meRes.ok) {
        throw new Error(`Failed to fetch user info: ${meRes.status}`);
      }
      const me: { id: string } = await meRes.json();

      // 2) Get user's current bookings to find the matching reservationId by index (bookingId)
      const bookingsRes = await fetch(`${API_BASE}/MyBookings/${me.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!bookingsRes.ok) {
        throw new Error(`Failed to fetch bookings: ${bookingsRes.status}`);
      }
      const data: { current: Array<{ reservationId: string }>; history: Array<{ reservationId: string }> } = await bookingsRes.json();

      // Only allow cancel on current bookings; bookingId here is the index from the current list
      const target = isCurrent ? data.current[bookingId] : undefined;
      if (!target?.reservationId) {
        throw new Error('Could not resolve reservationId for this card.');
      }
      const reservationIdToCancel = target.reservationId;
      
      const response = await fetch(`${API_BASE}/MyBookings/cancel/${reservationIdToCancel}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Server responded with status ${response.status}`);
      }

      setModalState('success');

      setTimeout(() => {
        router.push('/mybooking');
        router.refresh();
      }, 2000); 

    } catch (err: any) {
      console.error("Cancellation API call failed:", err);
      if (err.message.includes('Failed to fetch')) {
        setErrorMessage('Cannot connect to the server. Please check if the backend is running and verify CORS configuration for DELETE method.');
      } else {
        setErrorMessage(err.message);
      }
      setModalState('error');
    } finally {
      setIsCancelling(false);
    fetchLocation();
  }, [isMapOpen, locationName]);

  // ✅ Get user location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
        alert('ไม่สามารถเข้าถึงตำแหน่งได้ กรุณาอนุญาต Location');
      }
    );
  };

  // ✅ วาดเส้นทาง (line จาก user → destination)
  const handleNavigate = () => {
    if (!userPos || !coords) {
      alert('กรุณากด "Get Location" ก่อน');
      return;
    }
    setRoute([
      [userPos.latitude, userPos.longitude],
      [coords.latitude, coords.longitude],
    ]);
  };

  return (
    <>
      {/* ปุ่ม Cancel + MAP */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => setModalState('confirm')}
          className="rounded-md bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
          disabled={!isCurrent}
        >
          Cancel
        </button>

        <button
          onClick={() => setIsMapOpen(true)}
          className="flex items-center justify-center gap-2 rounded-md bg-green-600 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          <MapPinIcon className="h-4 w-4" />
          <span>MAP</span>
        </button>
      </div>

      {/* ✅ Modal Map */}
      {isMapOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-[95%] max-w-lg h-[85vh] bg-white rounded-2xl overflow-hidden shadow-lg">
            <button
              onClick={() => setIsMapOpen(false)}
              className="absolute top-3 right-3 z-[1000] bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition"
            >
              ✕
            </button>

            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-600">กำลังโหลดแผนที่...</div>
            ) : coords ? (
              <div className="relative h-full w-full">
                <MapContainer center={[coords.latitude, coords.longitude]} zoom={16} className="h-full w-full z-0">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* จุดหมาย */}
                  <Marker position={[coords.latitude, coords.longitude]} icon={heroIcon}>
                    <Popup>{locationName}</Popup>
                  </Marker>

                  {/* จุดผู้ใช้ */}
                  {userPos && (
                    <Marker position={[userPos.latitude, userPos.longitude]} icon={userIcon}>
                      <Popup>คุณอยู่ที่นี่</Popup>
                    </Marker>
                  )}

                  {/* เส้นทาง */}
                  {route.length > 0 && <Polyline positions={route} color="blue" />}
                </MapContainer>

                {/* ปุ่มควบคุมด้านบน */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-[999]">
                  <button
                    onClick={handleGetLocation}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    <TagIcon className="w-4 h-4" />
                    Get Location
                  </button>

                  <button
                    onClick={handleNavigate}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                    Navigate
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-red-600">
                {errorMessage || 'ไม่พบข้อมูลพิกัด'}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
