'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Mobile phone mockup component
const MobilePhone = ({ delay = 0 }) => {
  const phoneRef = useRef(null);

  useEffect(() => {
    if (phoneRef.current) {
      gsap.fromTo(phoneRef.current, 
        { opacity: 0, y: 80, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, delay: delay, ease: "power2.out" }
      );
    }
  }, [delay]);

  return (
    <div 
      ref={phoneRef}
      className="relative mx-auto w-56 h-[28rem] bg-gray-900 rounded-3xl border-4 border-gray-700 shadow-2xl"
    >
      {/* Phone screen */}
      <div className="absolute inset-2 bg-black rounded-2xl overflow-hidden">
        {/* CrisisLens Demo GIF - fills entire screen */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="https://github.com/user-attachments/assets/b7a9422a-fe9b-4cad-b0b4-62629fd76b99"
            alt="CrisisLens Demo"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

// Advantage item component
const AdvantageItem = ({ icon, title, description, delay = 0 }) => {
  const itemRef = useRef(null);

  useEffect(() => {
    if (itemRef.current) {
      gsap.fromTo(itemRef.current, 
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8, delay: delay, ease: "power2.out" }
      );
    }
  }, [delay]);

  return (
    <div 
      ref={itemRef}
      className="flex items-start space-x-2"
    >
      <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-green-400 text-sm">{icon}</span>
      </div>
      <div>
        <h4 className="text-white text-xs font-semibold">{title}</h4>
        <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default function CrisisLensClean() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Animate the entire container
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[500px] overflow-hidden">
      {/* Main content - phone and advantages side by side */}
      <div className="absolute top-8 left-4 right-4 bottom-4 flex gap-4">
        {/* Mobile phone */}
        <div className="flex-shrink-0 flex items-center">
          <MobilePhone delay={0.2} />
        </div>

        {/* Advantages list */}
        <div className="flex-1 space-y-2 flex flex-col justify-center">
          <AdvantageItem
            icon="🔗"
            title="Decentralized Streaming"
            description="Peer-to-peer video sharing"
            delay={0.3}
          />
          <AdvantageItem
            icon="🗺️"
            title="Real-Time Mapping"
            description="Dynamic crisis visualization"
            delay={0.5}
          />
          <AdvantageItem
            icon="🚧"
            title="Road Closures"
            description="Live traffic alerts"
            delay={0.7}
          />
          <AdvantageItem
            icon="🚨"
            title="Emergency Services"
            description="Incident indicators"
            delay={0.9}
          />
          <AdvantageItem
            icon="📱"
            title="Mobile-First Design"
            description="Emergency optimized"
            delay={1.1}
          />
        </div>
      </div>
    </div>
  );
}