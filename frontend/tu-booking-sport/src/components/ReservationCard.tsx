import Link from 'next/link';
import Image from 'next/image';

interface ReservationCardProps {
  id :number;
  href: string; 
  imageUrl: string;
  title: string;
  location: string;
  total: number;
}

export default function ReservationCard({ href, imageUrl, title, location, total }: ReservationCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md border border-gray-100">
      
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={`Image of ${title}`}
          layout="fill"
          objectFit="cover"
          className="bg-gray-200"
        />
      </div>

      <div className="flex-grow">
        <h3 className="text-lg font-bold text-blue-600">{title}</h3>
        <p className="text-sm text-gray-600">Location: {location}</p>
        <p className="text-sm text-gray-600">Total Court: {total}</p>
      </div>

      <div className="flex-shrink-0">
        <Link href={href}>
          <button className="rounded-md bg-tu-navy px-4 py-1 text-sm font-semibold text-white transition hover:bg-gray-800">
            Booking
          </button>
        </Link>
      </div>
    </div>
  );
}