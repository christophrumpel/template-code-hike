import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIGURATION - Edit this to change video!
// ============================================

// Optional: Provide code examples directly (instead of reading from files)
const codeExamples = {
  "example1": {
    lang: "php",
    code: `<?php
class User {
    public string $name;
    public string $email;

    public function __construct(string $name, string $email) {
        $this->name = $name;
        $this->email = $email;
    }
}`
  },
  "example2": {
    lang: "php",
    code: `<?php
class User {
    public function __construct(
        public string $name,
        public string $email,
    ) {}
}`
  }
};

const sequence = [
  { type: "text", content: "Test", duration: 60, color: "#fff" },
  // Option 1: Use files from public/ (like before)
  // { type: "code", files: ["code2.php", "code3.php"] },

  // Option 2: Use code examples provided above
  { type: "code", examples: ["example1", "example2"] },

  { type: "text", content: "Test 2", duration: 60, color: "#fff" },

  // Can mix both approaches
  { type: "static-code", file: "code5.php", duration: 90 },
];

const OUTPUT_PATH = path.join(__dirname, "output", "video.mp4");
const THEME = "dracula";
const SCALE = 2; // 1 = 1080p (1920x1080), 2 = 4K (3840x2160)

// ============================================
// Render Logic
// ============================================

async function renderVideo() {
  console.log("🎬 Starting video render...\n");

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("📦 Bundling Remotion project...");
  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, "src", "index.ts"),
    webpackOverride: (config) => config,
  });

  console.log("✅ Bundle created\n");

  console.log("🔍 Getting composition...");
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "Main",
    inputProps: {
      sequenceConfig: sequence,
      codeExamples: codeExamples,
      theme: THEME,
    },
  });

  console.log(`✅ Composition found: ${composition.width}x${composition.height}, ${composition.durationInFrames} frames\n`);

  console.log("🎥 Rendering video...");
  console.log(`Output: ${OUTPUT_PATH}\n`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: OUTPUT_PATH,
    scale: SCALE,
    inputProps: {
      sequenceConfig: sequence,
      codeExamples: codeExamples,
      theme: THEME,
    },
    onProgress: ({ progress }) => {
      process.stdout.write(`\rProgress: ${(progress * 100).toFixed(1)}%`);
    },
  });

  console.log("\n\n✨ Video rendered successfully!");
  console.log(`📁 Location: ${OUTPUT_PATH}`);
}

// Run it
renderVideo().catch((err) => {
  console.error("❌ Error rendering video:", err);
  process.exit(1);
});
