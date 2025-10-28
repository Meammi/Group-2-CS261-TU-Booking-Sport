//Group-2-CS261-TU-Booking-Sport\frontend\tu-booking-sport\src\components\AuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8081/auth/me", {
        withCredentials: true, // ✅ ส่ง cookie ไปด้วย
      })
      .then((res) => {
        console.log("User info:", res.data);
        setIsChecking(false);
      })
      .catch((err) => {
        console.error("Unauthorized:", err.response?.data?.error || err.message);
        router.push("/login"); // 🔁 redirect ถ้าไม่ได้รับสิทธิ์
      });
  }, []);

  if (isChecking) {
    return <div className="text-center py-10">Checking authentication...</div>;
  }

  return <>{children}</>;
}
