import React, { useState, useEffect } from "react";

const GlitchyLoader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [glitchIntensity, setGlitchIntensity] = useState(1);

  // Text elements to glitch through
  const loadingTexts = [
    "SCANNING DATABASE",
    "CHECKING MATCH HISTORY",
    "ANALYZING PERFORMANCE",
    "EVALUATING TOXICITY",
    "LOADING PROFILE",
  ];

  // Random glitch offset
  const getRandomOffset = (intensity = 1) => {
    const base = Math.random() > 0.5 ? 1 : -1;
    const magnitude = Math.random() * 3 * intensity;
    return `${base * magnitude}px`;
  };

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (Math.random() * 15 + 5);
        return next >= 100 ? 100 : next;
      });
      setGlitchIntensity(Math.random() * 2 + 1);
    }, 50);

    // Complete after exactly 1 second regardless of progress
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      if (onLoadComplete) onLoadComplete();
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onLoadComplete]);

  // Determine which loading text to show based on progress
  const textIndex = Math.min(
    Math.floor((progress / 100) * loadingTexts.length),
    loadingTexts.length - 1
  );

  return (
    <div className="w-full space-y-2">
      {/* Current operation text */}
      <div className="text-center relative">
        <span
          className="inline-block font-mono text-cyan-400 text-opacity-80"
          style={{
            fontFamily: "'VT323', 'Silkscreen', monospace",
            textShadow: `
              ${getRandomOffset(glitchIntensity * 0.3)} ${getRandomOffset(
              glitchIntensity * 0.3
            )} 0px #ff00ff,
              ${getRandomOffset(glitchIntensity * 0.3)} ${getRandomOffset(
              glitchIntensity * 0.3
            )} 0px #00ffff
            `,
            transform: `translate(${getRandomOffset(
              glitchIntensity * 0.2
            )}, ${getRandomOffset(glitchIntensity * 0.2)})`,
          }}
        >
          {loadingTexts[textIndex]}
        </span>

        {/* Glitch artifacts that randomly appear */}
        {Math.random() > 0.7 && (
          <span
            className="absolute top-0 left-0 w-full text-center text-pink-500 opacity-70 font-mono"
            style={{
              fontFamily: "'VT323', 'Silkscreen', monospace",
              transform: `translateX(${getRandomOffset(glitchIntensity)})`,
              clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)",
            }}
          >
            {loadingTexts[Math.floor(Math.random() * loadingTexts.length)]}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-neutral-700 h-2 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-cyan-400"
          style={{
            width: `${progress}%`,
            transition: "width 0.05s ease-out",
          }}
        />

        {/* Glitch elements on the progress bar */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-full"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}%`,
              backgroundColor: Math.random() > 0.5 ? "#ec4899" : "#06b6d4",
              opacity: 0.7,
              transform: `translateX(${getRandomOffset(glitchIntensity)})`,
              mixBlendMode: "screen",
            }}
          />
        ))}
      </div>

      {/* Progress percentage with glitch effect */}
      <div className="text-right">
        <span
          className="font-mono text-sm text-gray-400"
          style={{
            fontFamily: "'VT323', 'Silkscreen', monospace",
            textShadow: Math.random() > 0.8 ? "0 0 5px #ec4899" : "none",
          }}
        >
          {Math.floor(progress)}%
        </span>
      </div>
    </div>
  );
};

export default GlitchyLoader;
