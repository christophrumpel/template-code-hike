# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Remotion-based video project for creating animated code presentations using Code Hike. It generates videos that show code transitions, static code slides, and text slides with background music and visual effects.

## Key Commands

- **Development**: `npm run dev` - Start Remotion Studio for live preview
- **Build**: `npm run build` - Bundle the project for production
- **Render**: `npx remotion render` - Render the video composition to file
- **Type checking**: `npx tsc` - Run TypeScript compiler for type checking
- **Lint**: `npm run lint` - Run TypeScript compiler and ESLint

## Architecture

### Video Composition Flow

1. **Entry Point**: `src/Root.tsx` defines the Remotion composition with `id="Main"`
2. **Metadata Calculation**: `src/calculate-metadata/calculate-metadata.tsx` runs before rendering to:
   - Load code snippets from the `public/` directory
   - Process code highlighting using Code Hike
   - Calculate video dimensions based on code width
   - Build sequence timeline from `sequence-config.ts`
3. **Main Component**: `src/Main.tsx` renders the video using the processed sequences
4. **Sequence Types**: The video supports three types of content:
   - `code`: Animated transitions between code states (uses `CodeTransition.tsx`)
   - `static-code`: Static code display without transitions (uses `StaticCodeSlide.tsx`)
   - `text`: Text slides between code animations (uses `TextSlide.tsx`)

### Code Snippets

- Code snippets are stored in the `public/` directory as individual files
- The `sequence-config.ts` file defines which snippets to show and in what order
- Snippets can also be provided programmatically via the `codeExamples` prop

### Sequence Configuration

Edit `src/sequence-config.ts` to control the video flow:
- Reference files by name (e.g., `file: 'code5.php'`)
- Set durations for static slides and text
- Define color for text slides
- Chain code files for animated transitions (e.g., `files: ['code2.php', 'code3.php']`)

### Code Transitions

`src/CodeTransition.tsx` handles smooth animations between code states using:
- Code Hike's `calculateTransitions` for token-level animations
- Remotion's interpolation and easing functions
- Custom annotation handlers (callout, error markers, token transitions)

### Annotations

Custom Code Hike annotations are in `src/annotations/`:
- `Callout.tsx`: Highlight important code sections
- `Error.tsx`: Show error messages and inline error markers
- `InlineToken.tsx`: Handle token-level transitions

### Theme

- Theme colors are managed via `src/calculate-metadata/theme.tsx`
- Theme is set via the composition's `theme` prop (default: "dracula")
- Colors are extracted using Code Hike's `getThemeColors`

## Video Configuration

- **FPS**: 30 (set in `src/Root.tsx`)
- **Height**: 1080px (fixed)
- **Width**: Auto-calculated based on code width, minimum 1920px for 16:9 aspect ratio
- **Default durations**: 90 frames for code steps, 60 frames for text slides
- **Transition duration**: 30 frames (hardcoded in `src/Main.tsx`)
