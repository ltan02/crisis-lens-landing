'use client';

export default function DisasterOverlay({ visibleCount }) {
  return (
    <div className="fixed top-6 left-6 z-40">
      <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h3 className="text-white text-sm font-bold">LIVE DISASTERS</h3>
          </div>
          <div className="bg-white/5 rounded-lg px-3 py-1">
            <span className="text-red-400 text-sm font-bold">{visibleCount}</span>
            <span className="text-white/50 text-xs ml-1">showing</span>
          </div>
        </div>
      </div>
    </div>
  );
}

