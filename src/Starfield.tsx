import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
};

export function Starfield({ starCount = 200 }: { starCount?: number }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate stars once
  const stars = useMemo<Star[]>(() => {
    const starArray: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      starArray.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5, // 0.5 to 2.5px
        opacity: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
        speed: Math.random() * 0.2 + 0.05, // Different speeds for parallax
      });
    }
    return starArray;
  }, [starCount, width, height]);

  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      {stars.map((star, i) => {
        // Gentle movement - stars drift slowly
        const offsetX = Math.sin(frame * 0.01 * star.speed) * 40;
        const offsetY = Math.cos(frame * 0.008 * star.speed) * 30;

        // Slight twinkling effect
        const twinkle = Math.sin(frame * 0.05 + i) * 0.2;

        return (
          <circle
            key={i}
            cx={star.x + offsetX}
            cy={star.y + offsetY}
            r={star.size}
            fill="white"
            opacity={star.opacity + twinkle}
          />
        );
      })}
    </svg>
  );
}
