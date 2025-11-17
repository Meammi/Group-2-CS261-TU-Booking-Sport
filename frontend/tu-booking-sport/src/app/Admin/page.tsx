'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  slotTime: string; // e.g., "14:00:00"
  status: 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';
}

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const AdminPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [roomsPage, setRoomsPage] = useState(0);
  const [totalRoomsPages, setTotalRoomsPages] = useState(0);
  const PAGE_SIZE = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'createRoom' | 'editRoom' | 'createSlot' | 'editSlot' | null>(null);
  const [currentItem, setCurrentItem] = useState<Room | Slot | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [isSlotManagerOpen, setIsSlotManagerOpen] = useState(false);
  const [selectedRoomForSlots, setSelectedRoomForSlots] = useState<Room | null>(null);
  const [slotsForSelectedRoom, setSlotsForSelectedRoom] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const API_BASE = 'http://localhost:8081';

  const getAuthToken = () => {
    return typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null;
  };

  // ✅ FETCH ROOMS (with pagination)
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Admin access token not found. Please log in.');

      const res = await fetch(
        `${API_BASE}/admin/rooms?page=${roomsPage}&size=${PAGE_SIZE}&sort=orderId,asc`,
        { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' }
      );

      if (!res.ok) throw new Error('Failed to fetch rooms.');
      const data: Page<Room> = await res.json();

      setRooms(data.content);
      setTotalRoomsPages(data.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [roomsPage]);

  // ✅ FETCH SLOTS (for a room)
  const fetchSlotsForRoom = useCallback(async (roomId: string) => {
    setSlotsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Admin access token not found.');
      const res = await fetch(`${API_BASE}/admin/slots?roomId=${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch slots.');
      const data: Slot[] = await res.json();
      setSlotsForSelectedRoom(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ MODAL handlers
  const handleOpenModal = (mode: 'createRoom' | 'editRoom' | 'createSlot' | 'editSlot', item: Room | Slot | null = null) => {
    setModalMode(mode);
    setCurrentItem(item);
    setFormData(item || {});
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setCurrentItem(null);
    setFormData({});
    setFormError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleOpenSlotManager = (room: Room) => {
    setSelectedRoomForSlots(room);
    setIsSlotManagerOpen(true);
    fetchSlotsForRoom(room.room_id);
  };

  // ✅ FORM SUBMIT (create/edit room/slot)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      setFormError('Authentication token not found.');
      return;
    }

    let url = '';
    let method = 'POST';

    if (modalMode === 'createRoom') {
      url = `${API_BASE}/admin/rooms`;
    } else if (modalMode === 'editRoom' && currentItem) {
      url = `${API_BASE}/admin/rooms/${(currentItem as Room).room_id}`;
      method = 'PUT';
    } else if (modalMode === 'createSlot') {
      url = `${API_BASE}/admin/slots`;
      formData.room = { room_id: selectedRoomForSlots?.room_id };
    } else if (modalMode === 'editSlot' && currentItem) {
      url = `${API_BASE}/admin/slots/${(currentItem as Slot).slotId}`;
      method = 'PUT';
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Failed to ${modalMode}.`);

      handleCloseModal();
      if (modalMode?.includes('Room')) fetchData();
      if (selectedRoomForSlots) fetchSlotsForRoom(selectedRoomForSlots.room_id);
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  // ✅ DELETE room
  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room and its slots?')) return;
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No token found');
      const res = await fetch(`${API_BASE}/admin/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }, credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete room');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ DELETE slot
  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No token found');
      const res = await fetch(`${API_BASE}/admin/slots/${slotId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }, credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete slot');
      if (selectedRoomForSlots) fetchSlotsForRoom(selectedRoomForSlots.room_id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ UI render
  if (loading) return <div className="p-4">Loading admin dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

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
            {rooms.map((room) => (
              <div key={room.room_id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="grid grid-cols-4 gap-2 text-sm mb-4 items-center">
                  <div className="font-medium">{room.name}</div>
                  <div className="text-gray-600">{room.type}</div>
                  <div className="text-gray-600">{room.loc_name}</div>
                  <div className="text-right font-bold">{room.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleOpenSlotManager(room)} className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                    Manage Slots
                  </button>
                  <button onClick={() => handleOpenModal('editRoom', room)} className="px-3 py-1 text-sm bg-tu-navy text-white rounded-md hover:bg-blue-900">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteRoom(room.room_id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4 text-sm">
            <button onClick={() => setRoomsPage(p => p - 1)} disabled={roomsPage === 0} className="px-3 py-1 bg-white border rounded-md disabled:opacity-50">Previous</button>
            <span>Page {roomsPage + 1} of {totalRoomsPages}</span>
            <button onClick={() => setRoomsPage(p => p + 1)} disabled={roomsPage >= totalRoomsPages - 1} className="px-3 py-1 bg-white border rounded-md disabled:opacity-50">Next</button>
          </div>
        </main>
      </div>

      {/* ✅ Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg p-5 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {modalMode?.replace(/([A-Z])/g, ' $1')}
            </h3>
            {formError && <div className="text-red-600 mb-3">{formError}</div>}
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-3">
                {(modalMode === 'createRoom' || modalMode === 'editRoom') && (
                  <>
                    <input
                      name="name"
                      value={formData.name || ''}
                      onChange={handleFormChange}
                      placeholder="Room Name"
                      className="w-full p-2 border rounded"
                      required
                    />

                    {/* ✅ Type Dropdown */}
                    <select
                      name="type"
                      value={formData.type || ''}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Badminton">Badminton</option>
                      <option value="Karaoke">Karaoke</option>
                    </select>

                    {/* ✅ Price input — cannot be negative */}
                    <input
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price || ''}
                      onChange={handleFormChange}
                      placeholder="Price"
                      className="w-full p-2 border rounded"
                      required
                    />

                    {/* ✅ Location Dropdown */}
                    <select
                      name="loc_name"
                      value={formData.loc_name || ''}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Location</option>
                      <option value="Interzone">Interzone</option>
                      <option value="Gym 4">Gym 4</option>
                      <option value="Melodysphere">Melodysphere</option>
                    </select>

                    {/* ✅ Capacity input — cannot be negative */}
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
                      required
                    >
                      <option value="">Select Time</option>
                      {Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00:00`).map((time) => (
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
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ✅ Slot Manager Modal */}
      {isSlotManagerOpen && selectedRoomForSlots && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-md p-5 w-full max-w-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold">
                Manage Slots for {selectedRoomForSlots.name}
              </h3>
              <button onClick={() => setIsSlotManagerOpen(false)} className="text-gray-600 text-2xl">&times;</button>
            </div>

            <button
              onClick={() => handleOpenModal('createSlot')}
              className="mb-4 w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add New Slot
            </button>

            {slotsLoading ? (
              <div>Loading slots...</div>
            ) : (
              <div className="space-y-2">
                {slotsForSelectedRoom.map((slot) => (
                  <div key={slot.slotId} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span>{slot.slotTime} — {slot.status}</span>
                    <div className="space-x-2">
                      <button onClick={() => handleOpenModal('editSlot', slot)} className="px-2 py-1 bg-tu-navy text-white rounded text-xs">Edit</button>
                      <button onClick={() => handleDeleteSlot(slot.slotId)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-right">
              <button onClick={() => setIsSlotManagerOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
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
