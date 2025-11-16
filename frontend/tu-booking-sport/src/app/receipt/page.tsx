"use client";
import { API_BASE } from '@/lib/config'
import { useState, useEffect, useRef } from "react";
import Header from '@/components/Header';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";
import QRCode from "qrcode";
import { Suspense } from "react";

interface ReceiptData {
  orderNo: string;
  bookingId: string;
  shopName: string;
  dateStr: string;
  itemName: string;
  price: number;
  tax: number;
  token: string;
}

const INITIAL_DATA: ReceiptData = {
  orderNo: "—",
  bookingId: "—",
  shopName: "โอนแล้วบิด",
  dateStr: "",
  itemName: "",
  price: 0,
  tax: 0,
  token: "",
};

const RIGHT_COL_WIDTH = "w-24";

// แยก component ที่ใช้ useSearchParams ออกมา
function ReceiptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [data, setData] = useState<ReceiptData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const userStudentId = "6709616376";


  const total = data.price + (data.tax || 0);

  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Missing reservation ID");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/payments/${id}`);
        if (!res.ok) {
          let msg = "Failed to fetch payment details";
          try {
            const raw = await res.text();
            if (raw) {
              const parsed = JSON.parse(raw);
              msg = parsed?.message || raw;
            }
          } catch { }
          throw new Error(msg);
        }
        const json = await res.json();

        setData({
          orderNo: json.id ?? id,
          bookingId: json.reservationId ?? id,
          shopName: "TU Booking Sport",
          dateStr: json.paymentDate
            ? new Date(json.paymentDate).toLocaleString()
            : new Date().toLocaleString(),
          itemName: "Reservation Fee",
          price: Number(json.price ?? 0),
          tax: 0,
          token: json.token ?? "",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Generate QR code when token changes
  useEffect(() => {
    if (data.token) {
      QRCode.toDataURL(data.token, { width: 150, margin: 1 })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR generation error:", err));
    }
  }, [data.token]);

  const handleUpload = async (file: File) => {
    setCheckResult(null);
    setChecking(true);

    // ตรวจสอบไฟล์เป็น image
    if (!file.type.startsWith("image/")) {
      setCheckResult("รองรับเฉพาะไฟล์รูปภาพเท่านั้น");
      setChecking(false);
      return;
    }

    try {
      // สแกน QR ในภาพ
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });
      if (!result || !result.data) {
        setCheckResult("ไม่พบ QR code ในภาพ");
        return;
      }

      const scanned = result.data;

      // ตรวจสอบกับ API
      const body = {
        reservationId: data.bookingId,
        slipId: scanned,
      };

      const res = await fetch(API_BASE + "/api/slipChecking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setCheckResult("ตรวจสอบสำเร็จ ✅");
        router.push('/mybooking');
      } else {
        setCheckResult(`ตรวจสอบไม่สำเร็จ: ${json.message ?? "ไม่ทราบเหตุผล"}`);
      }
    } catch (err: any) {
      // ถ้า error จาก QrScanner หรือภาพไม่มี QR
      setCheckResult("ไม่พบ QR code ในภาพ");
    } finally {
      setChecking(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen flex justify-center items-center">
      <section className="mx-auto max-w-md w-full bg-white shadow-sm py-8 px-6 ">

        {/* Top bar */}
        <Header studentId={userStudentId} />

        {/* Title */}
        <h1 className="text-center text-[22px] font-bold text-neutral-800 tracking-wide mt-2">
          RECEIPT
        </h1>

        <div className="mt-4 border-t border-gray-200" />

        {/* Shop / Date */}
        <div className="mt-4 space-y-3 text-[14px] text-neutral-700">
          <Row label="Shop Name:" value={data.shopName} rightColWidth={RIGHT_COL_WIDTH} />
          <Row label="Date:" value={data.dateStr} rightColWidth={RIGHT_COL_WIDTH} />
        </div>

        <div className="mt-4 border-t border-gray-200" />

        {/* Items */}
        <div className="mt-4 text-[14px] text-neutral-700">
          <div className="flex font-semibold text-neutral-800">
            <div className="flex-1">Description</div>
            <div className={`${RIGHT_COL_WIDTH} text-right`}>Price</div>
          </div>

          <div className="mt-2 flex">
            <div className="flex-1">{data.itemName}</div>
            <div className={`${RIGHT_COL_WIDTH} text-right`}>
              {data.price.toFixed(2)}
            </div>
          </div>

          <div className="my-4 border-t border-gray-200" />

          <div className="flex">
            <div className="flex-1">Tax</div>
            <div className={`${RIGHT_COL_WIDTH} text-right`}>
              {Number(data.tax || 0).toFixed(2)}
            </div>
          </div>

          <div className="mt-1 flex font-semibold text-neutral-800">
            <div className="flex-1">Total</div>
            <div className={`${RIGHT_COL_WIDTH} text-right`}>
              {total.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200" />

        {/* QR Section */}
        <div className="mt-6 flex flex-col items-center gap-4 text-center">
          <div ref={qrRef} className="rounded-md border border-gray-200 bg-neutral-50 p-3">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="w-24 h-24" />
            ) : (
              <p className="text-[11px] text-neutral-500">Generating QR…</p>
            )}
          </div>
          <div>
            <p className="text-[16px] font-bold text-neutral-800">No. {data.orderNo}</p>
            <p className="mt-1 text-[13px] text-neutral-600">
              Thank you for Booking!
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4">

          <button
            type="button"
            className="px-6 py-2 rounded-md bg-gray-700 text-white text-[14px] hover:bg-gray-900 active:scale-95 transition"
            onClick={() => router.push('/mybooking')}
          >
            Cancel
          </button>

          <label
            htmlFor="upload-slip"
            className="px-6 py-2 rounded-md bg-green-600 text-white text-[14px] cursor-pointer hover:bg-green-700 active:scale-95 transition"
          >
            Upload Slip
          </label>

          <input
            type="file"
            id="upload-slip"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />

        </div>

      </section>
    </main>

  );
}

// Component หลักที่ wrap ด้วย Suspense
export default function ReceiptPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full bg-neutral-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-neutral-600">Loading receipt...</p>
          </div>
        </main>
      }
    >
      <ReceiptContent />
    </Suspense>
  );
}

function Row({
  label,
  value,
  rightColWidth = "w-24",
}: {
  label: string;
  value: string | number;
  rightColWidth?: string;
}) {
  return (
    <div className="flex items-start">
      <div className="flex-1 pr-3 text-neutral-700">{label}</div>
      <div className={`${rightColWidth} text-right font-medium`}>
        {typeof value === "number" ? value.toString() : value}
      </div>
    </div>
  );
}








