'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPinIcon, PaperAirplaneIcon, CursorArrowRaysIcon } from '@heroicons/react/24/solid';
import { renderToString } from 'react-dom/server';

// ✅ Default marker icon
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

// ✅ dynamic import for client only
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
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [route, setRoute] = useState<[number, number][] | null>(null); // ✅ เส้นทางที่ได้จาก API
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const OPENROUTE_API_KEY = 'YOUR_API_KEY_HERE'; // 👈 ใส่ key ที่สมัครมาจาก openrouteservice

  // ✅ ดึงพิกัดปลายทางจาก backend
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
        setErrorMessage('เกิดข้อผิดพลาดในการดึงข้อมูลพิกัด');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocation();
  }, [isMapOpen, locationName]);

  // ✅ Get User Location
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ latitude, longitude });
      },
      () => alert('ไม่สามารถระบุตำแหน่งของคุณได้')
    );
  };

 

  return (
    <>
      {/* ปุ่ม Cancel + MAP */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
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
          <div className="relative w-[90%] max-w-md h-[80vh] bg-white rounded-2xl overflow-hidden shadow-lg">
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
                <MapContainer
                  center={
                    userLocation
                      ? [userLocation.latitude, userLocation.longitude]
                      : [coords.latitude, coords.longitude]
                  }
                  zoom={15}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Marker ปลายทาง */}
                  <Marker position={[coords.latitude, coords.longitude]} icon={heroIcon}>
                    <Popup>{locationName}</Popup>
                  </Marker>

                  {/* Marker ตำแหน่งผู้ใช้ */}
                  {userLocation && (
                    <Marker
                      position={[userLocation.latitude, userLocation.longitude]}
                      icon={L.divIcon({
                        html: renderToString(<MapPinIcon className="h-8 w-8 text-blue-600" />),
                        className: '',
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                      })}
                    >
                      <Popup>ตำแหน่งของฉัน</Popup>
                    </Marker>
                  )}

                  {/* เส้นนำทาง */}
                  {route && <Polyline positions={route} color="blue" weight={4} opacity={0.7} />}
                </MapContainer>

                {/* ปุ่มควบคุม */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-[1000]">
                  <button
                    onClick={handleGetMyLocation}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-700"
                  >
                    <CursorArrowRaysIcon className="h-4 w-4" />
                    <span>Get Location</span>
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
