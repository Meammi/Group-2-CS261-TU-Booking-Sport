"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/config";

type Props = {
  open: boolean;
  spot: string;
  date: string;   // รูปแบบแสดงผล เช่น 11/04/2025
  time: string;
  onClose: () => void;
  onConfirm?: () => void;
  userId?: string;
  slotId?: string;
  roomId?: string;
  idsUrl?: string;
};

export default function ConfirmModal({
  open, spot, time, onClose, onConfirm, userId, slotId, roomId, idsUrl,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [open]);

  const handleConfirm = async () => {

    // --- START: VALIDATE TIME 
    try {
      // Normalize time format to HH:mm
      let hm = time;

      // DB format: 16:00:00.0000000
      if (/^\d{2}:\d{2}:\d{2}\.\d+$/.test(time)) {
        const [hh, mm] = time.split(":");
        hm = `${hh}:${mm}`;
      }

      // DB format: 16:00:00
      if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        const [hh, mm] = time.split(":");
        hm = `${hh}:${mm}`;
      }

      const [hour, minute] = hm.split(":").map(Number);

      if (isNaN(hour) || isNaN(minute)) {
        setErrorMsg("Invalid time format.");
        return;
      }

      const now = new Date();
      const slotTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        0
      );

      if (now > slotTime) {
        setErrorMsg("This slot is in the past and can no longer be booked.");
        return;
      }
    } catch (e: any) {
      console.error("Error parsing time:", e);
      setErrorMsg("Invalid time format (Parsing failed)");
      return;
    }

    let finalUserId = userId;
    let finalSlotId = slotId;

    try {
      // กรณีที่ส่ง URL มาให้ดึง userId + slotId พร้อมกัน
      if ((!finalUserId || !finalSlotId) && idsUrl) {
        const r = await fetch(idsUrl, { method: 'GET' });
        if (!r.ok) {
          let m = `Failed to fetch IDs (${r.status})`;
          try { const t = await r.text(); if (t) m = t; } catch { }
          throw new Error(m);
        }
        const data = await r.json();

        if (!finalUserId) finalUserId = data?.userId;
        if (!finalSlotId) finalSlotId = data?.slotId;
      }



      // กรณี fallback ดึง userId จาก session cookie (/auth/me)
      if (!finalUserId) {
        const meRes = await fetch(`${API_BASE}/auth/me`, {
          credentials: 'include',
        });
        if (!meRes.ok) {
          throw new Error(`Failed to fetch user info (${meRes.status})`);
        }
        const me = await meRes.json();
        finalUserId = me?.id;
        const isUuid = (v: any) => typeof v === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v);
        if (!isUuid(finalUserId)) {
          throw new Error('Invalid user ID returned from /auth/me');
        }
      }

      // กรณีต้องค้นหา slotId จากค่า roomId + time โดยให้ backend resolve ให้
      if (!finalSlotId) {
        if (!roomId || !time) throw new Error('Missing roomId or time to resolve slot.');
        const lookupUrl = `${API_BASE}/api/slot/lookup?roomId=${encodeURIComponent(roomId)}&time=${encodeURIComponent(time)}`;
        const lookupRes = await fetch(lookupUrl);
        if (!lookupRes.ok) {
          let m = `Slot lookup failed (${lookupRes.status})`;
          try { const t = await lookupRes.text(); if (t) m = t; } catch { }
          throw new Error(m);
        }
        const d = await lookupRes.json();
        finalSlotId = d?.slotId;
        if (!finalSlotId) throw new Error('Slot ID not found for selected time.');
      }
    } catch (e: any) {
      setErrorMsg(e?.message || 'Cannot resolve booking identifiers');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: Record<string, any> = { userId: finalUserId, slotId: finalSlotId };
    if (roomId) payload.roomId = roomId;

    try {
      // ส่งคำขอสร้างการจองไปที่ backend
      const res = await fetch(`${API_BASE}/reservation/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) {

        let message = "Reservation failed. Please try again.";
        let raw = "";
        try {
          raw = await res.text();
          if (raw) {
            try {
              const data = JSON.parse(raw);
              message = data?.message || raw;
            } catch {
              message = raw;
            }
          }
        } catch { }

        const lower = (message || "").toLowerCase();
        if (
          lower.includes("already booked") ||
          lower.includes("this court was reserve") ||
          lower.includes("slot status: booked") ||
          lower.includes("booked")
        ) {
          message = "Already booked";
        }

        throw new Error(message);
      }
      const data = await res.json();
      const reservation = data?.reservation;
      const reservationId =
        reservation?.reservationID ||
        reservation?.reservationId ||
        data?.reservationId ||
        null;
      const priceRaw = reservation?.price ?? data?.price;
      const price =
        priceRaw === undefined || priceRaw === null
          ? 0
          : typeof priceRaw === "number"
            ? priceRaw
            : typeof priceRaw === "string"
              ? parseFloat(priceRaw)
              : Number(priceRaw) || 0;

      setSuccessMsg(
        reservationId
          ? `Booked successfully! Reservation ID: ${reservationId}`
          : "Booked successfully!"
      );
      if (onConfirm) onConfirm();

      if (reservationId && price > 0) {
        try {
          const paymentRes = await fetch(`${API_BASE}/api/payments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reservationId }),
          });

          if (!paymentRes.ok) {
            let msg = "Failed to prepare payment. Please try again.";
            try {
              const raw = await paymentRes.text();
              if (raw) {
                const parsed = JSON.parse(raw);
                msg = parsed?.message || raw;
              }
            } catch { }
            throw new Error(msg);
          }
          router.push(`/receipt?id=${reservationId}`);
        } catch (paymentErr: any) {
          setSuccessMsg(null);
          setErrorMsg(paymentErr?.message || "Unable to prepare payment.");
        }
      } else {
        router.push(`/mybooking`);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!open) return null;
  //console.log(successMsg,errorMsg);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* dialog */}
      <div className="relative z-10 w-[min(92vw,520px)] rounded-lg bg-white p-6 shadow-2xl border">
        <h2 className="text-2xl font-bold text-center mb-3">Your Booking</h2>
        <p className="text-center text-xl font-semibold mb-1">Spot : {spot}</p>
        <p className="text-center mb-6">Time : {time}</p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onClose}
            className="rounded-md bg-red-600 px-5 py-2 text-white font-semibold shadow hover:bg-red-700 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-5 py-2 text-white font-semibold shadow hover:bg-blue-700 active:scale-95 disabled:opacity-60"
          >
            {isSubmitting ? 'Processing...' : 'Confirm'}
          </button>
        </div>
        {(errorMsg || successMsg) && (
          <div className="mt-4 text-center text-sm">
            {errorMsg && (
              <p className="text-red-600 font-semibold">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-green-600 font-semibold">{successMsg}</p>
            )}
          </div>
        )}
        {(!errorMsg && !successMsg) && (
          <div className="mt-4 text-center text-sm">
          </div>
        )}
      </div>
    </div>
  );
}
