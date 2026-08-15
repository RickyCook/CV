# The mildy over-engineered, but fun CV of Ricky Cook

Over-engineered? Maybe, but I got to play with some tools, and explore some ideas that I've been meaning to for a while. This was an alternative to using hugo, which seemed like overkill. Overall, this approach turned out _very_ well, and I'll probably be seeing how far I can push it in the future (eg incremental build, markdown files rendered in the front end).

## The build
- React is the core that everything is built around, written in TypeScript
- Vite handles both the client bundle and an SSR build of the app, with the SWC plugin compiling the TS/JSX
- Tailwind CSS (via `@tailwindcss/vite`) provides all the styling, configured with `@theme` in [index.css](./src/index.css) — custom colors, the two monospace fonts, and a few custom utilities (the "glow", "brutal shadow", and header effects)
- [tailwind-variants](./src/components/Header.tsx) and motion (the successor to framer-motion) drive the header styles and animations
- puppeteer (Chromium via nodejs) [renders the static HTML into a PDF](./pdf/pdf.ts)
- CloudFlare workers is used to build all the parts on push to master
- CloudFlare pages is used to host the finished product

## The build pipeline
- `npm run build-html` produces the static site: a Vite client build, plus a server build of [entry-server.tsx](./src/entry-server.tsx) that [prerenders](./scripts/prerender.mjs) the app HTML into `build/index.html`
- `npm run build-pdf` serves that build and renders it out to `build/RickyCookCV.pdf` with puppeteer
- `npm run build` runs both of those
- `npm start` runs the Vite dev server

## The "app"
- The HTML is pre-rendered server-side and then hydrated, so with JS disabled the HTML is still able to be loaded and read (but not interacted with) — [index.html](./index.html) includes a `noscript` rule that un-hides motion's pre-animation states
- Print styles ensure that the interactive parts of the CV remain accessible in some form without the ability to interact (eg some links get alternate text, some links are written as a "reference" number like on Wikipedia)
- "Reference links" are a fixed list in [Link.tsx](./src/components/Link.tsx): on screen they're plain anchors, but in print they're followed by a reference number, with the full URLs rendered at the end of the page
- CSS grid, and media queries are used for the employment history segment to ensure that everything has enough space (when the screen gets smaller, the "technology" column becomes a row just like the others)
- The "Details" sidebar is expanded on wide screens and collapsed by default on narrower ones, with a tab to toggle it
- If a `contacts.ts` file is found at the repo root, it's used to fill out phone/email at build time via a Vite `define`. It's gitignored, so it isn't pushed, and without it the CV just falls back to "Contact for info"
