import HamburgerMenu from "@/components/HamburgerMenu";
import { UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface HeaderProps {
  studentId: string;
}

export default function Header({ studentId }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-4 bg-white w-full ">
      
      {/* --- ด้านซ้าย: Hamburger Menu (แสดงทุกขนาดจอ) --- */}
      <HamburgerMenu />

      {/* --- ด้านขวา: Profile --- */}
      <div className="flex items-center gap-2">
        <UserCircleIcon className="h-6 w-6 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{studentId}</span>
      </div>

    </header>
  );
}

