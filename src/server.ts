import { sync, type Changes } from "./watcher";

export interface ServerOptions {
  port?: number;
  filePatterns?: string[];
  cors?: boolean;
}

export function createServer(options: ServerOptions = {}) {
  const { port = 51234, filePatterns = ["**/*.html"], cors = true } = options;

  return Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);

      // CORS Preflight
      if (cors && req.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      // Save Endpoint
      if (req.method === "POST" && url.pathname === "/save") {
        try {
          const changes = (await req.json()) as Changes;
          sync(changes, filePatterns);
          
          const response = new Response("OK", { status: 200 });
          if (cors) {
            response.headers.set("Access-Control-Allow-Origin", "*");
          }
          return response;
        } catch (e) {
          return new Response("Invalid JSON", { status: 400 });
        }
      }

      // Serve A-Frame Inspector
      if (url.pathname === "/aframe-inspector.min.js") {
        try {
          const path = "../../aframe-inspector/dist/aframe-inspector.min.js";
          return new Response(Bun.file(path));
        } catch (e) {
          return new Response("Inspector not found", { status: 404 });
        }
      }

      // Root / Health check
      if (url.pathname === "/") {
        return new Response("A-Frame Bun Watcher is running!");
      }

      return new Response("Not Found", { status: 404 });
    },
  });
}
