import { sync, type Changes } from "../src/watcher";
import { defaultIndexHtml } from "./default-index";
// @ts-ignore
import aframeInspector from "../vendor/aframe-inspector.min.js" with { type: "text" };
// @ts-ignore
import aframeMin from "./node_modules/aframe/dist/aframe-master.min.js" with { type: "text" };

const port = 3000;

// Path resolution: CLI arg > ENV > Default ./index.html
const cliPath = process.argv[2];
const envPath = process.env.AFRAME_WATCHER_HTML;
const defaultPath = "./index.html";

let examplePath = cliPath || envPath || defaultPath;
const isDefault = !cliPath && !envPath;

const file = Bun.file(examplePath);

if (isDefault) {
  // If the default index.html does not exist, extract it from the import
  if (!(await file.exists())) {
    console.log(`[example] Local ${examplePath} not found. Extracting from built-in example...`);
    await Bun.write(examplePath, defaultIndexHtml);
  }
} else {
  // If a path was provided, it MUST exist and be writable
  if (!(await file.exists())) {
    console.error(`[error] Provided file does not exist: ${examplePath}`);
    process.exit(1);
  }
  
  // Test if it's writable by opening it
  try {
    const content = await file.text();
    await Bun.write(examplePath, content);
  } catch (e) {
    console.error(`[error] Provided file is not writable: ${examplePath}`);
    process.exit(1);
  }
}

console.log(`[example] Starting A-Frame Bun Watcher Example on http://localhost:${port}...`);
console.log(`[example] Targeting file: ${examplePath}`);

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    // 1. Serve the example index.html at root
    if (url.pathname === "/") {
      // Re-read file each time to pick up changes from disk (persistence)
      const currentHtml = await Bun.file(examplePath).text();
      return new Response(currentHtml, {
        headers: { "Content-Type": "text/html" }
      });
    }

    // 2. Serve A-Frame library from node_modules
    if (url.pathname === "/aframe.min.js") {
      return new Response(aframeMin as any, {
        headers: { "Content-Type": "application/javascript" }
      });
    }

    // 3. Serve A-Frame Inspector
    if (url.pathname === "/aframe-inspector.min.js") {
      return new Response(aframeInspector as any, {
        headers: { "Content-Type": "application/javascript" }
      });
    }

    // 4. Handle Save Endpoint
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

    // 5. CORS Preflight
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

console.log(`[example] Example ready at ${server.url}`);
