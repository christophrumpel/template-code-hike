import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useMemo } from "react";

export function TextSlide({ content }: { content: string }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
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
    };
  }, []);

  return (
    <AbsoluteFill style={style}>
      <h1 style={textStyle}>{content}</h1>
    </AbsoluteFill>
  );
}
