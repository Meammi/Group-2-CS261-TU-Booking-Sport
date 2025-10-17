"use client";

import Image from "next/image";
import React from "react";

interface QRCardProps {
  /** ถ้าอยากเปลี่ยนขนาดหรือสไตล์ ใช้ className ต่อจากภายนอกได้เลย */
  className?: string;
  /** ถ้าอยากเปลี่ยน path ของรูป QR */
  src?: string;
  /** คำอธิบาย alt สำหรับรูป */
  alt?: string;
}

const QRCard: React.FC<QRCardProps> = ({
  className = "w-24 h-24",
  src = "/qr.png",
  alt = "QR Code",
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-md bg-white shadow-sm border ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={96}
        height={96}
        className="object-contain"
        priority
      />
    </div>
  );
};

export default QRCard;