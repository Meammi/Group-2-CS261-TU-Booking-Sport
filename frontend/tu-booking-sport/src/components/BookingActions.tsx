'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPinIcon } from '@heroicons/react/24/solid';
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
  // แปลง React Component (Heroicon) ให้เป็น HTML string
  html: renderToString(
    // คุณสามารถใช้ Tailwind CSS ตกแต่ง icon ที่นี่ได้เลย
    <MapPinIcon className="h-10 w-10 text-red-600" /> // 👈 เปลี่ยนสีหรือขนาดตามต้องการ
  ),
  className: '', // 👈 ตั้งค่านี้เพื่อลบพื้นหลังสี่เหลี่ยมสีขาว
  iconSize: [40, 40], // 👈 ขนาด (h-10 w-10 = 40px)
  iconAnchor: [20, 40], // 👈 จุดปักหมุด (กึ่งกลางแนวนอน, ปลายล่างสุด)
});


// ✅ Dynamic import (เพื่อใช้ Leaflet เฉพาะฝั่ง client)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface BookingActionsProps {
  bookingId: number;
  status: string;
  isCurrent: boolean;
  locationName: string; // ✅ เพิ่มชื่อสถานที่เพื่อใช้เรียก API
}



export default function BookingActions({ bookingId, status, isCurrent, locationName }: BookingActionsProps) {
  const [modalState, setModalState] = useState<'closed' | 'confirm' | 'success' | 'error'>('closed');
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);

  // ✅ state เก็บค่าพิกัดจริงจาก backend
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ เมื่อเปิด Map ให้ดึงข้อมูลจาก API
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

    fetchLocation();
  }, [isMapOpen, locationName]);

  const handleOpenConfirmModal = () => setModalState('confirm');
  const handleCloseModal = () => setModalState('closed');
  const handleOpenMap = () => setIsMapOpen(true);
  const handleCloseMap = () => setIsMapOpen(false);

  return (
    <>
      {/* ปุ่ม Cancel + MAP */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={handleOpenConfirmModal}
          className="rounded-md bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
          disabled={!isCurrent}
        >
          Cancel
        </button>

        <button
          onClick={handleOpenMap}
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
              onClick={handleCloseMap}
              className="absolute top-3 right-3 z-[1000] bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition"
            >
              ✕
            </button>

            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-600">กำลังโหลดแผนที่...</div>
            ) : coords ? (
              <MapContainer
                center={[coords.latitude, coords.longitude]}
                zoom={16}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[coords.latitude, coords.longitude]}
                  icon={heroIcon} // 👈 ✅ ใช้ตัวแปรที่เราสร้างไว้
                >
                  <Popup>{locationName}</Popup>
                </Marker>
              </MapContainer>

            ) : (
              <div className="flex items-center justify-center h-full text-red-600">
                {errorMessage || 'ไม่พบข้อมูลพิกัด'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* modal ยกเลิก booking (ของเดิมทั้งหมดเก็บไว้ได้เลย) */}
      {modalState !== 'closed' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          {/* ... ส่วน confirm/success/error modal เดิมของคุณ ... */}
        </div>
      )}
    </>
  );
}