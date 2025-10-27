'use client';

import Globe from './_components/Globe';

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
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
  );
}
