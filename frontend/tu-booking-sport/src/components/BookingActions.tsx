'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { MapPinIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface BookingActionsProps {
  bookingId: number;
  status: string;
}

export default function BookingActions({ bookingId, status }: BookingActionsProps) {
  const router = useRouter();

  const [modalState, setModalState] = useState<'closed' | 'confirm' | 'success'>('closed');

  const handleOpenConfirmModal = () => {
    setModalState('confirm');
  };

  const handleCloseModal = () => {
    setModalState('closed');
  };

  const handleConfirmCancel = () => {
    console.log(`Cancelling booking ID: ${bookingId}`);

    setModalState('success');

    setTimeout(() => {
      router.push('/mybooking');
    }, 2000); 
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button 
          onClick={handleOpenConfirmModal}
          className="rounded-md bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-300" 
          disabled={status !== 'current'}
        >
          Cancel
        </button>
        <button className="flex items-center justify-center gap-2 rounded-md bg-green-600 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
          <MapPinIcon className="h-4 w-4" />
          <span>MAP</span>
        </button>
      </div>

      {modalState !== 'closed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          
          {modalState === 'confirm' && (
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-bold">Are you sure?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Do you really want to cancel this booking? This process cannot be undone.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button onClick={handleCloseModal} className="rounded-md border border-gray-300 bg-white py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Go Back
                </button>
                <button onClick={handleConfirmCancel} className="rounded-md bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700">
                  Confirm
                </button>
              </div>
            </div>
          )}

          {modalState === 'success' && (
             <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl text-center">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-lg font-bold">Cancel Success!</h3>
              <p className="mt-2 text-sm text-gray-600">
                Your booking has been successfully cancelled. Redirecting...
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
