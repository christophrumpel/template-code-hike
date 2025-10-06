import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";

export function IntroSlide() {
  const frame = useCurrentFrame();

  // Fade in over first 20 frames
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scale up with elastic easing
  const scale = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  // Subtle continuous pulse after initial animation
  const pulse = interpolate(
    frame,
    [40, 80, 120],
    [1, 1.02, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  // Glow intensity
  const glowIntensity = interpolate(
    frame,
    [0, 40, 80],
    [0, 20, 15],
    {
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <h1
        style={{
          fontSize: 180,
          fontWeight: 900,
          color: "#ffffff",
          textAlign: "center",
          transform: `scale(${scale * pulse})`,
          textShadow: `
            0 0 ${glowIntensity}px rgba(255, 255, 255, 0.8),
            0 0 ${glowIntensity * 2}px rgba(255, 255, 255, 0.6),
            0 0 ${glowIntensity * 3}px rgba(255, 255, 255, 0.4),
            0 10px 30px rgba(0, 0, 0, 0.5)
          `,
          letterSpacing: "0.05em",
        }}
      >
        What If
      </h1>
    </AbsoluteFill>
  );
}
