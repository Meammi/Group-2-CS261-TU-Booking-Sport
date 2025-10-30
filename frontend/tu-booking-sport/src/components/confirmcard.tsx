'use client'
import React from 'react'

type Props = {
  open: boolean
  spot: string
  date: string   // display like 11/04/2025
  time: string
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmCard({
  open, spot, date, time, onClose, onConfirm,
}: Props) {
  if (!open) return null

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
            onClick={onConfirm}
            className="rounded-md bg-blue-600 px-5 py-2 text-white font-semibold shadow hover:bg-blue-700 active:scale-95"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

