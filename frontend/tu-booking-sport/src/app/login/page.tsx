//frontend\tu-booking-sport\src\app\login\page.tsx
"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BackgroundLayout from "@/components/BGlayout";
import axios from "@/lib/axios";

export default function Home() {
  const router = useRouter();

  // Add error state
  const [error, setError] = useState("");
  const [studentId, setStudentID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง API
  async function postLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "/auth/login",
        {
          username: studentId,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login successful");
      router.push("/homepage");
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.response) {
        // 🔎 ถ้ามี response กลับมา (เช่น 401)
        setError(
          error.response.data?.message || "Invalid username or password"
        );
      } else {
        // 🔌 ถ้าเชื่อมต่อ backend ไม่ได้
        setError("Cannot connect to server. Please try again later.");
      }
    }
  }
  // ฟังก์ชันจัดการเปิดปิดตา password
  function handlePasswordChange(e: any) {
    const value = e.target.value;
    setPassword(value);

    if (value && showIcon) {
      setShowIcon(false);
      setTimeout(() => {
        inputRef.current?.focus(); // ✅ ใช้งานได้ตรงนี้
      }, 0);
    } else if (!value) {
      setShowIcon(true);
    }
  }
  useEffect(() => {
  async function checkAuth() {
    try {
      await axios.get("/auth/me"); // ✅ will include cookie automatically
      router.push("/homepage"); // logged in
    } catch {
      // not logged in or cookie expired
    }
  }
  checkAuth();
}, []);


  return (
    <BackgroundLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white border-2 border-gray-700 rounded-lg shadow-md px-6 pt-10 pb-6 w-[320px]">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-1">
            SIGN-IN
          </h2>
          <h3 className="text-center text-sm font-semibold text-gray-700 mb-6">
            TU Booking Sports
          </h3>

          {error && (
            <div className="mb-4 text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/*ช่องเก็บใส่ข้อมูล*/}
          <form onSubmit={postLogin} className="space-y-5">
            <div className="relative mb-5">
              <label
                htmlFor="username"
                className="absolute -top-2 left-3 text-sm font-medium text-gray-900 bg-white px-1 z-10"
              >
                Student ID*
              </label>
              <div className="relative mb-5">
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentID(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-black"
                />
                <span className="absolute right-3 top-3">
                  <Image
                    src="/images/Email.png"
                    alt="email icon"
                    width={20}
                    height={20}
                  />
                </span>
              </div>

              <div className="relative mb-5">
                <label
                  htmlFor="password"
                  className="absolute -top-2 left-3 text-sm font-medium text-gray-900 bg-white px-1 z-10"
                >
                  Password*
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="yourpassword"
                    value={password} // ผูก state password
                    onChange={(e) => handlePasswordChange(e)}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  {/* toggle password visibility */}
                  <span
                    className="absolute right-3 top-3 text-gray-400 opacity-60 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    <Image
                      src={
                        showPassword
                          ? "/images/eye-open.png"
                          : "/images/eye-close.png"
                      }
                      alt="toggle password"
                      width={20}
                      height={20}
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm py-2 pb-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox text-black" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot" className="text-black hover:underline">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200"
            >
              Log-in
            </button>
            <div className="text-center text-sm mb-2"></div>
          </form>
        </div>
      </div>
    </BackgroundLayout>
  );
}
