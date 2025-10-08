
interface SportCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

export default function SportCard({ imageUrl, title, subtitle }: SportCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-gray-100 flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity">
      {/* Image Placeholder */}
      <div className="w-full h-24 bg-gray-300 flex items-center justify-center">
        {/* ในอนาคตจะเปลี่ยนเป็น <Image /> */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      {/* Text Content */}
      <div className="p-2 w-full bg-gray-200">
        <p className="font-bold text-sm text-gray-800">{subtitle}</p>
        <p className="text-xs text-gray-600">{title}</p>
      </div>
    </div>
  );
}