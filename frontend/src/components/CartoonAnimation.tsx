import React, { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
  emoji: string;
}

const cartoonEmojis = ['🎨', '✨', '🌟', '💫', '🎭', '🎪', '🎈', '🎀', '🌈', '🦄'];

export default function CartoonAnimation() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Create initial floating elements
    const initialElements: FloatingElement[] = [];
    for (let i = 0; i < 15; i++) {
      initialElements.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 20 + 15,
        speed: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.3 + 0.2,
        drift: Math.random() * 1 - 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        emoji: cartoonEmojis[Math.floor(Math.random() * cartoonEmojis.length)],
      });
    }
    setElements(initialElements);

    const animateElements = () => {
      setElements(prev => 
        prev.map(element => ({
          ...element,
          y: element.y > window.innerHeight + 50 ? -50 : element.y + element.speed,
          x: element.x + element.drift * 0.2,
          rotation: element.rotation + element.rotationSpeed,
        }))
      );
    };

    const interval = setInterval(animateElements, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {elements.map(element => (
        <div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            fontSize: `${element.size}px`,
            opacity: element.opacity,
            transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
            transition: 'transform 0.08s linear',
          }}
        >
          {element.emoji}
        </div>
      ))}
    </div>
  );
}
