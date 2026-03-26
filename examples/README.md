# A-Frame Bun Watcher Example

This example demonstrates how to use the **A-Frame Bun Watcher** to create a real-time, high-performance development workflow for A-Frame scenes.

It includes:
- A local A-Frame scene (`index.html`).
- A custom-served A-Frame Inspector.
- A Bun-based server that serves assets and handles real-time scene updates.

## Features

- **Portability**: All assets (scene, inspector, and A-Frame library) are embedded in the server.
- **Standalone Mode**: Can be compiled into a single executable that requires no external files to run.
- **Auto-Sync**: Modifications made in the Inspector are automatically saved back to the `index.html` on your disk.

## Running from Source

To run the example using the Bun runtime:

```bash
bun run server.ts
```

Then visit `http://localhost:3000` in your browser.

## Running as a Standalone Executable

You can compile this example into a single binary for easy distribution:

1. Build the executable from the project root:
   ```bash
   bun run build:example
   ```
2. Run the generated binary:
   ```bash
   ./example-server
   ```

## Development Workflow

1. Open the scene at `http://localhost:3000`.
2. Press `CTRL + ALT + I` to open the A-Frame Inspector.
3. Modify an object (e.g., move the sphere or change the box color).
4. Click the **Floppy Disk** (Save) icon in the inspector.
5. Watch as your `index.html` is instantly updated on your disk!

## Structure

- `index.html`: The A-Frame scene.
- `server.ts`: The Bun-based server that serves assets and provides the `/save` endpoint.
- `node_modules/aframe`: The local A-Frame library (linked/installed).
- `../vendor/aframe-inspector.min.js`: The vendored inspector script.
