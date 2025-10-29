'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { MapPinIcon, ExclamationTriangleIcon, CheckCircleIcon, ArrowPathIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface BookingActionsProps {
  bookingId: number;
  status: string;
  isCurrent: boolean;
}

export default function BookingActions({ bookingId, status, isCurrent }: BookingActionsProps) {

  const router = useRouter();

  const [modalState, setModalState] = useState<'closed' | 'confirm' | 'success' | 'error'>('closed');
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenConfirmModal = () => { setModalState('confirm'); };
  const handleCloseModal = () => { setModalState('closed'); };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setErrorMessage('');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        return;
      }

      // 1) Resolve userId from /auth/me
      const meRes = await fetch('http://localhost:8081/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!meRes.ok) {
        throw new Error(`Failed to fetch user info: ${meRes.status}`);
      }
      const me: { id: string } = await meRes.json();

      // 2) Get user's current bookings to find the matching reservationId by index (bookingId)
      const bookingsRes = await fetch(`http://localhost:8081/MyBookings/${me.id}`, {
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
      
      const response = await fetch(`http://localhost:8081/MyBookings/cancel/${reservationIdToCancel}`, {
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
    }
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button 
          onClick={handleOpenConfirmModal}
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
                <button onClick={handleCloseModal} disabled={isCancelling} className="rounded-md border border-gray-300 bg-white py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                  Go Back
                </button>
                <button onClick={handleConfirmCancel} disabled={isCancelling} className="flex items-center justify-center rounded-md bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-red-400">
                  {isCancelling ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : 'Confirm'}
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

          {modalState === 'error' && (
             <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl text-center">
              <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-bold">Cancellation Failed</h3>
              <p className="mt-2 text-sm text-gray-600">
                {errorMessage}
              </p>
              <div className="mt-6">
                <button onClick={handleCloseModal} className="w-full rounded-md border border-gray-300 bg-white py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
