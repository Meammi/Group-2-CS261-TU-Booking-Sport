"use client";
import React, {useEffect, useState} from "react";

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
  open, spot, date, time, onClose, onConfirm, userId, slotId, roomId, idsUrl,
}: Props) {
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
    // กำหนดค่า userId และ slotId จากแหล่งข้อมูลที่มี
    let finalUserId = userId;
    let finalSlotId = slotId;

    try {
      // กรณีที่ส่ง URL มาให้ดึง userId + slotId พร้อมกัน
      if ((!finalUserId || !finalSlotId) && idsUrl) {
        const r = await fetch(idsUrl, { method: 'GET' });
        if (!r.ok) {
          let m = `Failed to fetch IDs (${r.status})`;
          try { const t = await r.text(); if (t) m = t; } catch {}
          throw new Error(m);
        }
        const data = await r.json();
        if (!finalUserId) finalUserId = data?.userId;
        if (!finalSlotId) finalSlotId = data?.slotId;
      }

      // กรณีถอด userId จาก JWT ใน localStorage
      if (!finalUserId) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) throw new Error('Please login before booking.');
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);
          finalUserId = payload?.id || payload?.userId || null;
          // ตรวจสอบว่าเป็น UUID ถูกต้องไหม
          const isUuid = (v: any) => typeof v === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v);
          if (!finalUserId || !isUuid(finalUserId)) {
            finalUserId = null as any;
          }
        } catch (e) {
          finalUserId = null as any;
        }
      }

      // กรณี fallback ดึง userId จาก session cookie (/auth/me)
      if (!finalUserId) {
        const meRes = await fetch('http://localhost:8081/auth/me', {
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
        const lookupUrl = `http://localhost:8081/api/slot/lookup?roomId=${encodeURIComponent(roomId)}&time=${encodeURIComponent(time)}`;
        const lookupRes = await fetch(lookupUrl);
        if (!lookupRes.ok) {
          let m = `Slot lookup failed (${lookupRes.status})`;
          try { const t = await lookupRes.text(); if (t) m = t; } catch {}
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
      const res = await fetch("http://localhost:8081/reservation/create", {
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
        } catch {}

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
      setSuccessMsg(
        data?.reservationId
          ? `Booked successfully! Reservation ID: ${data.reservationId}`
          : "Booked successfully!"
      );
      if (onConfirm) onConfirm();
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
        <p className="text-center mb-6">Date : {date} &nbsp; Time : {time}</p>

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
