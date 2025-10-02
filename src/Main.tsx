import { AbsoluteFill, Series } from "remotion";
import { CodeTransition } from "./CodeTransition";
import { StaticCodeSlide } from "./StaticCodeSlide";
import { HighlightedCode } from "codehike/code";
import { ThemeColors, ThemeProvider } from "./calculate-metadata/theme";
import { useMemo } from "react";
import { RefreshOnCodeChange } from "./ReloadOnCodeChange";
import { TextSlide } from "./TextSlide";

export type SequenceStep =
  | { type: "code"; steps: HighlightedCode[]; duration: number }
  | { type: "static-code"; code: HighlightedCode; duration: number }
  | { type: "text"; content: string; duration: number; color?: string };

export type Props = {
  sequences: SequenceStep[] | null;
  themeColors: ThemeColors | null;
  codeWidth: number | null;
  sequenceConfig?: any;
  codeExamples?: any;
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
          <TextSlide content={sequence.content} color={sequence.color} />
        </Series.Sequence>,
      ];
    } else if (sequence.type === "static-code") {
      return [
        <Series.Sequence
          key={`static-code-${seqIndex}`}
          layout="none"
          durationInFrames={sequence.duration}
          name={sequence.code.meta}
        >
          <AbsoluteFill
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StaticCodeSlide code={sequence.code} />
          </AbsoluteFill>
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CodeTransition
              oldCode={steps[stepIndex - 1]}
              newCode={step}
              durationInFrames={transitionDuration}
            />
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
