# Japan Diary 2026

A personal multi-page Japan travel diary and planning site.

## Pages

- `index.html` — diary entries and personal todo list
- `pages/food.html` — food and drink places
- `pages/trips.html` — recommended day trips and weekend ideas
- `pages/history.html` — personal notes on Japanese history
- `pages/kyoto.html` — Kyoto places and notes
- `pages/osaka.html` — Osaka places and notes

## Editing content

The site is designed so most personal content can be added directly in the browser through the forms on each page.

Diary entries, todos and saved page items are currently stored in the browser with `localStorage`. This means they stay on that browser/device, but they are not synchronized between devices.

## Design

- `styles.css` contains the shared powder-rose vintage design.
- `site.js` contains the local browser storage and form behavior.

## Deploying on Vercel

Import this GitHub repository as a new Vercel project. No build command is required because the site is static HTML/CSS/JavaScript.
