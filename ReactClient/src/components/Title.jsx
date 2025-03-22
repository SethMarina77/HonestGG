import React, { useState, useEffect } from "react";

const GlitchedTitle = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [glitchIntensity, setGlitchIntensity] = useState(1);

  const letters = "Honest.GG".split("");

  // Purple/pink color palette
  const colors = [
    "text-purple-600",
    "text-purple-400",
    "text-pink-500",
    "text-fuchsia-500",
    "text-violet-500",
    "text-indigo-400",
  ];

  // Random glitch offset with intensity
  const getRandomOffset = (intensity = 1) => {
    const base = Math.random() > 0.5 ? 1 : -1;
    const magnitude = Math.random() * 3 * intensity;
    return `${base * magnitude}px`;
  };

  // Aggressive glitch animation
  useEffect(() => {
    if (hoveredIndex !== null) {
      const interval = setInterval(() => {
        setGlitchIntensity(Math.random() * 3 + 1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [hoveredIndex]);

  return (
    <div className="flex justify-center items-center min-h-64 p-8">
      <div className="relative">
        <h1
          className="text-8xl font-bold tracking-tight flex"
          style={{
            fontFamily: "'Press Start 2P', 'VT323', 'Silkscreen', monospace", 
            letterSpacing: "0.02em",
          }}
        >
          {letters.map((letter, index) => {
            const isHovered = hoveredIndex === index;
            const randomColor =
              colors[Math.floor(Math.random() * colors.length)];

            return (
              <span
                key={index}
                className={`relative transition-all duration-100 ${
                  isHovered ? "text-white" : randomColor
                }`}
                style={{
                  textShadow: isHovered
                    ? `
                      ${getRandomOffset(glitchIntensity)} ${getRandomOffset(
                        glitchIntensity
                      )} 0px #ff00ff,
                      ${getRandomOffset(glitchIntensity)} ${getRandomOffset(
                        glitchIntensity
                      )} 0px #00ffff,
                      0 0 8px rgba(255,0,255,0.8)
                    `
                    : `
                      0 0 5px #ff00ff,
                      0 0 10px rgba(153, 0, 255, 0.5)
                    `,
                  transform: isHovered
                    ? `translate(${getRandomOffset(
                        glitchIntensity
                      )}, ${getRandomOffset(
                        glitchIntensity
                      )}) skew(${getRandomOffset(0.5)})`
                    : "none",
                  transition: "all 50ms linear",
                  filter: isHovered
                    ? `hue-rotate(${Math.random() * 30}deg)`
                    : "none",
                  display: "inline-block", // Ensures proper spacing for pixel fonts
                  imageRendering: "pixelated", // Enhance pixel appearance when scaled
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {letter}

                {/* Multiple glitch layers on hover - keeping only the text effects */}
                {isHovered && (
                  <>
                    <span
                      className="absolute left-0 top-0 opacity-80 text-pink-500"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)",
                        transform: `translateX(${getRandomOffset(
                          glitchIntensity
                        )})`,
                        mixBlendMode: "screen",
                      }}
                    >
                      {letter}
                    </span>
                    <span
                      className="absolute left-0 top-0 opacity-80 text-purple-400"
                      style={{
                        clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)",
                        transform: `translateX(${getRandomOffset(
                          glitchIntensity * -0.5
                        )})`,
                        mixBlendMode: "screen",
                      }}
                    >
                      {letter}
                    </span>
                    <span
                      className="absolute left-0 top-0 opacity-60 text-blue-500 animate-pulse"
                      style={{
                        transform: `translate(${getRandomOffset(
                          glitchIntensity
                        )}, ${getRandomOffset(glitchIntensity)})`,
                        mixBlendMode: "screen",
                      }}
                    >
                      {letter}
                    </span>
                  </>
                )}
              </span>
            );
          })}
        </h1>

        
      </div>
    </div>
  );
};

export default GlitchedTitle;
