//Group-2-CS261-TU-Booking-Sport\frontend\tu-booking-sport\src\components\LogoutCard.tsx
"use client";

import { useRouter } from "next/navigation";

export default function LogoutModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleConfirm = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-300 rounded-lg shadow-xl px-6 pt-6 pb-6 w-[320px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">ยืนยันการออกจากระบบ</h2>
        <p className="text-sm text-gray-600 mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
