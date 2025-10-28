'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Platform icons as SVG components
const TwitterIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Mock video thumbnail component
const VideoThumbnail = ({ 
  title, 
  platform, 
  likes, 
  comments, 
  shares, 
  rotation = 0, 
  scale = 1,
  delay = 0,
  className = "",
  popInterval = 0,
  randomPosition = false,
  imageSrc = null
}) => {
  const thumbnailRef = useRef(null);

  useEffect(() => {
    if (thumbnailRef.current && popInterval > 0) {
      // Create continuous pop-up animation
      const popUp = () => {
        // Random position if specified - spread across entire panel
        if (randomPosition) {
          const x = Math.random() * 400 - 200; // -200px to 200px (full width)
          const y = Math.random() * 300 - 150; // -150px to 150px (full height)
          thumbnailRef.current.style.position = 'fixed';
          thumbnailRef.current.style.left = `calc(50% + ${x}px)`;
          thumbnailRef.current.style.top = `calc(50% + ${y}px)`;
          thumbnailRef.current.style.zIndex = '99999';
        }

        // Pop up animation - no rotation
        gsap.fromTo(thumbnailRef.current, 
          { 
            opacity: 0, 
            scale: 0.3,
            zIndex: 99999
          },
          { 
            opacity: 1, 
            scale: scale,
            duration: 0.6,
            ease: "back.out(2)",
            onComplete: () => {
              // Fade out after a delay
              gsap.to(thumbnailRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.8,
                delay: 2 + Math.random() * 3, // 2-5 seconds visible
                ease: "power2.in",
                onComplete: () => {
                  // Schedule next pop-up
                  setTimeout(popUp, Math.random() * popInterval);
                }
              });
            }
          }
        );
      };

      // Start the first pop-up after initial delay
      setTimeout(popUp, delay * 1000);
    } else if (thumbnailRef.current) {
      // Static entrance animation for videos without pop-up
      gsap.fromTo(thumbnailRef.current, 
        { 
          opacity: 0, 
          scale: 0.8,
          rotation: rotation + 10
        },
        { 
          opacity: 1, 
          scale: scale,
          rotation: rotation,
          duration: 0.8,
          delay: delay,
          ease: "back.out(1.7)"
        }
      );
    }
  }, [rotation, scale, delay, popInterval, randomPosition]);

  const getPlatformColor = () => {
    switch(platform) {
      case 'twitter': return 'bg-blue-500';
      case 'instagram': return 'bg-gradient-to-br from-purple-500 to-pink-500';
      case 'tiktok': return 'bg-black';
      default: return 'bg-gray-500';
    }
  };

  const getPlatformIcon = () => {
    switch(platform) {
      case 'twitter': return <TwitterIcon className="w-4 h-4" />;
      case 'instagram': return <InstagramIcon className="w-4 h-4" />;
      case 'tiktok': return <TikTokIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div 
      ref={thumbnailRef}
      className={`bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-700 ${className}`}
      style={{ 
        transform: `rotate(${rotation}deg) scale(${scale})`,
        position: randomPosition ? 'fixed' : 'absolute',
        zIndex: randomPosition ? 99999 : 'auto'
      }}
    >
      {/* Video thumbnail area */}
      <div className="w-32 h-20 bg-gray-700 rounded mb-2 relative overflow-hidden">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20"></div>
        )}
        <div className="absolute top-1 left-1 flex items-center space-x-1">
          <div className={`w-5 h-5 rounded-full ${getPlatformColor()} flex items-center justify-center text-white`}>
            {getPlatformIcon()}
          </div>
        </div>
        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
          0:45
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-1">
        <p className="text-white text-xs font-medium leading-tight">{title}</p>
        
        {/* Engagement metrics */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1">
              <span>❤️</span>
              <span>{likes}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>💬</span>
              <span>{comments}</span>
            </span>
          </div>
          <span className="flex items-center space-x-1">
            <span>🔄</span>
            <span>{shares}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default function SocialMediaChaos() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Animate the entire container
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[500px] overflow-visible" style={{ perspective: '1000px' }}>
      {/* Constantly popping up video thumbnails */}
      <VideoThumbnail
        title="BREAKING: Wildfire spreads rapidly in California"
        imageSrc={"https://i.ytimg.com/vi/5hghT1W33cY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBWeXthOt_9I3FOIH5ZN4LWaB0qqg"}
        platform="twitter"
        likes="2.3K"
        comments="156"
        shares="89"
        rotation={0}
        scale={0.9}
        delay={0.5}
        popInterval={3000}
        randomPosition={true}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <VideoThumbnail
        title="Devastating floods hit Pakistan - families displaced"
        imageSrc={"https://i.ytimg.com/vi/84ccx0EpAvw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB8wmwM-MhUEJ0quzEMJYhrii2kSA"}
        platform="instagram"
        likes="5.7K"
        comments="234"
        shares="67"
        rotation={0}
        scale={1.1}
        delay={1.0}
        popInterval={2500}
        randomPosition={true}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <VideoThumbnail
        title="Earthquake aftermath in Turkey - rescue efforts continue"
        imageSrc={"https://i.ytimg.com/vi/PDAndLrvzfk/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhjIGMoYzAP&rs=AOn4CLC3tbqVA7ZYbctl8na0Ag0s43ytaQ"}
        platform="tiktok"
        likes="12.1K"
        comments="892"
        shares="234"
        rotation={0}
        scale={0.85}
        delay={1.5}
        popInterval={4000}
        randomPosition={true}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <VideoThumbnail
        title="Hurricane damage in Florida - power outages widespread"
        imageSrc={"https://i.ytimg.com/vi/xhGrVh2nDwI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDy9WSrh0E9rZt1vyi4N2hxBEUCvw"}
        platform="twitter"
        likes="8.9K"
        comments="445"
        shares="123"
        rotation={0}
        scale={1.05}
        delay={2.0}
        popInterval={3500}
        randomPosition={true}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <VideoThumbnail
        title="Drought crisis in Africa - crops failing"
        imageSrc={"https://i.ytimg.com/vi/obdmn6eWMF4/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB1AaAAuADigIMCAAQARhyIEcoNzAP&rs=AOn4CLCJtQHWKe3HVGmPTC3Prws3GO9SVQ"}
        platform="instagram"
        likes="3.2K"
        comments="178"
        shares="45"
        rotation={0}
        scale={0.95}
        delay={2.5}
        popInterval={2800}
        randomPosition={true}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <VideoThumbnail
        title="Volcanic eruption in Iceland - ash cloud spreading"
        imageSrc={"https://i.ytimg.com/vi/L4qDgsyFw7M/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBNKKS52XRF0lygEOLW5pas6qVL7g"}
        platform="tiktok"
        likes="15.6K"
        comments="1.2K"
        shares="456"
        rotation={0}
        scale={1.0}
        delay={3.0}
        popInterval={3200}
        randomPosition={true}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      {/* Additional pop-up videos */}
      <VideoThumbnail
        title="Heatwave hits Europe - record temperatures"
        imageSrc={"https://i.ytimg.com/vi/OUJiTZtIlR4/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFMoQDAP&rs=AOn4CLDKlG2KPVLf8F8oEha2SsAtwFT-ng"}
        platform="twitter"
        likes="4.2K"
        comments="312"
        shares="89"
        rotation={0}
        scale={0.8}
        delay={3.5}
        popInterval={4500}
        randomPosition={true}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <VideoThumbnail
        title="Cyclone devastates Bangladesh coastline"
        imageSrc={"https://i.ytimg.com/vi/foxww-tMoNg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDvFwTa0isVCFQhVMvSS354hNfDVw"}
        platform="instagram"
        likes="7.8K"
        comments="445"
        shares="156"
        rotation={0}
        scale={1.2}
        delay={4.0}
        popInterval={2200}
        randomPosition={true}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <VideoThumbnail
        title="Avalanche buries ski resort in Switzerland"
        imageSrc={"https://i.ytimg.com/vi/Kh0_7tEqePI/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhOIFcoZTAP&rs=AOn4CLCJbvV8EvasWJ_jWiVhyDL0Z155Vg"}
        platform="tiktok"
        likes="9.1K"
        comments="678"
        shares="234"
        rotation={0}
        scale={0.7}
        delay={4.5}
        popInterval={3800}
        randomPosition={true}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <VideoThumbnail
        title="Tsunami warning issued for Japan"
        imageSrc={"https://i.ytimg.com/vi/3618dZoiaPE/hqdefault.jpg?sqp=-oaymwE2COADEI4CSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gSAAuADigIMCAAQARhlIGUoZTAP&rs=AOn4CLAn9JV2hLupVROHxjmg5vsxEKDMNw"}
        platform="twitter"
        likes="11.3K"
        comments="892"
        shares="345"
        rotation={0}
        scale={1.1}
        delay={5.0}
        popInterval={2600}
        randomPosition={true}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      {/* Notification badges */}

   
   
    </div>
  );
}
