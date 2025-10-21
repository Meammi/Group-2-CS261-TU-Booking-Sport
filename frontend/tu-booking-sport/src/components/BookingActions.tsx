'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { MapPinIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface BookingActionsProps {
  bookingId: number;
  status: string;
  isCurrent: boolean; // 1. เพิ่ม isCurrent เข้ามาใน Props
}

export default function BookingActions({ bookingId, status, isCurrent }: BookingActionsProps) {
  const router = useRouter();
  const [modalState, setModalState] = useState<'closed' | 'confirm' | 'success'>('closed');

  // ... (ฟังก์ชัน handle ต่างๆ เหมือนเดิม) ...
  const handleOpenConfirmModal = () => { setModalState('confirm'); };
  const handleCloseModal = () => { setModalState('closed'); };
  const handleConfirmCancel = () => {
    console.log(`Cancelling booking ID: ${bookingId}`);
    setModalState('success');
    setTimeout(() => { router.push('/mybooking'); }, 2000); 
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button 
          onClick={handleOpenConfirmModal}
          // 2. เปลี่ยนเงื่อนไขมาใช้ !isCurrent (ถ้า "ไม่" ใช่ current booking ให้ disabled)
          className="rounded-md bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed" 
          disabled={!isCurrent} 
        >
          Cancel
        </button>
        <button className="flex items-center justify-center gap-2 rounded-md bg-green-600 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
          <MapPinIcon className="h-4 w-4" />
          <span>MAP</span>
        </button>
      </div>

      {/* ... (โค้ด Modal เหมือนเดิม) ... */}
    </>
  );
}



