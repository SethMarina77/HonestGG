import React, { useState, useEffect } from "react";

const GlitchyButton = ({ text = "ANALYZE", onClick }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(1);
  const [randomGlitch, setRandomGlitch] = useState(false);

  // Purple/pink color palette matching the title
  const colors = [
    "#9333ea", // purple-600
    "#c084fc", // purple-400
    "#ec4899", // pink-500
    "#d946ef", // fuchsia-500
    "#8b5cf6", // violet-500
    "#818cf8", // indigo-400
  ];

  // Random glitch offset
  const getRandomOffset = (intensity = 1) => {
    const base = Math.random() > 0.5 ? 1 : -1;
    const magnitude = Math.random() * 2 * intensity;
    return `${base * magnitude}px`;
  };

  // Random occasional glitches
  useEffect(() => {
    const randomGlitchInterval = setInterval(() => {
      const shouldGlitch = Math.random() > 0.7;
      if (shouldGlitch && !isGlitching) {
        setRandomGlitch(true);
        setTimeout(() => setRandomGlitch(false), 300);
      }
    }, 2000);

    return () => clearInterval(randomGlitchInterval);
  }, [isGlitching]);

  // Update glitch intensity during glitching
  useEffect(() => {
    if (isGlitching || randomGlitch) {
      const interval = setInterval(() => {
        setGlitchIntensity(Math.random() * 2 + 1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isGlitching, randomGlitch]);

  return (
    <button
      className={`relative px-6 py-3 rounded-sm font-bold text-xl overflow-hidden cursor-pointer`}
      style={{
        cursor: "pointer",
        fontFamily: "'Press Start 2P', 'VT323', 'Silkscreen', monospace",
        backgroundColor: "#2a0e4a",
        boxShadow: `0 0 10px ${
          colors[Math.floor(Math.random() * colors.length)]
        }`,
        transition: "all 0.2s ease",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsGlitching(true)}
      onMouseLeave={() => setIsGlitching(false)}
    >
      {/* Button background with glitch effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: "#2a0e4a",
          boxShadow: `inset 0 0 20px rgba(216, 180, 254, 0.3)`,
          opacity: 0.9,
          ...(isGlitching || randomGlitch
            ? {
                backgroundImage: `
                  linear-gradient(
                    ${Math.random() * 360}deg,
                    rgba(139, 92, 246, 0.1) 0%,
                    rgba(217, 70, 239, 0.1) 100%
                  )
                `,
              }
            : {}),
        }}
      />

      {/* Glitch layers */}
      {(isGlitching || randomGlitch) && (
        <>
          <div
            className="absolute inset-0 opacity-70"
            style={{
              clipPath: "polygon(0 30%, 100% 15%, 100% 65%, 0 80%)",
              transform: `translateX(${getRandomOffset(glitchIntensity)})`,
              backgroundColor:
                colors[Math.floor(Math.random() * colors.length)],
              mixBlendMode: "screen",
            }}
          />
          <div
            className="absolute inset-0 opacity-70"
            style={{
              clipPath: "polygon(0 10%, 100% 25%, 100% 40%, 0 50%)",
              transform: `translateX(${getRandomOffset(
                glitchIntensity * -0.5
              )})`,
              backgroundColor:
                colors[Math.floor(Math.random() * colors.length)],
              mixBlendMode: "screen",
            }}
          />
        </>
      )}

      {/* Button text with glitch effect */}
      <span
        className="relative z-10 inline-block text-white"
        style={{
          textShadow: `
            ${getRandomOffset(0.5)} ${getRandomOffset(0.5)} 0px #ff00ff,
            ${getRandomOffset(0.5)} ${getRandomOffset(0.5)} 0px #00ffff
          `,
          ...(isGlitching || randomGlitch
            ? {
                transform: `translate(${getRandomOffset(
                  glitchIntensity * 0.3
                )}, ${getRandomOffset(glitchIntensity * 0.3)})`,
                filter: `hue-rotate(${Math.random() * 30}deg)`,
              }
            : {}),
        }}
      >
        {text.split("").map((char, index) => (
          <span
            key={index}
            style={{
              display: "inline-block",
              transform:
                isGlitching || randomGlitch
                  ? `translateY(${
                      Math.random() > 0.7
                        ? getRandomOffset(glitchIntensity * 0.5)
                        : "0px"
                    })`
                  : "none",
            }}
          >
            {char}
          </span>
        ))}
      </span>

      {/* Border effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `2px solid ${
            colors[Math.floor(Math.random() * colors.length)]
          }`,
          opacity: 0.6,
          ...(isGlitching || randomGlitch
            ? {
                transform: `translate(${getRandomOffset(
                  glitchIntensity * 0.4
                )}, ${getRandomOffset(glitchIntensity * 0.4)})`,
              }
            : {}),
        }}
      />
    </button>
  );
};

export default GlitchyButton;
