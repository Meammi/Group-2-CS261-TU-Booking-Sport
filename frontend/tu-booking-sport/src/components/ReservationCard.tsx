'use client';

import Link from 'next/link';

interface ReservationCardProps {
  href: string;
  imageUrl: string;
  title: string;
  location: string;
  total: number;
}

export default function ReservationCard({ href, imageUrl, title, location, total }: ReservationCardProps) {
  return (
    <Link
      href={href}
      className="block m-4 rounded-xl bg-white shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      prefetch={false}
    >
      <div className="relative h-40 w-full">
        <img
          src={imageUrl}
          alt={`Image of ${title} at ${location}`}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          <p className="text-sm text-gray-200">{location}</p>
        </div>
      </div>
      <div className="p-4 bg-white flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Total: <span className="font-bold text-gray-900">{total}</span> courts
        </p>
        <span className="text-sm font-semibold text-white bg-tu-navy px-4 py-1.5 rounded-full shadow-sm">
          Details
        </span>
      </div>
    </Link>
  );
}

