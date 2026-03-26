import { createServer } from "../src/server";

const port = 3000;
const examplePath = "./examples/index.html";

console.log(`[example] Starting A-Frame Bun Watcher Example on http://localhost:${port}...`);
console.log(`[example] Targeting file: ${examplePath}`);

const server = createServer({
  port,
  filePatterns: [examplePath]
});

// Extend our server to serve our example HTML file
const baseFetch = server.fetch;
server.fetch = async (req: Request) => {
  const url = new URL(req.url);
  
  // Serve the example index.html at root
  if (url.pathname === "/") {
    return new Response(Bun.file(examplePath), {
      headers: { "Content-Type": "text/html" }
    });
  }

  // Otherwise fallback to the watcher server (for /save and /aframe-inspector.min.js)
  return await baseFetch(req);
};

console.log(`[example] Example ready at http://localhost:${port}/`);
