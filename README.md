# ZRNO Online Menu

Industrial-noir digital menu for **ZRNO** — *Coffee & Wine*. A single-page web app guests use to browse Coffee, Wine, and Bites, with filters, pricing, and detail sheets for origin, producer, tasting notes, and more.

## Features

- **Flows:** welcome screen → category hub (Coffee / Wine / Bites) → scrollable lists with optional sub-category tabs (e.g. Espresso, Orange, Red).
- **Item details:** bottom sheet with producer, region, varietal, vintage, origin, description, and tasting information.
- **Polish:** grain overlay, Motion-driven transitions, Lucide icons, responsive layout.
- **Data:** menu items are defined in code (`src/App.tsx`) as mock data — straightforward to replace with a CMS or API later.

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19, TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Motion | [Motion](https://motion.dev/) (Framer Motion successor) |
| Icons | [lucide-react](https://lucide.dev/) |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)

## Run locally

```bash
npm install
npm run dev
```

The dev server listens on **port 3000** and binds to `0.0.0.0` so other devices on your network can open the menu (useful for phones on the same Wi‑Fi).

- **Production build:** `npm run build` — output in `dist/`
- **Preview build:** `npm run preview`
- **Typecheck:** `npm run lint`

## Configuration notes

`vite.config.ts` defines `process.env.GEMINI_API_KEY` from environment variables for compatibility with tooling that injected a Gemini key. **The current menu UI does not call the Gemini API.** If you add AI features, copy `.env.example` to `.env` or `.env.local` and set variables as needed.

## Project layout

- `src/App.tsx` — menu types, data, screens, and components
- `src/main.tsx` — React bootstrap
- `src/index.css` — fonts (Google Fonts) and Tailwind / design tokens
- `index.html` — document title (*ZRNO | Raw Grain & Ember*)
- `metadata.json` — short name/description metadata (*Raw Grain & Ember*)

App copy and branding in the UI match **ZRNO** — *Coffee & Wine* / “industrial noir.”

## License

Application source includes SPDX `Apache-2.0` headers (see `src/App.tsx`).

---

Repository: [github.com/djuuuma/ZrnoOnlineMenu](https://github.com/djuuuma/ZrnoOnlineMenu)
