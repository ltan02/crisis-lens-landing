'use client';

import Globe from './_components/Globe';
import ComparisonPanel from './_components/ComparisonPanel';
import TeamPanel from './_components/TeamPanel';

export default function Home() {
  return (
    <div className="relative w-full bg-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/assets/CrisisLens.png" 
              alt="CrisisLens" 
              className="h-8 w-auto"
            />
          </div>
          <a 
            href="https://crisislens.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-[#FF6B6B] hover:from-blue-700 hover:to-[#FF5555] text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <span>Go</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </div>
      </header>

      {/* Hero Section with Globe */}
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 items-center justify-items-center gap-8 md:gap-12 px-8 md:px-16">
          {/* Left text column */}
          <div className="z-10 max-w-xl text-center md:text-left justify-self-center md:justify-self-start">
            <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight">CrisisLens</h1>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              See crisis unfold in real-time — from the people living it.
            </p>
          </div>

          {/* Right globe column */}
          <div className="relative h-[90vh] md:h-[95vh] aspect-square">
            <Globe />
          </div>
        </div>
      </div>

      {/* Comparison Panel Section */}
      <ComparisonPanel />

      {/* Team Panel Section */}
      <TeamPanel />
    </div>
  );
}
