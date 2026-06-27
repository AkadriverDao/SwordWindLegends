import React from "react";

const cartoonEmojis = [
  "🎨",
  "✨",
  "🌟",
  "💫",
  "🎭",
  "🎪",
  "🎈",
  "🎀",
  "🌈",
  "🦄",
];

// Generate deterministic pseudo-random values from a seed
function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function CartoonAnimation() {
  const elements = Array.from({ length: 15 }, (_, i) => {
    const seed = i + 1;
    const x = seededRandom(seed * 1.1) * 100; // 0-100%
    const y = seededRandom(seed * 2.2) * 100; // 0-100%
    const size = seededRandom(seed * 3.3) * 20 + 15; // 15-35px
    const opacity = seededRandom(seed * 4.4) * 0.3 + 0.2; // 0.2-0.5
    const emoji =
      cartoonEmojis[
        Math.floor(seededRandom(seed * 5.5) * cartoonEmojis.length)
      ];
    const duration = seededRandom(seed * 6.6) * 10 + 15; // 15-25s
    const delay = seededRandom(seed * 7.7) * -20; // -20 to 0s
    const driftX = (seededRandom(seed * 8.8) - 0.5) * 60; // -30 to 30px
    const driftY = (seededRandom(seed * 9.9) - 0.5) * 40 - 80; // -100 to -60px net upward
    const rotateStart = (seededRandom(seed * 10.1) - 0.5) * 30; // -15 to 15deg
    const rotateEnd = (seededRandom(seed * 11.2) - 0.5) * 30; // -15 to 15deg

    return {
      id: i,
      x,
      y,
      size,
      opacity,
      emoji,
      duration,
      delay,
      driftX,
      driftY,
      rotateStart,
      rotateEnd,
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute cartoon-float"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}px`,
            opacity: el.opacity,
            ["--cartoon-drift-x" as string]: `${el.driftX}px`,
            ["--cartoon-drift-y" as string]: `${el.driftY}px`,
            ["--cartoon-rotate-start" as string]: `${el.rotateStart}deg`,
            ["--cartoon-rotate-end" as string]: `${el.rotateEnd}deg`,
            animationDuration: `${el.duration}s`,
            animationDelay: `${el.delay}s`,
          }}
        >
          {el.emoji}
        </div>
      ))}
    </div>
  );
}
