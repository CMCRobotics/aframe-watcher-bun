import { write } from "bun";

const INSPECTOR_URL = "https://github.com/CMCRobotics/aframe-inspector/raw/refs/heads/master/dist/aframe-inspector.min.js";
const OUTPUT_PATH = "vendor/aframe-inspector.min.js";

async function download() {
  console.log(`Downloading A-Frame Inspector from ${INSPECTOR_URL}...`);
  
  const response = await fetch(INSPECTOR_URL);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const content = await response.arrayBuffer();
  await write(OUTPUT_PATH, content);
  
  console.log(`Successfully saved to ${OUTPUT_PATH}`);
}

download().catch((err) => {
  console.error("Error downloading inspector:", err);
  process.exit(1);
});
