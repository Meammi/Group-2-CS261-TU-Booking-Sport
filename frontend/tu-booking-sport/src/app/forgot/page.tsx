import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BackgroundLayout from "@/components/BGlayout";

export default function forgot_1() {
    return (
    <BackgroundLayout>
        <div className="flex items-center justify-center min-h-screen">
            <div  className="bg-white border-2 border-gray-700 rounded-lg shadow-md px-6 pt-10 pb-6 w-[320px]">
                <h1 className="text-2xl font-bold mb-4">Forgotten Your Password</h1>
                <p className="text-gray-700 mb-6">
                There is nothing to worry about, we'll send 
                you a message to help you reset your password
                </p>

                <div className="relative mb-5">
                    <label htmlFor="email" 
                    className="absolute -top-2 left-3 text-sm font-medium text-gray-900 bg-white px-1 z-10">
                    E-mail / ID*</label>
                    <div className="relative mb-5">
                        <input type="email" id="email" placeholder="your@dome.tu.ac.th"
                        className="w-full px-4 py-2 pl-5 border border-gray-300 rounded-md focus:outline-none" />
                        <span className="absolute right-3 top-3 text-gray-400">
                        <Image src="/images/key.png" alt="key icon" width={20} height={20} />
                        </span>
                    </div>
                </div>
                <div className="flex justify-center gap-4">
                    <Link href="/forgot/forgotsend" className="w-full">
                    <button className="w-full bg-black text-white px-2 py-2 rounded hover:bg-gray-800 transition">Send</button>
                    </Link>
                </div>
            </div>
        </div>
    </BackgroundLayout>
    );
}