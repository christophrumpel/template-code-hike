import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { CodeTransition } from "./CodeTransition";
import { HighlightedCode } from "codehike/code";
import { ThemeColors, ThemeProvider } from "./calculate-metadata/theme";
import { useMemo } from "react";
import { RefreshOnCodeChange } from "./ReloadOnCodeChange";
import { verticalPadding } from "./font";
import { TextSlide } from "./TextSlide";

export type SequenceStep =
  | { type: "code"; steps: HighlightedCode[]; duration: number }
  | { type: "text"; content: string; duration: number };

export type Props = {
  sequences: SequenceStep[] | null;
  themeColors: ThemeColors | null;
  codeWidth: number | null;
};

export const Main: React.FC<Props> = ({
  sequences,
  themeColors,
  codeWidth,
}) => {
  if (!sequences) {
    throw new Error("Sequences are not defined");
  }

  if (!themeColors) {
    throw new Error("Theme colors are not defined");
  }

  const outerStyle: React.CSSProperties = useMemo(() => {
    return {
      backgroundColor: themeColors.background,
    };
  }, [themeColors]);

  const style: React.CSSProperties = useMemo(() => {
    return {
      padding: `${verticalPadding}px 0px`,
    };
  }, []);

  const transitionDuration = 30;

  // Flatten sequences into individual series items
  const seriesItems = sequences.flatMap((sequence, seqIndex) => {
    if (sequence.type === "text") {
      return [
        <Series.Sequence
          key={`text-${seqIndex}`}
          layout="none"
          durationInFrames={sequence.duration}
          name={`Text: ${sequence.content.substring(0, 20)}...`}
        >
          <TextSlide content={sequence.content} />
        </Series.Sequence>,
      ];
    } else {
      const steps = sequence.steps;
      const stepDuration = sequence.duration / steps.length;

      return steps.map((step, stepIndex) => (
        <Series.Sequence
          key={`code-${seqIndex}-${stepIndex}`}
          layout="none"
          durationInFrames={stepDuration}
          name={step.meta}
        >
          <AbsoluteFill
            style={{
              width: codeWidth || "100%",
              margin: "auto",
            }}
          >
            <AbsoluteFill style={style}>
              <CodeTransition
                oldCode={steps[stepIndex - 1]}
                newCode={step}
                durationInFrames={transitionDuration}
              />
            </AbsoluteFill>
          </AbsoluteFill>
        </Series.Sequence>
      ));
    }
  });

  return (
    <ThemeProvider themeColors={themeColors}>
      <AbsoluteFill style={outerStyle}>
        <Series>{seriesItems}</Series>
      </AbsoluteFill>
      <RefreshOnCodeChange />
    </ThemeProvider>
  );
};
