# @cmcrobotics/aframe-watcher-bun

A modern, high-performance companion watch server for the [A-Frame Inspector](https://github.com/aframevr/aframe-inspector), built with [Bun](https://bun.sh/).

This project is a modernization of the original `aframe-watcher`, designed for better performance, easier integration, and single-binary distribution.

## Features

- **Blazing Fast**: Built on the Bun runtime for minimal overhead.
- **Single Binary**: Can be compiled into a standalone executable.
- **Easy Integration**: Use it as a CLI tool or a library in your Bun project.
- **Configurable**: Support for custom ports, file patterns, and more.

## Installation

```bash
bun install @cmcrobotics/aframe-watcher-bun
```

## Usage

### CLI

Run the watcher in your project directory:

```bash
bunx @cmcrobotics/aframe-watcher-bun
```

Or with custom options:

```bash
bunx @cmcrobotics/aframe-watcher-bun --port=3000 src/**/*.html
```

Or install it globally:

```bash
bun install -g @cmcrobotics/aframe-watcher-bun
aframe-watcher-bun --port=51234
```

### Library

Integrate the watcher into your existing Bun server:

```typescript
import { createServer } from "@cmcrobotics/aframe-watcher-bun";

const server = createServer({
  port: 51234,
  filePatterns: ["tests/**/*.html"]
});

console.log(`Watcher listening on ${server.url}`);
```

## How It Works

The A-Frame Inspector (running in your browser) sends component changes via POST requests to this server. `aframe-watcher-bun` then:
1. Receives the JSON payload of changes.
2. Scans your local HTML files for entities with matching `id`s.
3. Intelligently updates the raw HTML content with the new attribute values.
4. Saves the changes back to disk.

## Building for Distribution

To create a self-contained binary:

```bash
bun build src/cli.ts --compile --outfile aframe-watcher
```

## Testing

```bash
bun test
```

## Examples

To run the provided example project:

```bash
bun run examples/server.ts
```
Then visit `http://localhost:3000` to see the A-Frame scene and test the inspector.

For more details on the example project and building it as a standalone executable, see the [Examples README](./examples/README.md).

## Development

### Maintaining the Vendored A-Frame Inspector

This project vendors a pre-built version of the [A-Frame Inspector](https://github.com/aframevr/aframe-inspector) in `vendor/aframe-inspector.min.js`. This ensures that the watcher can be distributed and committed without external dependencies.

To update the vendored inspector from a local checkout of the `aframe-inspector` repository:

1. Ensure `aframe-inspector` is checked out as a sibling directory to this project (`../aframe-inspector`).
2. Run the update script:
   ```bash
   bun run build:inspector
   ```
   This will install dependencies in the inspector project, build it, and copy the resulting `aframe-inspector.min.js` into the `vendor/` directory.

Alternatively, if you already have a built inspector and just want to re-copy it:
```bash
bun run vendor:inspector
```

## Credits

This project is a modernized version of:
- [aframe-watcher](https://github.com/supermedium/aframe-watcher) by Supermedium.
- [aframe-inspector](https://github.com/aframevr/aframe-inspector) by A-Frame authors.

License: MIT
