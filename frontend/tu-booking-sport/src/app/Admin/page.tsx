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
      {/* Modal (Create/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg p-5 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {modalMode?.replace(/([A-Z])/g, ' $1')}
            </h3>

            <form>
              <div className="space-y-3">
                {(modalMode === 'createRoom' || modalMode === 'editRoom') && (
                  <>
                    <input
                      name="name"
                      value={formData.name || ''}
                      onChange={handleFormChange}
                      placeholder="Room Name"
                      className="w-full p-2 border rounded"
                    />

                    <select
                      name="type"
                      value={formData.type || ''}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Type</option>
                      <option value="Badminton">Badminton</option>
                      <option value="Karaoke">Karaoke</option>
                    </select>

                    <input
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price || ''}
                      onChange={handleFormChange}
                      placeholder="Price"
                      className="w-full p-2 border rounded"
                    />

                    <select
                      name="loc_name"
                      value={formData.loc_name || ''}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Location</option>
                      <option value="Interzone">Interzone</option>
                      <option value="Gym 4">Gym 4</option>
                      <option value="Melodysphere">Melodysphere</option>
                    </select>

                    <input
                      name="capacity"
                      type="number"
                      min="0"
                      value={formData.capacity || ''}
                      onChange={handleFormChange}
                      placeholder="Capacity"
                      className="w-full p-2 border rounded"
                    />
                  </>
                )}

                {(modalMode === 'createSlot' || modalMode === 'editSlot') && (
                  <>
                    <select
                      name="slotTime"
                      value={formData.slotTime || ''}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Time</option>
                      {Array.from({ length: 24 }, (_, i) =>
                        `${i.toString().padStart(2, '0')}:00:00`
                      ).map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>

                    <select
                      name="status"
                      value={formData.status || 'AVAILABLE'}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="BOOKED">BOOKED</option>
                      <option value="UNAVAILABLE">UNAVAILABLE</option>
                    </select>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save (mock)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       {/* Slot Manager */}
      {isSlotManagerOpen && selectedRoomForSlots && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-md p-5 w-full max-w-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold">
                Manage Slots for {selectedRoomForSlots.name}
              </h3>
              <button
                onClick={() => setIsSlotManagerOpen(false)}
                className="text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <button
              onClick={() => handleOpenModal('createSlot')}
              className="mb-4 w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add New Slot
            </button>

            <div className="text-center text-gray-500">No slots yet (mock data)</div>

            <div className="mt-4 text-right">
              <button
                onClick={() => setIsSlotManagerOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;