import Image from "next/image";
import Link from "next/link";

interface cardProps {
    roomId: string;
    slotId: string;
    type: string;
    name: string;
    locationName: string;
    startTime: string;
}

export default function FavoriteCard({ name, slotId, type, locationName, startTime }: cardProps) {
  const imageUrl:string = '/images/gym4.jpg';
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-md border border-gray-100">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={imageUrl}
                  alt={`Image of ${type}`}
                  layout="fill"
                  objectFit="cover"
                  className="bg-gray-200"
                />
              </div>
    
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-blue-600">{type}</h3>
                <p className="text-sm text-gray-600">Location: {locationName}</p>
                <p className="text-sm text-gray-600">Court: {name}</p>
                <p className="text-sm text-gray-600">Time: {startTime}</p>
              </div>
        </div>
  );
}