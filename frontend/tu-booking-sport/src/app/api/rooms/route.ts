import { NextResponse } from 'next/server'

export async function GET() {
  const data = [
    {
      name: 'Court 1',
      type: 'Badminton',
      capacity: 4,
      price: 0,
      room_id: 'room-1',
      loc_name: 'Interzone',
      slot_time: {
        '16:00:00': 'AVAILABLE',
        '17:00:00': 'BOOKED',
        '18:00:00': 'AVAILABLE',
        '19:00:00': 'AVAILABLE',
        '20:00:00': 'AVAILABLE'
      }
    },
    {
      name: 'Court 2',
      type: 'Badminton',
      capacity: 4,
      price: 0,
      room_id: 'room-2',
      loc_name: 'Interzone',
      slot_time: {
        '16:00:00': 'AVAILABLE',
        '17:00:00': 'BOOKED',
        '18:00:00': 'AVAILABLE',
        '19:00:00': 'MAINTENANCE',
        '20:00:00': 'AVAILABLE'
      }
    },
     {
      name: 'Court ๅ',
      type: 'Karaoke',
      capacity: 4,
      price: 150,
      room_id: 'room-2',
      loc_name: 'Interzone',
      slot_time: {
        '16:00:00': 'AVAILABLE',
        '17:00:00': 'BOOKED',
        '18:00:00': 'AVAILABLE',
        '19:00:00': 'MAINTENANCE',
        '20:00:00': 'AVAILABLE'
      }
    },
    {
      name: 'Court 2',
      type: 'Badminton',
      capacity: 4,
      price: 50,
      room_id: 'room-2',
      loc_name: 'Gym4',
      slot_time: {
        '17:00:00': 'AVAILABLE',
        '18:00:00': 'AVAILABLE',
        '19:00:00': 'BOOKED',
        '20:00:00': 'AVAILABLE'
      }
    }
  ]
  return NextResponse.json(data)
}
