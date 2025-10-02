import { z } from "zod";
import { CalculateMetadataFunction } from "remotion";
import { getThemeColors } from "@code-hike/lighter";
import { Props, SequenceStep } from "../Main";
import { schema } from "./schema";
import { processSnippet } from "./process-snippet";
import { getFiles } from "./get-files";
import { measureText } from "@remotion/layout-utils";
import {
  fontFamily,
  fontSize,
  horizontalPadding,
  tabSize,
  waitUntilDone,
} from "../font";
import { HighlightedCode } from "codehike/code";
import { sequence as defaultSequence } from "../sequence-config";

export const calculateMetadata: CalculateMetadataFunction<
  Props & z.infer<typeof schema>
> = async ({ props }) => {
  // Use sequenceConfig from props if provided, otherwise use default
  const sequence = props.sequenceConfig || defaultSequence;

  // Use codeExamples from props if provided
  const providedCodeExamples = props.codeExamples || {};

  const contents = await getFiles();

  await waitUntilDone();
  const widthPerCharacter = measureText({
    text: "A",
    fontFamily,
    fontSize,
    validateFontIsLoaded: true,
  }).width;

  const maxCharacters = Math.max(
    ...contents
      .filter(({ value }) => value && value.trim().length > 0)
      .map(({ value }) => value.split("\n"))
      .flat()
      .map((value) => value.replaceAll("\t", " ".repeat(tabSize)).length)
      .flat(),
    0, // Fallback to 0 if no content
  );
  const codeWidth = widthPerCharacter * maxCharacters;

  const defaultStepDuration = 90;
  const defaultTextDuration = 60;

  const themeColors = await getThemeColors(props.theme);

  // Process all code files (skip empty files)
  const allCodeSnippets: Map<string, HighlightedCode> = new Map();

  // Process files from public/ directory
  for (const snippet of contents) {
    if (snippet.value && snippet.value.trim().length > 0) {
      const processed = await processSnippet(snippet, props.theme);
      allCodeSnippets.set(snippet.name, processed);
    }
  }

  // Process code examples provided via props
  for (const [id, example] of Object.entries(providedCodeExamples)) {
    const exampleData = example as { code: string; lang: string };
    const processed = await processSnippet(
      { name: id + "." + exampleData.lang, value: exampleData.code },
      props.theme
    );
    allCodeSnippets.set(id, processed);
  }

  // Build sequences based on configuration
  const sequences: SequenceStep[] = [];
  let totalDuration = 0;

  for (const item of sequence) {
    if (item.type === "text") {
      const duration = item.duration || defaultTextDuration;
      sequences.push({
        type: "text",
        content: item.content,
        duration,
        color: item.color,
      });
      totalDuration += duration;
    } else if (item.type === "static-code") {
      const code = allCodeSnippets.get(item.file);
      if (code) {
        const duration = item.duration || defaultStepDuration;
        sequences.push({
          type: "static-code",
          code,
          duration,
        });
        totalDuration += duration;
      }
    } else {
      // Code sequence
      const steps: HighlightedCode[] = [];

      // Support both 'files' (from file system) and 'examples' (from props)
      const identifiers = item.files || item.examples || [];

      for (const identifier of identifiers) {
        const code = allCodeSnippets.get(identifier);
        if (code) {
          steps.push(code);
        }
      }
      const duration = steps.length * defaultStepDuration;
      sequences.push({
        type: "code",
        steps,
        duration,
      });
      totalDuration += duration;
    }
  }

  const naturalWidth = codeWidth + horizontalPadding * 2;
  const divisibleByTwo = Math.ceil(naturalWidth / 2) * 2; // MP4 requires an even width

  const minimumWidth = props.width.type === "fixed" ? 0 : 1920; // 16:9 aspect ratio (1920x1080)
  const minimumWidthApplied = Math.max(minimumWidth, divisibleByTwo);

  return {
    durationInFrames: totalDuration,
    width:
      props.width.type === "fixed"
        ? Math.max(minimumWidthApplied, props.width.value)
        : minimumWidthApplied,
    props: {
      theme: props.theme,
      width: props.width,
      sequences,
      themeColors,
      codeWidth,
    },
  };
};
