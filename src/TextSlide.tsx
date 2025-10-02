import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";

export function TextSlide({
  content,
  color = "#ffffff"
}: {
  content: string;
  color?: string;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scale from 1 to 1.1 over the duration of the slide
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.1], {
    extrapolateRight: "clamp",
  });

  const style: React.CSSProperties = useMemo(() => {
    return {
      justifyContent: "center",
      alignItems: "center",
      opacity,
      padding: "0 100px",
    };
  }, [opacity]);

  const textStyle: React.CSSProperties = useMemo(() => {
    return {
      fontSize: 60,
      textAlign: "center",
      fontWeight: 600,
      color,
      transform: `scale(${scale})`,
    };
  }, [color, scale]);

  return (
    <AbsoluteFill style={style}>
      <h1 style={textStyle}>{content}</h1>
    </AbsoluteFill>
  );
}
