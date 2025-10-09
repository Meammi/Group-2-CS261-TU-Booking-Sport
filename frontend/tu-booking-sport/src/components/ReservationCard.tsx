interface ReservationCardProps {
  title: string;
  location: string;
  total: number;
}

export default function ReservationCard({ title, location, total }: ReservationCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md border border-gray-100">
      {/* Image Placeholder */}
      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md bg-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Text Content */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">Location: {location}</p>
        <p className="text-sm text-gray-600">Total Court: {total}</p>
      </div>

      {/* Booking Button */}
      <div className="flex-shrink-0">
        <button className="rounded-md bg-black px-4 py-1 text-sm font-semibold text-white transition hover:bg-gray-800">
          Booking
        </button>
      </div>
    </div>
  );
}