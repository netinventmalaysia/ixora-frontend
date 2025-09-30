// Generate padded Apple Touch Icons to avoid oversized look on iOS home screen
// Requires: sharp
// Usage: node scripts/generate-apple-icons.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const srcLogo = path.join(publicDir, 'images', 'logo.png');

const outMain = path.join(publicDir, 'apple-touch-icon.png'); // 180x180
const iconsDir = path.join(publicDir, 'icons');
const variants = [
  { size: 120, file: 'apple-touch-icon-120.png' },
  { size: 152, file: 'apple-touch-icon-152.png' },
  { size: 167, file: 'apple-touch-icon-167.png' },
  { size: 180, file: 'apple-touch-icon-180.png' },
];

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true });
}

async function generate(size, dest) {
  const paddingRatio = 0.18; // leave ~18% padding around the logo
  const inner = Math.round(size * (1 - paddingRatio * 2));
  const bg = { r: 255, g: 255, b: 255, alpha: 0 }; // transparent background

  // Create square canvas
  const canvas = sharp({ create: { width: size, height: size, channels: 4, background: bg } });

  // Prepare logo scaled to inner size, maintaining aspect
  const logoBuf = await sharp(srcLogo)
    .resize(inner, inner, { fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer();

  // Composite centered
  const result = await canvas
    .composite([{ input: logoBuf, gravity: 'center' }])
    .png()
    .toBuffer();

  await sharp(result).png().toFile(dest);
}

(async () => {
  try {
    if (!fs.existsSync(srcLogo)) {
      console.error('Source logo missing:', srcLogo);
      process.exit(1);
    }
    await ensureDir(iconsDir);
    // Generate primary 180x180
    await generate(180, outMain);
    // Variants
    for (const v of variants) {
      await generate(v.size, path.join(iconsDir, v.file));
    }
    console.log('Apple touch icons generated.');
  } catch (e) {
    console.error('Failed to generate Apple touch icons:', e);
    process.exit(1);
  }
})();
