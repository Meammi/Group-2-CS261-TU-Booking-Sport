type Props = {
  title: string;                 // "Interzone 01"
  slotTimes?: string[];          // ["16:00","17:00","18:00","19:00","20:00"]
};

export default function RsvInterzoneCard({
  title,
  slotTimes = ["16:00", "17:00", "18:00", "19:00", "20:00"],
}: Props) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md border border-gray-100">
      {/* Image Placeholder */}
      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md bg-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* เนื้อหาขวา */}
      <div className="flex-1 text-center">
        {/* ชื่อ Interzone อยู่ตรงกลาง */}
        <h3 className="text-2xl font-bold text-slate-800">{title}</h3>

        {/* เส้นคั่นใต้หัวข้อ */}
        <div className="mt-3 h-[2px] w-full rounded bg-black" />

        {/* เวลาแต่ละช่วง */}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {slotTimes.map((t) => (
            <span
              key={t}
              className="rounded-lg bg-black px-3 py-1 text-[14px] font-semibold text-white shadow"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}