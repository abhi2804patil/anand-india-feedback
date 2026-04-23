# ANAND INDIA BUSINESS HUB — Tenant Feedback System

**Your Growth. Our Space.**

Full-stack tenant feedback platform with two modules:

- **Online Feedback Form** — 13-section wizard, auto-saved drafts, validation, animated transitions.
- **Admin Dashboard** — KPI cards, 12 interactive widgets, cross-filtering, CSV export, response drill-down.

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, lucide-react |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Backend | Node.js, Express |
| Validation | Zod |
| Storage | **MongoDB (via Mongoose)** with a **zero-config JSON file fallback** for local dev |
| Auth | JWT (admin-only login) |

---

## Folder Structure

```
feedback form/
├── client/                      # React + Vite + Tailwind
│   ├── public/favicon.svg
│   └── src/
│       ├── components/
│       │   ├── form/            # Wizard + 13 section components
│       │   ├── admin/           # Sidebar, filters, charts, table, modal
│       │   ├── ui/              # Field, radio group, checkbox group
│       │   └── Brand.jsx
│       ├── lib/                 # api client, zod schema, theme
│       ├── pages/               # Home, FormPage, AdminLogin, Dashboard
│       ├── App.jsx / main.jsx / index.css
│       └── ...
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── server/                      # Express API
│   ├── src/
│   │   ├── config/db.js         # Mongo + JSON fallback
│   │   ├── models/Feedback.js   # Mongoose schema
│   │   ├── validation/          # Server-side Zod schema
│   │   ├── routes/              # /api/feedback, /api/admin, /api/auth
│   │   ├── middleware/auth.js   # JWT guard
│   │   ├── repository.js        # Storage-agnostic data access
│   │   ├── seed.js              # 20 dummy submissions
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── package.json                 # Root workspace
└── README.md
```

---

## Quick Start (2 minutes, zero config)

```bash
# 1. Install everything (root + server + client)
npm run install:all

# 2. Set up server env (optional — defaults are fine)
cp server/.env.example server/.env

# 3. Seed 20 dummy submissions
npm run seed

# 4. Start both server (5000) and client (5173) in watch mode
npm run dev
```

Then open:

- Tenant form — <http://localhost:5173>
- Admin login — <http://localhost:5173/admin/login>
  - Default: `admin@anandindia.com` / `admin123` (change via `.env`)

> **No MongoDB installed?** No problem. If `MONGODB_URI` is empty, the server writes to `server/data/db.json`. Perfect for demo mode. Set the env var to switch to MongoDB with zero code changes.

---

## Switching to MongoDB

Edit `server/.env`:

```
MONGODB_URI=mongodb://localhost:27017/anand-india
```

Then re-run the seed:

```bash
npm run seed
```

Both modes support the same API surface — the repository layer (`server/src/repository.js`) picks the right backend automatically.

---

## Available Scripts

From the repo root:

| Script | What it does |
|--------|--------------|
| `npm run install:all` | Install root, server, and client dependencies |
| `npm run dev` | Start server + client in parallel |
| `npm run dev:server` | Start Express API only |
| `npm run dev:client` | Start Vite dev server only |
| `npm run seed` | Wipe + reseed with 20 dummy submissions |
| `npm run build` | Build the client for production |
| `npm start` | Start the server in production mode |

---

## API Reference

All admin routes require `Authorization: Bearer <jwt>` from `/api/auth/login`.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/feedback` | Public — submit a feedback form |
| GET | `/api/feedback/:submissionId` | Fetch a single submission |
| POST | `/api/auth/login` | Admin login → JWT |
| GET | `/api/admin/responses?from&to&company` | List responses |
| GET | `/api/admin/stats?from&to&company` | Aggregated KPI stats |
| GET | `/api/admin/export.csv?from&to&company` | Export CSV |
| GET | `/api/health` | Health check |

---

## Feedback Form — 13 Sections

1. Overall Satisfaction (1–10 slider + recommend)
2. Space & Infrastructure
3. Maintenance & Cleanliness
4. Facilities & Utilities
5. Noise & Environment
6. Safety & Behavior (conditional fields)
7. Location Feedback
8. Staff Behavior
9. Rent & Value
10. Management & Support
11. Future Needs & Expansion
12. Open Feedback (Like / Dislike / Owner change)
13. Upgrade Interest

Features:

- **Progress bar** with live section title
- **Auto-save to localStorage** — partial submissions survive a page reload
- **Previous / Next** navigation with per-step Zod validation
- **Framer Motion** slide transitions between steps
- **Conditional fields** (e.g. anti-social detail textarea, "Other" text inputs)
- **Thank-you screen** with unique submission ID

---

## Admin Dashboard — Widgets

| # | Widget | Type |
|---|--------|------|
| 1 | Satisfaction Trend | Line chart (monthly) |
| 2 | Recommendation Split | Donut (clickable → cross-filter) |
| 3 | Facilities Ratings | Heatmap (facility × rating) |
| 4 | Maintenance Speed | Horizontal bar (clickable) |
| 5 | Noise Sources | Stacked bar (source × frequency) |
| 6 | Rent Perception | Donut (clickable) |
| 7 | Future Space Needs | Vertical bar (clickable) |
| 8 | Requested Additional Services | Ranked horizontal bar (clickable) |
| 9 | Upgrade Willingness | Radial / gauge |
| 10 | Location Challenges | Vertical bar (clickable) |
| 11 | Word Cloud | Generated from Like / Dislike text |
| 12 | Safety Incidents Log | Table of anti-social reports |

Plus:

- **KPI cards:** Total Responses, Avg Satisfaction, Recommendation Rate, Retention Intent
- **Paginated responses table** with sort, search, and drill-down modal showing the full submission
- **Cross-filtering:** click a slice / bar to filter every other widget; an active-filter chip shows at the top
- **Filter bar:** date range + company dropdown + CSV / PDF export
- **Dark / light mode** toggle (saved to localStorage)
- **Responsive** — mobile, tablet, desktop
- **Loading skeletons** while data fetches
- **Smooth animations** on load and filter change (Framer Motion)

---

## Design System

| Token | Value |
|-------|-------|
| Primary (Navy) | `#0A2540` |
| Accent (Gold) | `#C9A227` |
| Background | `#F8F9FB` |
| Font | Inter / Poppins |
| Radius | `rounded-2xl` |
| Shadow | Soft card shadow |

Gold is reserved for emphasis: CTAs, active states, KPI numbers. The header uses a navy gradient matching the PDF brief.

---

## Production Notes

- `JWT_SECRET` must be a long random string in production.
- Add a real email transporter (e.g. Nodemailer + SES / SendGrid) in `server/src/routes/feedback.js` to enable confirmation + admin notification emails — stubs are in place as comments in the codebase.
- For MongoDB Atlas, paste the SRV connection string into `MONGODB_URI`.
- Client build: `npm run build` → static assets in `client/dist/`, serve via any CDN / reverse proxy.

---

## License

Proprietary — Anand India Business Hub.
