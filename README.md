# aframe-watcher-bun

A modern, high-performance companion watch server for the [A-Frame Inspector](https://github.com/aframevr/aframe-inspector), built with [Bun](https://bun.sh/).

This project is a modernization of the original `aframe-watcher`, designed for better performance, easier integration, and single-binary distribution.

## Features

- **Blazing Fast**: Built on the Bun runtime for minimal overhead.
- **Single Binary**: Can be compiled into a standalone executable.
- **Easy Integration**: Use it as a CLI tool or a library in your Bun project.
- **Configurable**: Support for custom ports, file patterns, and more.

## Installation

```bash
bun install aframe-watcher-bun
```

## Usage

### CLI

Run the watcher in your project directory:

```bash
bunx aframe-watcher-bun
```

Or with custom options:

```bash
bunx aframe-watcher-bun --port=3000 src/**/*.html
```

### Library

Integrate the watcher into your existing Bun server:

```typescript
import { createServer } from "aframe-watcher-bun";

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
bun build src/index.ts --compile --outfile aframe-watcher
```

## Testing

```bash
bun test
```

## Credits

This project is a modernized version of:
- [aframe-watcher](https://github.com/supermedium/aframe-watcher) by Supermedium.
- [aframe-inspector](https://github.com/aframevr/aframe-inspector) by A-Frame authors.

License: MIT
