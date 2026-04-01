# A-Frame Bun Watcher Template

This is a standalone template for creating A-Frame projects with Bun persistence support. It uses `aframe-watcher-bun` to save changes made in the A-Frame Inspector directly back to your `index.html` file.

## Quick Start

You can use this template with `bun create`:

```bash
bun create CMCRobotics/aframe-watcher-bun/examples/bun-template my-vr-project
cd my-vr-project
bun install
bun start
```

## How it works

1. **`server.ts`**: A lightweight Bun server that serves your `index.html` and provides a `/save` endpoint.
2. **`index.html`**: Your A-Frame scene. It includes a small script to tell the A-Frame Inspector where to send changes.
3. **Persistence**: When you press the save icon in the A-Frame Inspector (CTRL+ALT+I), the changes are sent to the Bun server, which updates your `index.html` on disk.

## Usage

1. Run `bun start`.
2. Open `http://localhost:3000` in your browser.
3. Press `CTRL + ALT + I` to open the Inspector.
4. Modify any entity (position, rotation, etc.).
5. Click the **Floppy Disk** 💾 icon in the top left of the Inspector.
6. Check your `index.html` file—the changes are saved!
