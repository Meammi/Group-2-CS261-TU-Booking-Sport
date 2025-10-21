"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import BackgroundLayout from "@/components/BGlayout";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false); // ✅ ต้องมีบรรทัดนี้
  const [showIcon, setShowIcon] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePasswordChange(e: any) {
    const value = e.target.value;
    if (value && showIcon) {
      setShowIcon(false);
      setTimeout(() => {
        inputRef.current?.focus(); // ✅ ใช้งานได้ตรงนี้
      }, 0);
    } else if (!value) {
      setShowIcon(true);
    }
  }

  return (
    <BackgroundLayout>
      <div className="flex items-center justify-center min-h-screen">
        {/*</div><div className="border-2 border-gray-700 rounded-[10px] px-[20px] pt-[40px] pb-[20px] w-[300px] bg-gray-50">*/}
        <div className="bg-white border-2 border-gray-700 rounded-lg shadow-md px-6 pt-10 pb-6 w-[320px]">
          {/*<h2 className="-top-[15px] px-[10px] font-bold text-2xl mb-1 text-center">SIGN-IN</h2>*/}
          {/*<h2 className="text-center -top-[25px] px-[10px] font-bold text-sm mb-5">TU Booking Sports</h2>*/}
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-1">
            SIGN-IN
          </h2>
          <h3 className="text-center text-sm font-semibold text-gray-700 mb-6">
            TU Booking Sports
          </h3>

          {/*ช่องเก็บใส่ข้อมูล*/}
          <form className="space-y-5">
            <div className="relative mb-5">
              <label
                htmlFor="email"
                className="absolute -top-2 left-3 text-sm font-medium text-gray-900 bg-white px-1 z-10"
              >
                E-mail / ID*
              </label>
              <div className="relative mb-5">
                {/*<input type="email" id="email" placeholder="your@dome.tu.ac.th"className="w-full px-4 py-2 pl-5 border border-gray-300 rounded-md focus:outline-none" />*/}
                <input
                  type="email"
                  id="email"
                  placeholder="your@dome.tu.ac.th"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-black"
                />
                <span className="absolute right-3 top-3">
                  <Image
                    src="/images/email.png"
                    alt="email icon"
                    width={20}
                    height={20}
                  />
                </span>
              </div>
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox text-black" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot" className="text-black hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Link href="/homepage">
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200"
              >
                Log-in
              </button>
            </Link>
            <div className="text-center text-sm mb-2"></div>
          </form>
        </div>
      </div>
    </BackgroundLayout>
  );
}
