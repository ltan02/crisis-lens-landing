'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Team data - moved outside component to prevent recreation on every render
const teamMembers = [
  {
    name: "Alethea Kramer",
    role: "Software Developer",
    headshotSrc: "/assets/alethea_kramer.jpg",
    githubUrl: "https://github.com/AletheaKramer",
    linkedinUrl: "https://www.linkedin.com/in/alethea-kramer/"
  },
  {
    name: "Brian Park",
    role: "Software Developer",
    headshotSrc: "/assets/brian_park.jpg",
    githubUrl: "https://github.com/bpbrianpark",
    linkedinUrl: "https://www.linkedin.com/in/bpbrianp"
  },
  {
    name: "Lance Tan",
    role: "Software Developer",
    headshotSrc: "/assets/lance_tan.jpg",
    githubUrl: "https://github.com/ltan02",
    linkedinUrl: "https://www.linkedin.com/in/lancetan02/"
  },
  {
    name: "Eric Zhou",
    role: "Software Developer",
    headshotSrc: "/assets/eric_zhou.jpg",
    githubUrl: "https://github.com/ezhou84",
    linkedinUrl: "https://www.linkedin.com/in/eric-zhou8/"
  }
];

// Team member component
const TeamMember = ({ 
  name, 
  role, 
  headshotSrc, 
  githubUrl, 
  linkedinUrl
}) => {
  return (
    <div 
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-[#FF6B6B]/50 transition-all duration-300 hover:bg-gray-800/70"
    >
      {/* Headshot */}
      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-gray-600">
        <img 
          src={headshotSrc} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Name and Role */}
      <div className="text-center mb-4">
        <h3 className="text-white text-lg font-semibold">{name}</h3>
        <p className="text-[#FF6B6B] text-sm">{role}</p>
      </div>
      
      {/* Social Links */}
      <div className="flex justify-center space-x-4">
        <a 
          href={githubUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <a 
          href={linkedinUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default function TeamPanel() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const gridRef = useRef(null);

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

      // Animate grid simultaneously
      tl.fromTo(gridRef.current?.children || [],
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out"
        },
        "-=0.4"
      );
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
            Meet the{' '}
                <span className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] bg-clip-text text-transparent">
              Team
            </span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            The developers behind CrisisLens
          </p>
        </div>

        {/* Team Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              role={member.role}
              headshotSrc={member.headshotSrc}
              githubUrl={member.githubUrl}
              linkedinUrl={member.linkedinUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
