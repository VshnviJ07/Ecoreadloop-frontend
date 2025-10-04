// src/BackgroundVideo.jsx
import React from "react";

export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source
          src="/PixVerse_V5_Image_Text_360P_ecoreadloop_likhdo (2)-vmake.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
}
