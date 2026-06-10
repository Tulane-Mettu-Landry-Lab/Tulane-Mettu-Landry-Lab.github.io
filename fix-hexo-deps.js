// Post-install fix: Replace hexo's bundled ESM-only strip-ansi & ansi-regex (v7+)
// with CJS versions (v6) for Node.js ESM/CJS compatibility.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const HEXO_MODULES = path.join(ROOT, 'node_modules', 'hexo', 'node_modules');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const deps = ['strip-ansi', 'ansi-regex'];

for (const dep of deps) {
  const srcDir = path.join(ROOT, 'node_modules', dep);
  const destDir = path.join(HEXO_MODULES, dep);

  if (!fs.existsSync(srcDir)) {
    console.warn(`[fix-hexo-deps] ${dep} not found in node_modules/`);
    continue;
  }

  const destPkg = path.join(destDir, 'package.json');
  if (fs.existsSync(destPkg)) {
    const pkg = JSON.parse(fs.readFileSync(destPkg, 'utf8'));
    const parts = pkg.version.split('.');
    const major = parseInt(parts[0], 10);
    if (major <= 6) {
      // Already CJS-compatible, skip
      continue;
    }
  }

  // Remove existing and copy CJS version
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  copyDir(srcDir, destDir);
  console.log(`[fix-hexo-deps] Replaced hexo's bundled ${dep} with CJS version`);
}