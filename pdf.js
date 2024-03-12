const fs = require('fs').promises;
const path = require('path');

const express = require('express');
const puppeteer = require('@cloudflare/puppeteer');


const port = 3333;
const buildPath = path.join(__dirname, 'build');
const pdfPath = path.join(buildPath, 'RickyCookCV.pdf');


async function serve() {
  const app = express();
  app.use(express.static(buildPath));

  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(port, () => resolve(server));
    } catch(err) {
      reject(err)
    }
  })
}


async function generate() {
  const browser = await puppeteer.launch(env.MYBROWSER)
  try {
    const page = await browser.newPage();
    await page.goto(
      `http://localhost:${port}`,
      { waitUntil: 'load' },
    );
    const margin = '2cm';
    const pdfData = await page.pdf({
      format: 'A4',
      margin: { top: margin, bottom: margin, left: margin, right: margin },
    });
    await fs.writeFile(pdfPath, pdfData);
  } finally {
    await browser.close();
  }
}


async function doit() {
  const server = await serve()
  await generate();
  server.close()
}

doit();
