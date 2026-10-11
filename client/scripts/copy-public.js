const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../public');
const destDir = path.resolve(__dirname, '../dist');

if (fs.existsSync(srcDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'index.html') continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    fs.cpSync(srcPath, destPath, { recursive: true });
  }
  console.log('[Build] Successfully copied public assets (images, favicon, etc.) to dist');
} else {
  console.warn('[Build] Warning: public directory not found');
}
