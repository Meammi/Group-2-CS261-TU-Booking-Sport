import Image from "next/image";
import Link from "next/link";

interface SportCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  href: string;
}

export default function SportCard({
  imageUrl,
  title,
  subtitle,
  href,
}: SportCardProps) {
  return (
    <Link href={href}>
      <div className="rounded-lg overflow-hidden shadow-md bg-white flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity">
        <div className="relative w-full h-24">
          <Image
            src={imageUrl}
            alt={`Image of ${title} at ${subtitle}`}
            layout="fill"
            objectFit="cover"
            className="bg-gray-200"
          />
        </div>

        {/* Text Content */}
        <div className="p-2 w-full bg-white">
          <p className="font-bold text-sm text-gray-800">{title}</p>
          <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
