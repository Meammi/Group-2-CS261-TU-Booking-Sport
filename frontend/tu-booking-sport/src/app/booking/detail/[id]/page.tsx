import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { mockBookings } from "@/lib/data";
import BookingActions from "@/components/BookingActions"; 


async function getBookingById(id: string) {
  const bookingId = parseInt(id, 10);
  return mockBookings.find(b => b.id === bookingId);
}


export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const booking = await getBookingById(params.id);

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Booking not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-md bg-gray-100 min-h-screen">
        
        <header className="relative flex items-center justify-center p-4 border-b bg-white">
          <Link href="/mybooking" className="absolute left-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
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
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  booking.status === 'current' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>

            <BookingActions bookingId={booking.id} status={booking.status} />
            
          </div>
        </main>
      </div>
    </div>
  );
}

