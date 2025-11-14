'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';

interface Room {
  room_id: string;
  name: string;
  type: string;
  capacity: number;
  loc_name: string;
  price: number;
}

interface Slot {
  slotId: string;
  room: {
    room_id: string;
    name: string;
  };
  slotTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';
}

const AdminPage = () => {
  // Mock empty data (no backend yet)
  const [rooms] = useState<Room[]>([]);
  const [slotsForSelectedRoom] = useState<Slot[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    'createRoom' | 'editRoom' | 'createSlot' | 'editSlot' | null
  >(null);

  const [currentItem, setCurrentItem] = useState<Room | Slot | null>(null);
  const [formData, setFormData] = useState<any>({});

  const [isSlotManagerOpen, setIsSlotManagerOpen] = useState(false);
  const [selectedRoomForSlots, setSelectedRoomForSlots] = useState<Room | null>(null);

  const handleOpenModal = (
    mode: 'createRoom' | 'editRoom' | 'createSlot' | 'editSlot',
    item: Room | Slot | null = null
  ) => {
    setModalMode(mode);
    setCurrentItem(item);
    setFormData(item || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setCurrentItem(null);
    setFormData({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleOpenSlotManager = (room: Room) => {
    setSelectedRoomForSlots(room);
    setIsSlotManagerOpen(true);
  };
return (
    <>
      <div className="max-w-md mx-auto bg-gray-100 min-h-screen font-nunito">
        <Header studentId="6709616376" />

        <main className="p-4">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Rooms Management</h2>
            <button
              onClick={() => handleOpenModal('createRoom')}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-900 text-sm"
            >
              Add New Room
            </button>
          </div>

          <div className="space-y-3 p-3 bg-gray-50 rounded-lg shadow-inner">
            {rooms.length === 0 && (
              <div className="text-gray-500 text-center">No rooms yet (mock data)</div>
            )}

            {rooms.map((room) => (
              <div
                key={room.room_id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <div className="grid grid-cols-4 gap-2 text-sm mb-4 items-center">
                  <div className="font-medium">{room.name}</div>
                  <div className="text-gray-600">{room.type}</div>
                  <div className="text-gray-600">{room.loc_name}</div>
                  <div className="text-right font-bold">{room.price.toFixed(2)}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenSlotManager(room)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Manage Slots
                  </button>

                  <button
                    onClick={() => handleOpenModal('editRoom', room)}
                    className="px-3 py-1 text-sm bg-tu-navy text-white rounded-md hover:bg-blue-900"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>