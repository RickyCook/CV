import fs from 'node:fs';
import type { Server } from 'node:http';
import path from 'node:path';

import express from 'express';
import puppeteer from 'puppeteer';

const port = 3333;
const buildPath = path.join(import.meta.dirname, '..', 'build');
const pdfPath = path.join(buildPath, 'RickyCookCV.pdf');

async function serve(): Promise<Server> {
  const app = express();
  app.use(express.static(buildPath));

  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));
    server.on('error', reject);
  });
}

async function generate(): Promise<void> {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`, { waitUntil: 'load' });
    const margin = '2cm';
    const pdfData = await page.pdf({
      format: 'A4',
      margin: { top: margin, bottom: margin, left: margin, right: margin },
    });
    await fs.promises.writeFile(pdfPath, pdfData);
  } finally {
    await browser.close();
  }
}

async function doit(): Promise<void> {
  const server = await serve();
  await generate();
  server.close();
}

doit();
