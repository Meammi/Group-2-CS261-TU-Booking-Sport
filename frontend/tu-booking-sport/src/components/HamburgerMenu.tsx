'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* --- Hamburger Button (Visible when menu is closed) --- */}
      <button
        onClick={toggleMenu}
        className={`p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none z-50 relative transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
        aria-label="Open menu"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* --- Side Menu Panel --- */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-5 z-40 
                   border-r border-gray-500 
                   transition-transform duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Close Button inside Sidebar */}
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          aria-label="Close menu"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Navigation Links */}
        <nav className="mt-20 flex flex-col space-y-4">
          <Link href="/homepage" className="text-lg text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
            Homepage
          </Link>
          <Link href="/mybooking" className="text-lg text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
            My Booking
          </Link>
          <Link href="/reservation" className="text-lg text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
            Reservation
          </Link>
          <Link href="/notification" className="text-lg text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
            Notification
          </Link>
           <Link href="/support" className="text-lg text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
            Support
          </Link>
           <Link href="/setting" className="text-lg text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
            Setting
          </Link>
           <Link href="/logout" className="text-lg text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
            Logout
          </Link>
        </nav>
      </div>

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0  z-30"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
}

