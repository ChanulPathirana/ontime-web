# Transit Flow — Live Transit Dashboard

A production-ready Next.js + TypeScript frontend based on the **Kinetic Stream** design system from the Google Stitch design files.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Pure CSS with public CDN (Google Fonts, Material Symbols)
- **Icons**: Material Symbols Outlined (CDN)
- **Fonts**: Inter (Google Fonts CDN)

> ✅ No Tailwind, no CSS framework — all styles use public CDN links and a custom CSS design system.

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Passenger Search Home | Route search with asymmetric map layout |
| `/nearby` | Nearby Bus List | Active routes with ETA and status badges |
| `/tracking` | Passenger Live Tracking | Full-screen map with glass sidebar panel |
| `/driver` | Driver Status Dashboard | Status grid with trip summary card |

---

## Design System (globals.css)

All design tokens are in `src/app/globals.css` as CSS custom properties:

```css
--color-primary: #004ac6;
--color-surface-container-lowest: #ffffff;
/* ...full Kinetic Stream token set */
```

Key design rules from the Stitch DESIGN.md:
- **No 1px borders** — separation via background tonal shifts
- **Glassmorphism** for floating overlays (`backdrop-filter: blur(16px)`)
- **Ambient shadows** — `box-shadow: 0 24px 24px -4px rgba(25, 28, 29, 0.06)`
- **Primary gradient** — `linear-gradient(135deg, #004ac6, #2563eb)`
- **Live Pulse** — CSS `@keyframes` for real-time status indicators

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Build for production
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Full design system (tokens, typography, components)
│   ├── layout.tsx           # Root layout with CDN font links in <head>
│   ├── page.tsx             # / — Passenger Search Home
│   ├── nearby/page.tsx      # /nearby — Nearby Bus List
│   ├── tracking/page.tsx    # /tracking — Live Tracking Map
│   ├── driver/page.tsx      # /driver — Driver Status Dashboard
│   └── dashboard/page.tsx   # /dashboard — redirects to /
└── components/
    ├── Sidebar.tsx           # Shared sidebar navigation
    └── TopAppBar.tsx         # Shared top header bar
```

---

## CDN Dependencies (no npm install needed for these)

All fonts and icons load from Google's public CDN — no additional packages required:

```html
<!-- Inter font -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900" rel="stylesheet" />

<!-- Material Symbols icons -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
```
