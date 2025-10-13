import React from 'react';
import Link from 'next/link';
import BackgroundLayout from "@/components/BGlayout";

export default function forgot_1() {
    return (
    <BackgroundLayout>
        <div className="flex items-center justify-center min-h-screen">
            <div  className="bg-white border-2 border-gray-700 rounded-lg shadow-md px-6 pt-10 pb-6 w-[320px]">
                <h1 className="text-2xl font-bold mb-4">Forgotten Your Password</h1>
                <p className="text-gray-700 mb-6">
                We just sent you an email with a link to reset your password.<br />
                Please check your inbox — it should arrive shortly —
                </p>
                <div className="flex flex-col item-center gap-4">
                    <Link href="/login" className="w-full">
                    <button className="w-full bg-black text-white px-2 py-2 rounded hover:bg-gray-800 transition mg-10">Sign-in</button>
                    </Link>
            
                    <Link href="/forgot" className="w-full">
                    {/*<button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">Send Again</button>*/}
                    <button className="w-full bg-black text-white px-2 py-2 rounded hover:bg-gray-800 transition">Send Again</button>
                    </Link>
                </div>
            </div>
        </div>
    </BackgroundLayout>
    );
}