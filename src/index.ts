#!/usr/bin/env bun
import { createServer } from "./server";

const args = Bun.argv.slice(2);
const portArg = args.find(a => a.startsWith("--port="));
const port = portArg ? parseInt(portArg.split("=")[1] || "51234") : 51234;

const filePatterns = args.filter(a => !a.startsWith("--"));
const patterns = filePatterns.length > 0 ? filePatterns : ["**/*.html"];

console.log(`[aframe-watcher-bun] Starting server on port ${port}...`);
console.log(`[aframe-watcher-bun] Watching patterns: ${patterns.join(", ")}`);

const server = createServer({ port, filePatterns: patterns });

console.log(`[aframe-watcher-bun] Listening on ${server.url}`);
