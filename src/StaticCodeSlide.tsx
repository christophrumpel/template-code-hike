import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { continueRender, delayRender } from "remotion";
import { Pre, HighlightedCode, AnnotationHandler } from "codehike/code";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";

import {
  getStartingSnapshot,
  TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";
import { callout } from "./annotations/Callout";
import { tokenTransitions } from "./annotations/InlineToken";
import { errorInline, errorMessage } from "./annotations/Error";
import { fontFamily, fontSize, tabSize } from "./font";

export function StaticCodeSlide({
  code,
}: {
  readonly code: HighlightedCode;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const ref = React.useRef<HTMLPreElement>(null);
  const [snapshot, setSnapshot] = useState<TokenTransitionsSnapshot | null>(null);
  const [handle] = React.useState(() => delayRender());

  useEffect(() => {
    if (!snapshot) {
      setSnapshot(getStartingSnapshot(ref.current!));
    }
  }, [snapshot]);

  useLayoutEffect(() => {
    if (snapshot) {
      continueRender(handle);
    }
  }, [snapshot, handle]);

  // Scale from 1 to 1.1 over the duration
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.1], {
    extrapolateRight: "clamp",
  });

  const handlers: AnnotationHandler[] = useMemo(() => {
    return [tokenTransitions, callout, errorInline, errorMessage];
  }, []);

  const style: React.CSSProperties = useMemo(() => {
    return {
      position: "relative",
      fontSize,
      lineHeight: 1.5,
      fontFamily,
      tabSize,
      transform: `scale(${scale})`,
    };
  }, [scale]);

  return <Pre ref={ref} code={code} handlers={handlers} style={style} />;
}
