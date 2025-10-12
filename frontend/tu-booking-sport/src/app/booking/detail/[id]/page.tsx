import Link from "next/link";
import { ArrowLeftIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { mockBookings } from "@/lib/data"; 


async function getBookingById(id: string) {
  const bookingId = parseInt(id, 10);
  return mockBookings.find(b => b.id === bookingId);
}



export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const booking = await getBookingById(params.id);

  if (!booking) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-md bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Booking Not Found</h1>
                <p className="text-gray-500 mt-2">The booking you are looking for does not exist.</p>
                <Link href="/mybooking" className="mt-6 inline-block rounded-md bg-tu-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800">
                    Go Back to My Bookings
                </Link>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-md bg-gray-100 min-h-screen">
        
        {/* Header พิเศษสำหรับหน้านี้ มีปุ่ม Back */}
        <header className="relative flex items-center justify-center p-4 border-b">
          <Link href="/mybooking" className="absolute left-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold">Detail</h1>
        </header>

        <main className="p-6 font-nunito">
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-md">
            
            {/* QR Code Placeholder */}
            <div className="mx-auto h-36 w-36 bg-gray-100 p-2 border rounded-md flex items-center justify-center">
              <p className="text-xs text-gray-400">QR Code Placeholder</p>
            </div>
            <p className="mt-2 font-mono text-lg tracking-widest">{booking.qrCodeId}</p>

            {/* Booking Details */}
            <div className="mt-6 text-left space-y-2 border-t pt-4">
              <h2 className="text-2xl font-bold text-tu-navy">{booking.title}</h2>
              <p className="text-sm text-gray-600"><strong>Location:</strong> {booking.location}</p>
              <p className="text-sm text-gray-600"><strong>Date:</strong> {booking.date}</p>
              <p className="text-sm text-gray-600"><strong>Time:</strong> {booking.time}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600"><strong>Status:</strong></p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'current' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="rounded-md bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-300" disabled={booking.status !== 'current'}>
                Cancel
              </button>
              <button className="flex items-center justify-center gap-2 rounded-md bg-tu-navy py-2 text-sm font-semibold text-white transition hover:bg-blue-900">
                <MapPinIcon className="h-4 w-4" />
                <span>MAP</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

