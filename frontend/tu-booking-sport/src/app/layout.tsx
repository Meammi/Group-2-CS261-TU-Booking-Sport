import type { Metadata } from "next";
import { Nunito } from "next/font/google"; // 1. Import แค่ Nunito
import "./globals.css";
import 'leaflet/dist/leaflet.css';


// 2. ตั้งค่าแค่ Nunito
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito", // ตั้งชื่อตัวแปรให้ Tailwind รู้จัก
});

export const metadata: Metadata = {
  title: "TU Booking Sport",
  description: "Group 2 CS261 Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. ใช้แค่ตัวแปรของ Nunito และเพิ่ม antialiased เพื่อให้ฟอนต์คมชัด */}
      <body className={`${nunito.variable} antialiased`}>{children}</body>
    </html>
  );
}

