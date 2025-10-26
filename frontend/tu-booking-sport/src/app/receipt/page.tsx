"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [data, setData] = useState<ReceiptData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const total = data.price + (data.tax || 0);

  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/payments/${id}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();

        setData({
          orderNo: json.id ?? "—",
          bookingId: json.bookingId ?? id,
          shopName: "โอนแล้วบิด",
          dateStr: new Date().toLocaleString(),
          itemName: json.itemName ?? "Unknown Item",
          price: json.price ?? 0,
          tax: json.tax ?? 0,
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

      const res = await fetch("http://localhost:8081/api/slipChecking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setCheckResult("ตรวจสอบสำเร็จ ✅");
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
    <main className="min-h-screen w-full bg-neutral-100 flex items-start justify-center py-6">
      <section className="w-[360px] min-h-[740px] rounded-lg border bg-white shadow-sm overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 text-neutral-700">
          <button aria-label="Menu" className="p-1">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2 text-[11px]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm7 8a7 7 0 0 0-14 0"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <span className="tracking-wide">{data.orderNo}</span>
          </div>
        </div>

        <div className="px-6 pb-8">
          <h1 className="text-center text-[20px] tracking-[0.12em] font-semibold text-neutral-800">
            RECEIPT
          </h1>
          <div className="mt-3 border-t" />

          {/* Shop / Date */}
          <div className="mt-3 space-y-2 text-[13px]">
            <Row
              label="Shop Name:"
              value={data.shopName}
              rightColWidth={RIGHT_COL_WIDTH}
            />
            <Row
              label="Date:"
              value={data.dateStr}
              rightColWidth={RIGHT_COL_WIDTH}
            />
          </div>

          <div className="mt-3 border-t" />

          {/* Items */}
          <div className="mt-3 text-[13px]">
            <div className="flex font-semibold">
              <div className="flex-1">Description</div>
              <div className={`${RIGHT_COL_WIDTH} text-right`}>Price</div>
            </div>

            <div className="mt-2 flex">
              <div className="flex-1">{data.itemName}</div>
              <div className={`${RIGHT_COL_WIDTH} text-right`}>
                {data.price.toFixed(2)}
              </div>
            </div>

            <div className="my-3 border-t" />

            <div className="flex">
              <div className="flex-1">Tax</div>
              <div className={`${RIGHT_COL_WIDTH} text-right`}>
                {Number(data.tax || 0).toFixed(2)}
              </div>
            </div>

            <div className="mt-1 flex font-semibold">
              <div className="flex-1">Total</div>
              <div className={`${RIGHT_COL_WIDTH} text-right`}>
                {total.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="mt-4 border-t" />

          {/* QR + details */}
          <div className="mt-4 flex items-center gap-4">
            <div ref={qrRef} className="rounded-md border bg-neutral-50 p-2">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="w-20 h-20" />
              ) : (
                <p className="text-[11px] text-neutral-500">Generating QR…</p>
              )}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold">No. {data.orderNo}</p>
              <p className="mt-2 text-[12px]">Thank you for Booking!</p>
            </div>
          </div>

          {/* Loading / Error / QR check */}
          {loading && (
            <p className="mt-6 text-center text-[12px] text-neutral-500">
              Loading receipt…
            </p>
          )}
          {error && (
            <p className="mt-2 text-center text-[12px] text-red-600">
              Error: {error}
            </p>
          )}
          {checking && (
            <p className="mt-2 text-center text-[12px] text-neutral-500">
              กำลังตรวจสอบ QR…
            </p>
          )}
          {checkResult && (
            <p className="mt-2 text-center text-[12px] text-red-700">
              {checkResult}
            </p>
          )}

          {/* Button Section */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              className="px-6 py-2 rounded-md border bg-red-600 text-white text-[14px] active:scale-[.99]"
            >
              Cancel
            </button>

            {/* Upload Slip */}
            <label
              htmlFor="upload-slip"
              className="px-6 py-2 rounded-md bg-green-700 text-white text-[14px] cursor-pointer hover:bg-blue-800 active:scale-[.99]"
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
