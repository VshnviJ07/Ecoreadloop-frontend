import React from "react";

export default function PageWrapper({ children, title }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video for desktop */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover hidden sm:block"
        aria-hidden="true"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      {/* Fallback overlay for mobile */}
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900 sm:hidden"></div>

      {/* Overlay blur + card */}
      <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-lg rounded-xl shadow-xl p-8 sm:p-10">
        {title && <h1 className="text-2xl font-bold text-white mb-6 text-center">{title}</h1>}
        {children}
      </div>
    </div>
  );
}
