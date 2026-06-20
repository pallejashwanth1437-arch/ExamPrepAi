import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'dist');
const frontendPath = path.join(__dirname, 'frontend');
const landingDistPath = path.join(__dirname, 'landing-page/dist');

// Clean or create dist directory
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
}
fs.mkdirSync(distPath, { recursive: true });

// Copy frontend files (except index.html)
if (fs.existsSync(frontendPath)) {
  const items = fs.readdirSync(frontendPath);
  for (const item of items) {
    if (item === 'index.html') continue;
    const src = path.join(frontendPath, item);
    const dest = path.join(distPath, item);
    fs.cpSync(src, dest, { recursive: true });
  }
  console.log('Copied workspace frontend assets (except index.html)');
}

// Copy landing page build files
if (fs.existsSync(landingDistPath)) {
  fs.cpSync(landingDistPath, distPath, { recursive: true });
  console.log('Copied landing page build assets');
}

console.log('Combined build completed successfully inside dist/ folder!');
