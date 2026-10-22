# Marketplace practice case

Unofficial offline practice tool for a CSULB MBA team. It is a single-file simulation of a carbon-fiber bike company, played Q1 through Q4 on the same kind of decision screens as the course game. It is not affiliated with, endorsed by, or a product of Innovative Learning Solutions, Ernest Cadotte, or Marketplace Simulations.

The page is class prep, not brand content. It is not linked from the site navigation, it is omitted from the sitemap, and it sends `X-Robots-Tag: noindex` plus a robots.txt disallow.

After deploy:

- https://christoth-ai.vercel.app/marketplace-practice
- https://christoth-ai.vercel.app/marketplace-practice.html

`/marketplace-practice` is a rewrite to the static file in `public/`. The file is self-contained: inline CSS and JavaScript, system fonts, and `localStorage` for saves. Loading it does not request other assets. A few source links inside the page point at public guides; those are ordinary links, not required to play.

The page uses a light gray canvas, system sans-serif type, and blue pill controls, in the spirit of apple.com and att.com. No webfonts are loaded. On a Mac the type resolves to San Francisco. On Windows it resolves to Segoe UI.

## Update

Replace `public/marketplace-practice.html` with the new single-file HTML, then keep or reapply the `<style>` block if the new file brings back the old serif theme. Keep it one file with inline CSS and JavaScript and no external stylesheets, scripts, fonts, or images. Do not commit ILS Help File text, course decks, or PDFs.
