# Japan Diary 2026

Personal five-week Japan traineeship diary, checklist and visual journal.

## Edit the content

Almost all visible copy lives in `content.js`.

Typical changes:
- `hero` — headline, intro, caption and note
- `weeks.items` — the five weekly chapters
- `wishlist.lists` — checklist categories and tasks
- `routine.items` — weekday rhythm
- `vlog` — vlog headings and shot ideas
- `work` — traineeship section
- `notes` — journal labels

You normally do **not** need to touch `index.html` or `styles.css` when changing copy.

## Edit the design

Design tokens and layout live in `styles.css`. The main palette is at the top under `:root`.

## Deploy with Vercel

1. Open Vercel.
2. Choose **Add New → Project**.
3. Import the GitHub repository `porzelaines/japan-diary-2026`.
4. Keep the default settings / static site detection.
5. Click **Deploy**.

After the first deployment, every commit to the repository's main branch triggers a new Vercel deployment automatically.

## Local checklist storage

Checklist state and diary notes use browser `localStorage`. They persist on one browser/device, but are not yet synchronized across devices.
