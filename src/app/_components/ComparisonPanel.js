'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
import SocialMediaChaos from './SocialMediaChaos';
import CrisisLensClean from './CrisisLensClean';

export default function ComparisonPanel() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);
  const dividerRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      // Create timeline for coordinated animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate headline first
      tl.fromTo(headlineRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Animate divider
      tl.fromTo(dividerRef.current,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

      // Animate columns with stagger
      tl.fromTo([leftColumnRef.current, rightColumnRef.current],
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out",
          stagger: 0.2
        },
        "-=0.3"
      );

      // Add subtle hover animations
      const leftCard = leftColumnRef.current?.querySelector('.comparison-card');
      const rightCard = rightColumnRef.current?.querySelector('.comparison-card');

      if (leftCard) {
        leftCard.addEventListener('mouseenter', () => {
          gsap.to(leftCard, { scale: 1.02, duration: 0.3, ease: "power2.out" });
        });
        leftCard.addEventListener('mouseleave', () => {
          gsap.to(leftCard, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
      }

      if (rightCard) {
        rightCard.addEventListener('mouseenter', () => {
          gsap.to(rightCard, { scale: 1.02, duration: 0.3, ease: "power2.out" });
        });
        rightCard.addEventListener('mouseleave', () => {
          gsap.to(rightCard, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
      }
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full py-20 bg-black"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        {/* Headline */}
        <div ref={headlineRef} className="text-center mb-16">
          <h2 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            From Chaos to{' '}
                <span className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] bg-clip-text text-transparent">
              Clarity
            </span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            While social media platforms face censorship and policy changes, 
            CrisisLens offers decentralized, peer-to-peer video streaming for authentic crisis reporting.
          </p>
        </div>

        {/* Divider */}
        <div 
          ref={dividerRef}
          className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-16"
        ></div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Social Media Chaos */}
          <div ref={leftColumnRef} className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-white text-2xl font-bold mb-3">
                Social Media
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Centralized platforms with censorship policies, 
                algorithm manipulation, and content restrictions during critical moments.
              </p>
            </div>
            
            <div className="comparison-card transition-transform duration-300">
              <SocialMediaChaos />
            </div>

          </div>

          {/* Right Side - CrisisLens Clean */}
          <div ref={rightColumnRef} className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-white text-2xl font-bold mb-3">
                CrisisLens
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Decentralized peer-to-peer video streaming with real-time mapping, 
                mobile-first design, and authentic crisis reporting.
              </p>
            </div>
            
            <div className="comparison-card transition-transform duration-300">
              <CrisisLensClean />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
