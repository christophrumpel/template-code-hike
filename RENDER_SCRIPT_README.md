# Programmatic Video Rendering

## Quick Start

1. Edit the sequence in `render-video.js`:

```javascript
const sequence = [
  { type: "text", content: "My Title", duration: 60, color: "#fff" },
  { type: "code", files: ["code2.php", "code3.php"] },
  { type: "static-code", file: "code5.php", duration: 90 },
];
```

2. Run the script:

```bash
node render-video.js
```

3. Find your video in `output/video.mp4`

## How It Works

- **Code files stay in `public/`** - No need to modify them
- **Sequence is defined in the script** - Easy to reorder, add, remove
- **Output goes to `output/` directory** - Ignored by git

## Sequence Types

### Text Slide
```javascript
{
  type: "text",
  content: "Hello World",
  duration: 60,      // frames (optional, default: 60)
  color: "#00ff00"   // hex color (optional, default: "#ffffff")
}
```

### Code Transition
```javascript
{
  type: "code",
  files: ["code1.php", "code2.php", "code3.php"]  // Transitions between these
}
```

### Static Code (with zoom)
```javascript
{
  type: "static-code",
  file: "code5.php",
  duration: 90  // optional, default: 90
}
```

## For Laravel Integration

From your Laravel app, you can:

```php
// 1. Write code files to public/
file_put_contents(
    '/path/to/remotion-app/public/my-code.php',
    $codeContent
);

// 2. Create a sequence JSON
$sequence = [
    ['type' => 'text', 'content' => 'Feature Demo'],
    ['type' => 'code', 'files' => ['before.php', 'after.php']],
];

$sequenceJson = json_encode($sequence);

// 3. Modify render-video.js programmatically or create a custom one
file_put_contents(
    '/path/to/remotion-app/custom-render.js',
    "const sequence = {$sequenceJson};\n" . file_get_contents('./render-video.js')
);

// 4. Execute render
exec('cd /path/to/remotion-app && node custom-render.js');
```

Or better yet, pass as environment variable or use a props file!
