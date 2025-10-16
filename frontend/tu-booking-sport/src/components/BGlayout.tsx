import React from "react";

export default function BackgroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundImage: "url('/images/bg_login.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
      className="flex justify-center items-center"
    >
      <div className="w-full mx-auto" style={{ maxWidth: "375px" }}>
        {children}
      </div>
    </div>
  );
}