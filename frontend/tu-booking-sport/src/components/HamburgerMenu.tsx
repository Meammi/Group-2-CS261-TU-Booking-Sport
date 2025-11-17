'use client';

import { useState } from 'react';
import Link from 'next/link';
import LogoutModal from "@/components/LogoutCard";


import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  LifebuoyIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/solid';

const navLinks = [
  { href: '/homepage', label: 'Homepage', icon: HomeIcon },
  { href: '/mybooking', label: 'My Booking', icon: CalendarDaysIcon },
  { href: '/reservations', label: 'Reservation', icon: ClipboardDocumentListIcon },
  { href: '/support', label: 'Support', icon: LifebuoyIcon },
  { href: '/setting', label: 'Setting', icon: Cog6ToothIcon },
  { label: 'Logout', icon: ArrowRightStartOnRectangleIcon, action: 'logout'  },
];

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* --- Hamburger Button --- */}
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
                    border-r border-gray-200 
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          aria-label="Close menu"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <nav className="mt-20 flex flex-col space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon; 
            if (link.href) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-tu-navy transition-colors"
                  onClick={toggleMenu}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-lg font-medium">{link.label}</span>
                </Link>
              );
            }

            if (link.action === "logout") {
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    toggleMenu();
                    setShowLogout(true);
                  }}
                  className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-tu-navy transition-colors"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-lg font-medium">{link.label}</span>
                </button>
              );
            }

          })}
        </nav>
      </div>

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={toggleMenu}
        ></div>
      )}

      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} />}
    </div>
  );
}