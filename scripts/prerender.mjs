import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.join(import.meta.dirname, '..');
const htmlPath = path.join(root, 'build', 'index.html');
const serverDir = path.join(root, 'build-server');

const entryName = (await readdir(serverDir)).find((name) => name.startsWith('entry-server.'));
if (!entryName) {
  throw new Error(`No entry-server bundle found in ${serverDir}`);
}

const { render } = await import(pathToFileURL(path.join(serverDir, entryName)).href);
const html = await readFile(htmlPath, 'utf8');

const marker = '<div id="root"></div>';
if (!html.includes(marker)) {
  throw new Error(`Prerender marker "${marker}" not found in ${htmlPath}`);
}

await writeFile(htmlPath, html.replace(marker, `<div id="root">${render()}</div>`));
console.log(`Prerendered app HTML into ${htmlPath}`);
