// Bistro Rush: Master Chef - Competition Entry Builder and Dossier Generator
// Competition: best-cooking-game-20261125-0137 (make.fun)
//
// Architecture Overview:
// - Runtime: Node 22 ESM standard library with zero external runtime dependencies.
// - Game Core: Pure HTML5 Canvas 2D engine with 60 FPS requestAnimationFrame loop.
// - Audio Subsystem: 100% offline procedural Web Audio API synthesis (sawtooth, sine, bandpass filtered noise).
// - Culinary Stations: Interactive Pantry (15 ingredients), End-Grain Chopping Board, Dual Cast-Iron Sizzle Griddle,
//   Fine Dining Ceramic Plating Station with drop shadows and multi-layer food rendering, and Golden Brass Service Bell.
// - Scoring & Pressure: Live order patience timers, speed bonuses, and up to 5x Combo Rush multipliers.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

console.log('=====================================================');
console.log('=== BISTRO RUSH: MASTER CHEF ENGINE INITIALIZED   ===');
console.log('=====================================================');
console.log('[bistro-rush] Starting build dossier preparation for Bistro Rush: Master Chef...');
console.log(`[bistro-rush] Source root directory: ${here}`);
console.log(`[bistro-rush] Target output directory: ${out}`);

// Ensure destination directories exist
mkdirSync(out, { recursive: true });
mkdirSync(join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });

// Copy entire game directory (static HTML5, audio synth, recipes, stations, rendering)
const gameSource = join(here, 'game');
const gameTarget = join(out, 'game');
if (!existsSync(gameSource)) {
  console.error('[bistro-rush] Error: game directory missing from source!');
  process.exit(1);
}
cpSync(gameSource, gameTarget, { recursive: true });

// Count game files copied
const countFiles = (dir: string): number => {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(full);
    } else if (entry.isFile()) {
      count++;
    }
  }
  return count;
};
const gameFileCount = countFiles(gameTarget);
console.log(`[bistro-rush] Successfully copied ${gameFileCount} game asset and script files to /output/game`);

// Required competition screenshots
const EXPECTED_SCREENSHOTS = [
  '1-kitchen.jpg',
  '2-prep-action.jpg',
  '3-dish-assembly.jpg',
  '4-shift-complete.jpg',
];

const screenshotSource = join(here, 'screenshots');
const screenshotTarget = join(out, 'screenshots');

if (existsSync(screenshotSource)) {
  cpSync(screenshotSource, screenshotTarget, { recursive: true });
}

// Validate screenshot presence and file size limits (max 256 KiB each)
const MAX_SCREENSHOT_BYTES = 262144;
let verifiedScreenshots = 0;

for (const name of EXPECTED_SCREENSHOTS) {
  const filePath = join(screenshotTarget, name);
  if (!existsSync(filePath)) {
    console.warn(`[bistro-rush] Warning: expected screenshot ${name} is missing.`);
    continue;
  }
  const stats = statSync(filePath);
  if (stats.size > MAX_SCREENSHOT_BYTES) {
    console.error(`[bistro-rush] Error: screenshot ${name} exceeds 256 KiB limit (${stats.size} bytes).`);
    process.exit(1);
  }
  console.log(`[bistro-rush] Verified screenshot ${name}: ${(stats.size / 1024).toFixed(1)} KiB (OK)`);
  verifiedScreenshots++;
}

console.log(`[bistro-rush] Validated ${verifiedScreenshots}/${EXPECTED_SCREENSHOTS.length} game screenshots.`);

// Build sealed dossier JSON according to makefun competition constraints
const dossierData = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

const dossierPath = join(out, 'dossier.json');
writeFileSync(dossierPath, dossierData);

const dossierBytes = statSync(dossierPath).size;
console.log(`[bistro-rush] Successfully generated ${dossierPath} (${(dossierBytes / 1024).toFixed(1)} KiB).`);
console.log('[bistro-rush] Bistro Rush: Master Chef dossier build completed cleanly.');
