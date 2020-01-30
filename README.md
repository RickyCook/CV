# The mildy over-engineered, but fun CV of Ricky Cook

Over-engineered? Maybe, but I got to play with some tools, and explore some ideas that I've been meaning to for a while. This was an alternative to using hugo, which seemed like overkill. Overall, this approach turned out _very_ well, and I'll probably be seeing how far I can push it in the future (eg incremental build, markdown files rendered in the front end, and react-static on build).

## The build
- React is the core that everything is built around
- styled-components allows for easy print styling (things like links having different text in print to ensure that URLs can be followed without a click), and [theming](../blob/master/src/theme.js)
- Webpack, Babel, and other react-scripts tools are used to generate the final product
- react-snap takes the output from webpack (the JS, CSS, and HTML) and generates a "pre-rendered" HTML page so that a non-interactive version works without JS needing to be enabled
- puppeteer (Chromium via nodejs) renders the static HTML into a PDF
- GitHub actions is used to build all the parts on push to master
- GitHub pages is used to host the finished product

## The "app"
- The HTML is pre-rendered, so with JS disabled, the HTML is still able to be loaded and read (but not interacted with)
- Print styles ensure that the interactive parts of the CV remain accessible in some form without the ability to interact (eg some links get alternate text, some links are written as a "reference" number like on Wikipedia)
- "Reference links" (links that have a reference number) use context, and a component to track them: They behave just like an anchor tag, but are automatically changed to the reference style, and rendered at the end of the page with print styling
- CSS grid, and media queries are used for the employment history segment to ensure that everything has enough space (when the screen gets smaller, the "technology" column becomes a row just like the others)
- The sidebars (details and built using sections) change their default collapsed states and whether collapse is allowed based on screen width
- If a `contacts.js` file is found, this is used to fill out phone/email on compilation. This is not pushed, to protect privacy
