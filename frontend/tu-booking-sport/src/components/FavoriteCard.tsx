import Image from "next/image";
import Link from "next/link";

interface cardProps {
    name: string;
    id: number;
    imageUrl: string;
    title: string;
    location: string;
    date: string;
    time: string;
}



export default function FavoriteCard({ name, id, imageUrl, title, location, date, time }: cardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-md border border-gray-100">
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
                <h3 className="text-lg font-bold text-blue-600">{name}</h3>
                <p className="text-sm text-gray-600">Location: {location}</p>
                <p className="text-sm text-gray-600">Date: {date}</p>
                <p className="text-sm text-gray-600">Time: {time}</p>
              </div>
    
              <div className="flex-shrink-0 self-end">
                <Link href={`/booking/detail/${id}`}>
                  <button className="rounded-md bg-tu-navy px-4 py-1 text-sm font-semibold text-white transition hover:bg-gray-800">
                    Detail
                  </button>
                </Link>
              </div>
        </div>
  );
}