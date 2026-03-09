import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const outDir = process.argv[2] ?? "dist-analyze";
const assetsDir = path.join(process.cwd(), outDir, "assets");

const jsFiles = readdirSync(assetsDir)
  .filter((file) => file.endsWith(".js") && !file.endsWith(".js.map"))
  .sort();

if (jsFiles.length === 0) {
  console.error(`No JavaScript assets found in ${assetsDir}`);
  process.exit(1);
}

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(2)} KiB`;
}

function sourceGroupFor(source) {
  if (source.includes("/node_modules/three/")) return "three";
  if (source.includes("/node_modules/@react-three/fiber/")) return "@react-three/fiber";
  if (source.includes("/node_modules/react-dom/")) return "react-dom";
  if (source.includes("/node_modules/react-router")) return "react-router";
  if (source.includes("/node_modules/zod/")) return "zod";
  if (source.includes("/node_modules/radix-ui/")) return "radix-ui";
  if (source.includes("/node_modules/sonner/")) return "sonner";
  if (source.includes("/node_modules/lucide-react/")) return "lucide-react";
  if (source.includes("/src/features/game-3d/")) return "game-3d-local";
  if (source.includes("/src/routes/")) return "routes-local";
  if (source.includes("/src/components/")) return "components-local";
  if (source.includes("/src/")) return "src-local-other";
  if (source.includes("/node_modules/")) return "other-node-modules";
  return "other";
}

function printChunkSummary(file) {
  const chunkPath = path.join(assetsDir, file);
  const mapPath = `${chunkPath}.map`;
  const jsSize = statSync(chunkPath).size;
  const gzipSize = gzipSync(readFileSync(chunkPath)).length;

  console.log(`\nChunk: ${file}`);
  console.log(`  emitted: ${formatKiB(jsSize)} (${formatKiB(gzipSize)} gzip)`);

  try {
    const map = JSON.parse(readFileSync(mapPath, "utf8"));
    const byGroup = new Map();
    const bySource = [];

    for (let index = 0; index < map.sources.length; index += 1) {
      const source = map.sources[index] ?? "";
      const bytes = (map.sourcesContent?.[index] ?? "").length;
      const group = sourceGroupFor(source);
      byGroup.set(group, (byGroup.get(group) ?? 0) + bytes);
      bySource.push({ bytes, source });
    }

    console.log("  top source groups:");
    for (const [group, bytes] of [...byGroup.entries()].sort((left, right) => right[1] - left[1]).slice(0, 6)) {
      console.log(`    - ${group}: ${formatKiB(bytes)}`);
    }

    console.log("  top sources:");
    for (const entry of bySource.sort((left, right) => right.bytes - left.bytes).slice(0, 8)) {
      console.log(`    - ${formatKiB(entry.bytes)} ${entry.source}`);
    }
  } catch (error) {
    console.log(`  sourcemap: unavailable (${error instanceof Error ? error.message : String(error)})`);
  }
}

console.log(`Analyzing assets in ${assetsDir}`);
for (const file of jsFiles) {
  printChunkSummary(file);
}
