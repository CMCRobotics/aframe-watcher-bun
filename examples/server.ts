import { sync, type Changes } from "../src/watcher";

const port = 3000;
const examplePath = "./index.html";
const inspectorPath = "../../aframe-inspector/dist/aframe-inspector.min.js";
const aframePath = "./node_modules/aframe/dist/aframe-master.min.js";

console.log(`[example] Starting A-Frame Bun Watcher Example on http://localhost:${port}...`);
console.log(`[example] Targeting file: ${examplePath}`);

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    // 1. Serve the example index.html at root
    if (url.pathname === "/") {
      return new Response(Bun.file(examplePath), {
        headers: { "Content-Type": "text/html" }
      });
    }

    // 2. Serve A-Frame library from node_modules
    if (url.pathname === "/aframe.min.js") {
      return new Response(Bun.file(aframePath));
    }

    // 3. Serve A-Frame Inspector
    if (url.pathname === "/aframe-inspector.min.js") {
      return new Response(Bun.file(inspectorPath));
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
