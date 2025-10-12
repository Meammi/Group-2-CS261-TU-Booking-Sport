// app/receipt/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
// ใช้ชื่อตามไฟล์ของเต๊าอิ๋ว (เห็นว่าตอนนี้เป็น Qrcard.tsx)
import QRCard from "@/components/Qrcard";

// ---- Types ----
type ReceiptData = {
  orderNo: string;
  bookingId: string;
  shopName: string;
  dateStr: string; // รูปแบบที่จะแสดง เช่น "11/04/2024"
  itemName: string;
  price: number;
  tax: number;
  // ถ้า API มี total มาให้ด้วยก็รับเพิ่มได้ แต่เราจะคำนวณจาก price+tax ให้ก่อน
};

// ค่าเริ่มต้นก่อนโหลด (กัน UI กระพือ)
const INITIAL_DATA: ReceiptData = {
  orderNo: "—",
  bookingId: "—",
  shopName: "—",
  dateStr: "—/—/—",
  itemName: "—",
  price: 0,
  tax: 0,
};

export default function ReceiptPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ReceiptData>(INITIAL_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ใช้ id/bookingId จาก query string: /receipt?id=219402-394 หรือ ?bookingId=xxxx
  const idFromQuery = searchParams.get("id");
  const bookingFromQuery = searchParams.get("bookingId");

  // total คำนวณจาก state เสมอ (ถ้า API มี total ให้ก็สลับมาใช้ได้)
  const total = useMemo(() => Number(data.price || 0) + Number(data.tax || 0), [data.price, data.tax]);

  useEffect(() => {
    // ---- ตัวอย่างการโหลดข้อมูลจาก API ----
    // รองรับทั้งสองแบบ:
    //  - /api/receipts/:id                (เช่น orderNo)
    //  - /api/receipt?bookingId=xxxx      (เช่น bookingId)
    async function fetchReceipt() {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      try {
        let url = "";
        if (idFromQuery) {
          url = '/api/receipts/${encodeURIComponent(idFromQuery)}';
        } else if (bookingFromQuery) {
          const qs = new URLSearchParams({ bookingId: bookingFromQuery });
          url = '/api/receipt?${qs.toString()}';
        } else {
          // กรณีไม่มี query เลย — อาจให้ default หรือแจ้ง error
          throw new Error("Missing receipt id/bookingId in query string.");
        }

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch receipt (${res.status})');
        const payload = (await res.json()) as Partial<ReceiptData>;

        // map/normalize ข้อมูลจาก API -> state
        setData((prev) => ({
          orderNo: payload.orderNo ?? prev.orderNo,
          bookingId: payload.bookingId ?? prev.bookingId,
          shopName: payload.shopName ?? prev.shopName,
          dateStr: payload.dateStr ?? prev.dateStr, // ถ้า API ให้เป็น ISO date ให้แปลงก่อนแสดง
          itemName: payload.itemName ?? prev.itemName,
          price: typeof payload.price === "number" ? payload.price : prev.price,
          tax: typeof payload.tax === "number" ? payload.tax : prev.tax,
        }));
      } catch (err: any) {
        setError(err?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    }

    fetchReceipt();
  }, [idFromQuery, bookingFromQuery]);

  // —— UI เริ่ม —— //
  const RIGHT_COL_WIDTH = "w-24"; // ให้แนวขวาตรงกับ Price

  return (
    <main className="min-h-screen w-full bg-neutral-100 flex items-start justify-center py-6">
      <section className="w-[360px] min-h-[740px] rounded-lg border bg-white shadow-sm overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 text-neutral-700">
          <button aria-label="Menu" className="p-1">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2 text-[11px]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm7 8a7 7 0 0 0-14 0" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="tracking-wide">{data.bookingId}</span>
          </div>
        </div>

        <div className="px-6 pb-8">
          <h1 className="text-center text-[20px] tracking-[0.12em] font-semibold text-neutral-800">RECEIPT</h1>
          <div className="mt-3 border-t" />

          {/* Shop / Date */}
          <div className="mt-3 space-y-2 text-[13px]">
            <Row label="Shop Name:" value={data.shopName} rightColWidth={RIGHT_COL_WIDTH} />
            <Row label="Date:" value={data.dateStr} rightColWidth={RIGHT_COL_WIDTH} />
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
              <div className={`${RIGHT_COL_WIDTH} text-right`}>{data.price.toFixed(2)}</div>
            </div>

            <div className="my-3 border-t" />

            <div className="flex">
              <div className="flex-1">Tax</div>
              <div className={`${RIGHT_COL_WIDTH} text-right`}>{Number(data.tax || 0).toFixed(2)}</div>
            </div>

            <div className="mt-1 flex font-semibold">
              <div className="flex-1">Total</div>
              <div className={`${RIGHT_COL_WIDTH} text-right`}>{total.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-4 border-t" />

          {/* QR + details */}
          <div className="mt-4 flex items-center gap-4">
            <div className="rounded-md border bg-neutral-50 p-2">
              {/* ใช้ QRCard จากไฟล์ของเต๊าอิ๋ว */}
              <QRCard className="h-20 w-20" src="/qr.png" alt={`QR for order ${data.orderNo}`} />
            </div>

            <div className="flex-1">
              <p className="text-[15px] font-semibold">No. {data.orderNo}</p>
              <p className="mt-1 text-[11px]">Time Stamp : 00:01:32</p>
              <p className="mt-2 text-[12px]">Thank you for Booking!</p>
            </div>
          </div>

          {/* Loading / Error */}
          {loading && (
            <p className="mt-6 text-center text-[12px] text-neutral-500">Loading receipt…</p>
          )}
          {error && (
            <p className="mt-2 text-center text-[12px] text-red-600">Error: {error}</p>
          )}

          {/* Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="px-6 py-2 rounded-md border bg-neutral-100 text-neutral-800 text-[14px] active:scale-[.99]"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

/** helper: label ซ้าย, value ขวา (ล็อกความกว้างคอลัมน์ขวาให้ตรงกับ Price) */
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