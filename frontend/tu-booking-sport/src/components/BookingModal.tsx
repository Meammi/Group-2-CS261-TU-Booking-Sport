'use client';

// 1. กำหนด Props ที่ Modal นี้ต้องการ
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  courtName: string;
  slot: string | null;
}

export default function BookingModal({ isOpen, onClose, onConfirm, isLoading, courtName, slot }: BookingModalProps) {
  // 2. ถ้า Modal ไม่ได้ถูกสั่งให้เปิด (isOpen=false) ก็ไม่ต้องแสดงผลอะไรเลย
  if (!isOpen) {
    return null;
  }

  return (
    // 3. สร้าง Backdrop (พื้นหลังสีเทาโปร่งแสง) และจัด Modal ให้อยู่กลางจอ
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
        <h3 className="text-xl font-bold text-tu-navy mb-2">Confirm Your Booking</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to book <br />
          <span className="font-bold">{courtName}</span> at <span className="font-bold">{slot}</span>?
        </p>

        {/* 4. ปุ่มสำหรับยืนยันและยกเลิก */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-tu-navy hover:bg-tu-navy/90 text-white font-semibold transition disabled:opacity-50"
          >
            {isLoading ? 'Booking...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
