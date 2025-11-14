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