"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HeroData } from "@/lib/types";

// Mock fallbacks if needed
const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=80",
];

interface HeroProps {
  hero: HeroData | null;
}

const Hero = ({ hero }: HeroProps) => {
  // Media sources
  const videoUrlLocal = "/videos/hero-video.mp4";
  const videoUrlRemote = hero?.video_url || "https://design-e.learnwithcap.com/wp-content/uploads/2025/07/0701.mp4";
  const videoUrlFallback = "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4";
  
  const images = hero?.images || MOCK_IMAGES;
  const title = hero?.title || "Tiếng Anh giao tiếp \n chuyên ngành xây dựng";
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [useVideo, setUseVideo] = useState(hero?.media_type !== 'slider');
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync state with prop
  useEffect(() => {
    setUseVideo(hero?.media_type !== 'slider');
  }, [hero?.media_type]);

  // Auto-slide logic for images
  useEffect(() => {
    if (!useVideo && images && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [useVideo, images]);

  // Handle video load error to fallback to images
  const handleVideoError = () => {
    console.log("Video failed to load, falling back to image slider.");
    setUseVideo(false);
  };

  return (
    <section className="relative w-full h-auto md:h-[calc(100vh-68px)] flex flex-col justify-center pt-1 pb-1 px-4 md:px-8 overflow-hidden font-sans">
      <div className="relative w-full min-h-[400px] md:min-h-[300px] md:max-w-[95vw] mx-auto aspect-video md:aspect-[2.5/1] max-h-[calc(100vh-76px)] rounded-[24px] md:rounded-[32px] overflow-hidden group hero-container border border-gray-100 shadow-sm isolate bg-gray-900">
        
        {useVideo ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-0"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            onError={handleVideoError}
            key={videoUrlRemote}
            controls={showControls}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <source src={videoUrlLocal} type="video/mp4" />
            <source src={videoUrlRemote} type="video/mp4" />
            <source src={videoUrlFallback} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 w-full h-full">
            {images && images.map((img, idx) => (
              <div
                key={idx}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                  idx === currentImageIndex ? "opacity-100" : "opacity-0"
                )}
              >
                <Image
                  src={img}
                  alt={`Herobg ${idx}`}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-blue-950/60 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-transparent opacity-80" />
              </div>
            ))}
          </div>
        )}
        
        {!useVideo && (
          <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-16 max-w-4xl hero-content text-left pointer-events-none">
            <div className="font-extrabold leading-snug text-white mb-2 md:mb-6 drop-shadow-lg tracking-tight whitespace-pre-line pointer-events-auto">
              <h1 className="text-white !text-[19px] md:!text-6xl drop-shadow-xl" style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.8)" }}>
                {title}
              </h1>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
