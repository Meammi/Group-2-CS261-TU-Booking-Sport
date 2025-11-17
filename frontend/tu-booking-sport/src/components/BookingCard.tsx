import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
interface BookingCardProps {
  id: number;
  imageUrl: string;
  title: string;
  location: string;
  date: string;
  time: string;
  status: string;
  reservationId?: string;
}

export default function BookingCard({
  id,
  imageUrl,
  title,
  location,
  date,
  time,
  status,
  reservationId,
}: BookingCardProps) {
  const router = useRouter();
  const normalizedStatus = status.trim().toLowerCase();

  const goToReceipt = () => {
    router.push(`/receipt?id=${reservationId}`);
  };

  // Badge color
  const statusColor =
    normalizedStatus === "cancel"
      ? "bg-red-100 text-red-700"
      : normalizedStatus === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : normalizedStatus === "confirm" || normalizedStatus === "confirmed"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";

  return (
    <div className="relative flex rounded-lg bg-white shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* IMAGE - Full Height */}
      <div className="relative w-36 flex-shrink-0">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>

      {/* DETAILS */}
      <div className="flex flex-col justify-between flex-grow p-4 relative">
        {/* STATUS BADGE */}
        <Link href={`/booking/detail/${id}`}>
          <EllipsisHorizontalIcon className="absolute right-4 top-4 flex-1 h-6 w-6 rounded-full bg-white text-blue-600 px-0 py-0 text-sm font-semibold hover:bg-gray-300 transition " />
        </Link>

        <div>
          <h3 className="text-lg font-bold text-blue-600">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">Location: {location}</p>
          <p className="text-sm text-gray-600 mt-1">Date: {date}</p>
          <div className="text-sm text-gray-600 mt-1 flex items-center justify-between">
            Time: {time}
            <span
              className={` rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}
            >
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-3 flex gap-2">
          {normalizedStatus === "pending" && (
            <button
              onClick={goToReceipt}
              className="flex-1 rounded-md bg-green-500 text-white px-3 py-1 text-sm font-semibold hover:bg-tu-navy transition"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
