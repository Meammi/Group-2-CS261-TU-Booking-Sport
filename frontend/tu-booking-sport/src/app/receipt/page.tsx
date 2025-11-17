'use client';
import { API_BASE } from '@/lib/config';
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
  const [studentId, setStudentId] = useState<string>("");

  const total = data.price + (data.tax || 0);
  const qrRef = useRef<HTMLDivElement>(null);

  // fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8081/auth/me", { credentials: "include" });
        if (!res.ok) throw new Error(`Failed to fetch user info: ${res.status}`);
        const me: { username: string } = await res.json();
        setStudentId(me.username || "");
      } catch (err) {
        console.error(err);
        setStudentId("6709616376"); // fallback
      }
    };
    fetchUser();
  }, []);

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

    if (!file.type.startsWith("image/")) {
      setCheckResult("รองรับเฉพาะไฟล์รูปภาพเท่านั้น");
      setChecking(false);
      return;
    }

    try {
      const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
      if (!result || !result.data) {
        setCheckResult("ไม่พบ QR code ในภาพ");
        return;
      }

      const scanned = result.data;
      const body = { reservationId: data.bookingId, slipId: scanned };

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
      setCheckResult("ไม่พบ QR code ในภาพ");
    } finally {
      setChecking(false);
    }
  };

  return (
    <main className="bg-neutral-100 min-h-screen overflow-y-scroll font-sans">
      <div className="mx-auto max-w-md bg-white min-h-screen shadow-md ">
        {/* Top bar */}
        <Header studentId={studentId} />
        <div className="py-8 px-6 ">
          {/* Title */}
          <h1 className="text-center text-2xl font-bold text-tu-navy tracking-wider mt-2 uppercase">
            Receipt
          </h1>

          <div className="mt-4 border-t border-dashed border-neutral-300 " />
          <div className="mt-4 space-y-3 text-sm">

            {/* นี่คือ <Row> "Shop Name" เดิม */}
            <div className="flex">
              <div className="flex-1 text-neutral-500">Shop Name:</div>
              <div className={`${RIGHT_COL_WIDTH} text-right text-neutral-800 font-semibold`}>
                {data.shopName}
              </div>
            </div>

            {/* นี่คือ <Row> "Date" เดิม */}
            <div className="flex">
              <div className="flex-1 text-neutral-500">Date:</div>
              <div className={`${RIGHT_COL_WIDTH} text-right text-neutral-800 font-semibold`}>
                {data.dateStr}
              </div>
            </div>

          </div>


          <div className="mt-4 border-t border-dashed border-neutral-300" />

          {/* Items */}
          <div className="mt-4 text-sm text-neutral-600">
            <div className="flex font-semibold text-neutral-800">
              <div className="flex-1">Description</div>
              <div className={`${RIGHT_COL_WIDTH} text-right`}>Price</div>
            </div>

            <div className="mt-3 flex">
              <div className="flex-1">{data.itemName}</div>
              <div className={`${RIGHT_COL_WIDTH} text-right font-medium text-neutral-700`}>
                {data.price.toFixed(2)}
              </div>
            </div>

            <div className="my-4 border-t border-dashed border-neutral-300" />

            <div className="flex">
              <div className="flex-1">Tax</div>
              <div className={`${RIGHT_COL_WIDTH} text-right font-medium text-neutral-700`}>
                {Number(data.tax || 0).toFixed(2)}
              </div>
            </div>

            <div className="mt-2 flex items-baseline font-bold text-neutral-900 text-base">
              <div className="flex-1">Total</div>
              <div className={`${RIGHT_COL_WIDTH} text-right`}>
                {total.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-200" />

          {/* QR Section */}
          <div className="mt-6 flex flex-col items-center gap-4 text-center">
            <div ref={qrRef} className="rounded-lg border border-neutral-200 bg-white p-2">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="w-28 h-28" />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center">
                  <p className="text-xs text-neutral-500">Generating QR…</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900">No. {data.orderNo}</p>
              <p className="mt-1 text-sm text-neutral-600">
                Thank you for Booking!
              </p>
            </div>
          </div>
        </div>
        {/* Checking Result */}
        {(checking || checkResult) && (
          <div className="mt-4 px-6">
            <div className={`p-4 rounded-lg text-center ${checking
                ? 'bg-blue-50 text-blue-700'
                : checkResult?.includes('✅')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
              {checking ? (
                <p className="font-medium">Checking QR Code...</p>
              ) : (
                <p className="font-medium">{checkResult}</p>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-3 flex flex-col items-center gap-3 ">
          <label
            htmlFor="upload-slip"
            className="w-400 text-center px-6 py-3 rounded-lg bg-tu-navy text-white text-sm font-semibold cursor-pointer hover:bg-neutral-800 active:scale-[.98] transition"
          >
            Upload Slip
          </label>

          <button
            type="button"
            className="w-400 px-6 py-3 rounded-lg bg-transparent text-neutral-600 text-sm font-semibold border border-neutral-300 hover:bg-neutral-100 active:scale-[.98] transition"
            onClick={() => router.push('/mybooking')}
          >
            Cancel
          </button>

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
      </div>
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
