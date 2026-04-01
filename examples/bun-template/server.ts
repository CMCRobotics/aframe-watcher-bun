import { sync, type Changes } from "aframe-watcher-bun";
import { resolve } from "path";

const port = 3000;

// Path resolution: CLI arg > ENV > Default ./index.html
const cliPath = process.argv[2];
const envPath = process.env.AFRAME_WATCHER_HTML;
const defaultPath = "./index.html";

let examplePath = cliPath || envPath || defaultPath;
const isDefault = !cliPath && !envPath;

const file = Bun.file(examplePath);

const defaultIndexHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>A-Frame Bun Watcher Template</title>
    <meta name="description" content="Modernized A-Frame project with Bun Watcher support.">
    <!-- Main A-Frame Library (Served from CDN or local) -->
    <script src="https://aframe.io/releases/1.7.1/aframe.min.js"></script>
    
    <!-- Integration with our Bun Watcher and Patched Inspector -->
    <script>
      // 1. Point the inspector to our Bun watcher endpoint on the same server
      window.AFRAME_WATCHER_URL = "/save";
    </script>
  </head>
  <body>
    <!-- Use the built-in inspector, or provide a URL to a custom one -->
    <a-scene>
      <a-box id="my-box" position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
      <a-sphere id="my-sphere" position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
      <a-cylinder id="my-cylinder" position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
      <a-plane id="ground" position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
      <a-sky id="background" color="#ECECEC"></a-sky>
      
      <!-- Instructions -->
      <a-entity position="-2 3 -4">
        <a-text value="1. Press CTRL + ALT + I to open Inspector\\n2. Modify an object (e.g., move the box)\\n3. Click the Floppy Disk icon to Save back to disk!" 
                color="black" width="4"></a-text>
      </a-entity>
    </a-scene>
  </body>
</html>`;

if (isDefault) {
  // If the default index.html does not exist, extract it from the import
  if (!(await file.exists())) {
    console.log(`[template] Local ${examplePath} not found. Creating default...`);
    await Bun.write(examplePath, defaultIndexHtml);
  }
} else {
  // If a path was provided, it MUST exist and be writable
  if (!(await file.exists())) {
    console.error(`[error] Provided file does not exist: ${examplePath}`);
    process.exit(1);
  }
}

console.log(`[template] Starting A-Frame Bun Watcher on http://localhost:${port}...`);
console.log(`[template] Targeting file: ${examplePath}`);

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    // 1. Serve the index.html at root
    if (url.pathname === "/") {
      const currentHtml = await Bun.file(examplePath).text();
      return new Response(currentHtml, {
        headers: { "Content-Type": "text/html" }
      });
    }

    // 2. Handle Save Endpoint
    if (req.method === "POST" && url.pathname === "/save") {
      try {
        const changes = (await req.json()) as Changes;
        sync(changes, [examplePath]);
        return new Response("OK", { 
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" }
        });
      } catch (e) {
        return new Response("Invalid JSON", { status: 400 });
      }
    }

    // 3. CORS Preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`[template] Template ready at ${server.url}`);
