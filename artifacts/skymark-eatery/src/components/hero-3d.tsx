import { useRef, useEffect } from "react";

const ITEMS = [
  { emoji: "🍝", x: 12, y: 18, size: 52, dur: 6.2, delay: 0, rotate: 20 },
  { emoji: "🍕", x: 78, y: 12, size: 60, dur: 7.1, delay: 1.2, rotate: -15 },
  { emoji: "🫒", x: 88, y: 55, size: 40, dur: 5.8, delay: 0.4, rotate: 30 },
  { emoji: "🍷", x: 8, y: 65, size: 48, dur: 8.0, delay: 2.1, rotate: -10 },
  { emoji: "🧀", x: 55, y: 8, size: 44, dur: 6.5, delay: 1.7, rotate: 25 },
  { emoji: "🌿", x: 85, y: 80, size: 36, dur: 7.4, delay: 0.8, rotate: -20 },
  { emoji: "🫙", x: 22, y: 80, size: 42, dur: 5.5, delay: 3.0, rotate: 15 },
  { emoji: "🧁", x: 65, y: 82, size: 38, dur: 6.8, delay: 0.5, rotate: -8 },
  { emoji: "🥗", x: 42, y: 78, size: 46, dur: 7.8, delay: 1.5, rotate: 12 },
  { emoji: "🫕", x: 48, y: 15, size: 50, dur: 6.0, delay: 2.5, rotate: -18 },
  { emoji: "🥐", x: 5, y: 40, size: 38, dur: 7.2, delay: 1.0, rotate: 22 },
  { emoji: "☕", x: 92, y: 28, size: 36, dur: 5.9, delay: 2.8, rotate: -12 },
];

const ORBS = [
  { x: 15, y: 20, color: "rgba(26,122,60,0.18)", size: 180, blur: 60, dur: 8 },
  { x: 75, y: 70, color: "rgba(204,34,51,0.15)", size: 220, blur: 80, dur: 10 },
  { x: 50, y: 45, color: "rgba(255,255,255,0.06)", size: 260, blur: 100, dur: 12 },
  { x: 85, y: 15, color: "rgba(26,122,60,0.12)", size: 150, blur: 50, dur: 9 },
  { x: 10, y: 80, color: "rgba(204,34,51,0.1)", size: 140, blur: 60, dur: 11 },
];

export default function Hero3D() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <style>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(var(--r)) scale(1); }
          33% { transform: translateY(-18px) rotate(calc(var(--r) + 8deg)) scale(1.04); }
          66% { transform: translateY(-8px) rotate(calc(var(--r) - 5deg)) scale(0.97); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(var(--r)) scale(1); }
          40% { transform: translateY(-22px) rotate(calc(var(--r) - 10deg)) scale(1.06); }
          70% { transform: translateY(-10px) rotate(calc(var(--r) + 6deg)) scale(0.96); }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        @keyframes shimmer-ring {
          0% { transform: scale(0.95) rotate(0deg); opacity: 0.4; }
          50% { transform: scale(1.05) rotate(180deg); opacity: 0.7; }
          100% { transform: scale(0.95) rotate(360deg); opacity: 0.4; }
        }
      `}</style>

      {/* Glowing orbs */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
            animation: `orb-pulse ${orb.dur}s ease-in-out infinite`,
            animationDelay: `${i * 1.3}s`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Decorative rings */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 700,
        height: 700,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.06)",
        transform: "translate(-50%, -50%)",
        animation: "shimmer-ring 20s linear infinite",
      }} />
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 520,
        height: 520,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.05)",
        transform: "translate(-50%, -50%)",
        animation: "shimmer-ring 15s linear infinite reverse",
      }} />
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 340,
        height: 340,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.04)",
        transform: "translate(-50%, -50%)",
        animation: "shimmer-ring 25s linear infinite",
      }} />

      {/* Floating food items */}
      {ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            lineHeight: 1,
            "--r": `${item.rotate}deg`,
            animation: `float-${i % 2} ${item.dur}s ease-in-out infinite`,
            animationDelay: `${item.delay}s`,
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.25))",
            opacity: 0.55,
            userSelect: "none",
          } as any}
        >
          {item.emoji}
        </div>
      ))}

      {/* Corner accent lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.06 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="url(#lineGrad)" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="url(#lineGrad)" strokeWidth="1" />
      </svg>
    </div>
  );
}
