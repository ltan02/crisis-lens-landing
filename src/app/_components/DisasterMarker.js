'use client';

export default function DisasterMarker({ disaster, position, visible }) {
  const categoryStyles = {
    'Wildfires': { emoji: '🔥', color: 'bg-red-500', ring: 'ring-red-500' },
    'Earthquakes': { emoji: '🌍', color: 'bg-yellow-500', ring: 'ring-yellow-500' },
    'Severe Storms': { emoji: '🌪️', color: 'bg-blue-500', ring: 'ring-blue-500' },
    'Floods': { emoji: '🌊', color: 'bg-cyan-500', ring: 'ring-cyan-500' },
    'Volcanoes': { emoji: '🌋', color: 'bg-orange-600', ring: 'ring-orange-600' },
    'Drought': { emoji: '🏜️', color: 'bg-yellow-600', ring: 'ring-yellow-600' },
    'Default': { emoji: '⚠️', color: 'bg-gray-500', ring: 'ring-gray-500' }
  };

  const style = categoryStyles[disaster.category] || categoryStyles.Default;

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-1000 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        animation: 'slideIn 0.5s ease-out'
      }}
    >
      {/* Popup card */}
      <div className="bg-black/90 backdrop-blur-sm border-2 rounded-xl px-6 py-4 shadow-2xl" 
           style={{ borderColor: style.color.replace('bg-', '#') }}>
        <div className="flex items-center gap-3">
          {/* Pulsing icon */}
          <div className="relative">
            <div className={`absolute inset-0 ${style.color} rounded-full animate-ping opacity-75`} />
            <div className={`relative ${style.color} rounded-full p-3 shadow-lg`}>
              <span className="text-3xl">{style.emoji}</span>
            </div>
          </div>
          
          {/* Text content */}
          <div>
            <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">
              {disaster.region}
            </div>
            <div className="text-white text-base font-bold">
              {disaster.title}
            </div>
            <div className={`text-xs font-semibold mt-1 ${style.color.replace('bg-', 'text-')}`}>
              {disaster.category}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

