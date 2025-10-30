'use client';

import { useState } from 'react';
import {
  MapContainer as LeafletMapContainer,
  TileLayer as LeafletTileLayer,
  Marker as LeafletMarker,
  Popup as LeafletPopup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue
const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

import dynamic from 'next/dynamic';
import { MapPinIcon, ExclamationTriangleIcon, CheckCircleIcon, ArrowPathIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface BookingActionsProps {
  bookingId: number;
  status: string;
  isCurrent: boolean;
}

// ใช้ dynamic import เพราะ Leaflet ต้องรันบน client เท่านั้น
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

export default function BookingActions({ bookingId, status, isCurrent }: BookingActionsProps) {
  const [modalState, setModalState] = useState<'closed' | 'confirm' | 'success' | 'error'>('closed');
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false); // ✅ state สำหรับ map modal

  // mock data พิกัด
  const mockLatitude = 14.073;
  const mockLongitude = 100.602;

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

            <MapContainer
              center={[14.073, 100.602]}
              zoom={16}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[14.073, 100.602]}>
                <Popup>Room location</Popup>
              </Marker>
            </MapContainer>
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
