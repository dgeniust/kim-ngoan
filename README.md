# Kim Ngoan Co., Ltd. – multi-site website

Corporate website of **Công ty TNHH Kim Ngoan** (Chơn Thành, Bình Phước, Vietnam). One Next.js
application serves a company landing hub and three sector sites, plus a small built-in CMS.

| URL | What it is | Theme scope |
| --- | --- | --- |
| `/` | Landing hub: hero slideshow of the three sectors, about, product showrooms, news, contact form + map | `.theme-hub` (Editorial Industrial – "Golden Harvest & Great Forest") |
| `/tin-tuc` | All news across sectors, filter `?nganh=phanbon\|lopxe\|satthep` | `.theme-hub` |
| `/phanbon/**` | Fertilizer & crop-protection site: video hero, crop picker with suggestions, plant doctor, catalog, search, guides | `.theme-pb` ("Vườn Xanh") |
| `/lopxe/**` | Car-tyre site: full-width video hero, size finder, tiers, photo blocks, catalog, **quote-only** contact flow | `.theme-lopxe` (white, orange accent) |
| `/satthep/**` | Roofing sheet & steel site: video hero, quotation-document layout, weight calculators, photo blocks, catalog, quote-only flow | `.theme-satthep` (white/grey) |
| `/admin/**` | CMS: shared settings, product databases (3 sectors), page content, guided tours | admin UI (shadcn/ui) |

All visible copy is Vietnamese; code, comments and documentation are English.

---

## Tech stack

- **Next.js 16** (App Router, Turbopack, React 19 Server Components, Server Actions, `proxy.ts`)
- **TypeScript 5** (strict)
- **Tailwind CSS v4** (`@theme` tokens in `src/app/globals.css`) + **shadcn/ui** (Base UI / Radix primitives) for the admin
- **zod 4** – validation of settings, products, content and environment
- **jose** – signed admin session cookie (HS256)
- **next/font/local** – self-hosted Be Vietnam Pro + Dancing Script (from `@fontsource/*` packages)
- **next/og** – generated Open Graph images
- **sonner** – toasts (`useNotify`)
- **lucide-react** – icons
- Data: JSON files on disk (`data/`), sample data in code as fallback. No database.

Node.js ≥ 20.9 is required (developed on Node 22).

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional in development – sane dev defaults exist
npm run dev                  # http://localhost:3000
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build (type-checks, prerenders SSG routes) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npx tsc --noEmit` | Type-check only |
| `npx knip` | Find unused files/exports (config in `knip.json`) |

Admin: open `/admin`, sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
(development default: `admin@kimngoan.vn` / `1`).

---

## Environment variables

Declared and documented in [`.env.example`](./.env.example). Server code reads them **only** through
`src/lib/env.ts` (and `NEXT_PUBLIC_SITE_URL` through `src/lib/site.ts`). `src/instrumentation.ts`
validates the configuration at start-up and logs every problem immediately.

| Variable | Required in prod | Description |
| --- | :---: | --- |
| `NEXT_PUBLIC_SITE_URL` | ✓ | Public origin without trailing slash. Drives `metadataBase`, canonical URLs, sitemap, robots, JSON-LD. Fallback in production: `https://kimngoan.com`; in dev: `http://localhost:3000`. |
| `ADMIN_EMAIL` | ✓ | Admin login e-mail. |
| `ADMIN_PASSWORD` | ✓ | Admin password, ≥ 8 characters in production. |
| `AUTH_SECRET` | ✓ | Session signing key, ≥ 32 characters (`openssl rand -base64 48`). Rotating it signs everyone out. |
| `DATA_DIR` |  | Directory for admin data and uploads. Default `data` (relative to the project root). Must be writable and backed up. |

Platform-provided: `NODE_ENV`, `NEXT_RUNTIME` (read by Next.js / instrumentation).

---

## Folder structure

```
src/
├─ app/                              App Router (routes only – thin pages that compose components)
│  ├─ layout.tsx                     Root layout: <html>, fonts, root metadata, JSON-LD, Toaster
│  ├─ error.tsx · global-error.tsx   Root error boundaries
│  ├─ not-found.tsx                  Hub-styled 404
│  ├─ sitemap.ts · robots.ts         Generated sitemap.xml / robots.txt
│  ├─ opengraph-image.tsx · icon.svg · apple-icon.tsx
│  ├─ (hub)/                         Landing hub "/" and "/tin-tuc"      (layout: HubHeader/HubFooter)
│  ├─ (phanbon)/phanbon/             Fertilizer site under /phanbon       (layout: PbHeader/PbFooter, CMS metadata)
│  ├─ (verticals)/[site]/            Shared dynamic routes for /lopxe and /satthep (generateStaticParams)
│  ├─ admin/                         /admin/login + (protected)/ CMS pages, actions.ts (Server Actions)
│  ├─ api/                           GET /api/tin-tuc, POST /api/admin/upload
│  └─ uploads/[file]/                Serves uploaded images from DATA_DIR/uploads
├─ components/
│  ├─ hub/                           Landing hub: header, nav/, sections/, footer, ui.tsx
│  ├─ phanbon/                       Fertilizer site: header, hero, bulletin, plant doctor, catalog/…
│  ├─ verticals/                     Tyre & steel sites: v-header, homes, cards, calculators…
│  ├─ admin/                         CMS UI, guide/ (guide centre + interactive tours)
│  ├─ shared/                        Cross-site: garden backdrop, reveal, error view, map embed, product art…
│  └─ ui/                            shadcn/ui primitives
├─ constants/                        Static copy & reference data (hub home/nav, crop calendar, plant doctor…)
├─ types/                            Shared domain types (catalog.ts, phanbon.ts)
├─ hooks/                            Client hooks (use-scrolled, use-modal-menu, use-hide-on-scroll, use-notify)
├─ lib/
│  ├─ verticals.ts                   Company + sector-site defaults (contacts, SEO, colours)
│  ├─ env.ts · site.ts               Environment access, public URL helpers
│  ├─ seo.ts · site-name.ts · og.tsx Metadata helpers (titles, descriptions, socialMeta), OG image renderer
│  ├─ fonts.ts                       next/font/local definitions
│  ├─ store/json-file.ts             Atomic JSON-file store (the persistence seam)
│  ├─ settings/ · products/ · content/ · catalog-content/   zod schemas + server readers/writers
│  ├─ data/                          Tyre/steel catalog access, sample data, news source (getNews)
│  ├─ mock/                          Fertilizer sample data + search
│  ├─ hub/home.ts                    Builds landing-hub view data on the server
│  ├─ auth/ · notify/ · crop-store.ts · ui.ts · utils.ts · format.ts
├─ instrumentation.ts                Env validation on boot
└─ proxy.ts                          Admin gate for /admin/** and /api/admin/**
public/                              Static images (garden/ backdrop set, photos/, decor/…)
data/                                Runtime CMS data (git-ignored)
tools/garden-bg/gen.py               Procedural generator for public/garden/* backdrop images
tools/figma-import/                  Figma plugin that rebuilds the landing pages from exported data
design.md                            Design system notes (palettes, typography, section layouts)
```

---

## Architecture decisions

**Route groups instead of separate apps.** `(hub)`, `(phanbon)` and `(verticals)` each own a layout
(header, footer, theme class, metadata) while sharing one deployment, one design-token file and one
CMS. Group names never appear in URLs.

**One dynamic segment for two sector sites.** `/lopxe` and `/satthep` share `app/(verticals)/[site]`,
validated by `resolveSite()` in `lib/site-params.ts`. Each site still gets its own home layout
(`lopxe-home.tsx`, `satthep-home.tsx`) and theme. `dynamicParams = false` is set on `[site]/page.tsx`
and `[site]/tin-tuc/page.tsx` so unknown first segments return a server-rendered 404. It is deliberately
**not** set on the layout, because layout config cascades to child pages and would 404 products and
articles added from the admin after the build.

**Server Components by default, client leaves.** Pages and sections render on the server; only
interactive leaves are client components (slideshow, tabs, menus, forms, crop picker, calculators,
maps). Admin-only heavy panels (guide centre, tour runner) are loaded with `next/dynamic({ ssr: false })`.

**Theme scoping with CSS variables.** `globals.css` defines Tailwind v4 `@theme` tokens; each site wraps
its tree in `.theme-hub`, `.theme-pb`, `.theme-lopxe` or `.theme-satthep`, which remap colour, radius and
heading variables. Shared components read the variables, so one component renders in every brand.
A single type scale (`text-display … text-micro`) and button scale (`lib/ui.ts`: 36/44/52 px) apply
everywhere; `cn()` is configured with the custom scale so `tailwind-merge` does not drop colour classes.

**Sector-site media.** Photos and videos of the tyre and steel home pages live in `src/constants/lopxe-media.ts` `src/constants/satthep-media.ts` and `src/constants/phanbon-media.ts` (helpers in `src/constants/media.ts`); inner-page title photos in `src/constants/page-heads.ts`. Sources:
local files from `public/`, free Unsplash photos and Mixkit clips (both licences allow commercial use without
attribution). `MediaVideo` plays muted loops only while on screen, has a pause button and never autoplays for
visitors who prefer reduced motion. Before go-live, download the remote files into `public/lopxe/` and point the
config at them, and swap stock media for real shop photos when available.

**Garden backdrop.** The hub and fertilizer pages share a sticky, fixed image layer
(`components/shared/garden`) behind the content, with leaf frames that change softly per section.
The images are generated procedurally by `tools/garden-bg/gen.py` (no third-party imagery).

**Fonts.** Be Vietnam Pro is self-hosted via `next/font/local` as two families split by
`unicode-range` (Latin, Vietnamese) so only the needed files load; the Vietnamese family is listed first
in `--font-sans`. Dancing Script (quotes) is not preloaded.

**File-JSON persistence behind one seam.** Settings, products and page content are validated with zod
and stored as JSON in `DATA_DIR` via `lib/store/json-file.ts` (atomic write-then-rename). When a file
is missing, sample data in code is used. Replacing that module with a database adapter is the only
change needed to move off the filesystem. Server Actions call `revalidatePath("/", "layout")` after
every write.

**Single sources of truth.** Company name, hotline, address, opening hours, social links and per-site
SEO come from admin → *Thông tin chung* (`data/settings.json`, defaults in `lib/verticals.ts`); the
fertilizer site reads them too. News for every surface comes from `getNews({ site?, limit? })`
(`lib/data/news.ts`), also exposed as `GET /api/tin-tuc`.

**Authentication.** `proxy.ts` gates `/admin/**` and `/api/admin/**` with a signed cookie; the protected
admin layout re-checks the session on the server (defence in depth). Admin responses are sent with
`X-Robots-Tag: noindex` and `Cache-Control: no-store`.

**Caching.** Catalog products, articles and category pages are prerendered (SSG) with
`generateStaticParams`; items added later render on demand. `next/image` serves AVIF/WebP with a 30-day cache TTL; uploads are served as
immutable.

**Error and loading UI.** Every route group has an `error.tsx` built on `components/shared/error-view.tsx`
(retry + way home); `global-error.tsx` covers the root layout. List and detail routes have `loading.tsx`
skeletons, except where streaming a skeleton would turn a 404 into a 200 (fertilizer category pages).

---

## SEO

- Root `metadataBase`, title templates per site; `fitTitle()` drops the brand suffix past 60 characters
  and `metaDescription()` assembles 120–155-character descriptions (`lib/seo.ts`).
- `socialMeta()` produces matching canonical, Open Graph and Twitter Card metadata for every page;
  `siteNameFor()` gives the right `og:site_name` per site.
- Generated Open Graph images (1200×630) for the hub, each site, products and articles (`lib/og.tsx`);
  placeholder photos are never used as share images.
- `sitemap.xml` (with `lastModified` only when a real date is known) and `robots.txt`
  (disallows `/admin`, `/api/`, `/phanbon/tim-kiem`).
- JSON-LD: `Organization` + `WebSite`, `Store` / `TireShop` / `HardwareStore`, `Product`, `Article`,
  `BreadcrumbList`.
- Semantic landmarks (`header`, `main`, `footer`, `nav`) and exactly one `<h1>` per page.

---

## Deployment

The app needs a **Node.js server with a writable disk** for `DATA_DIR` (VPS, Docker or any `next start`
host). Steps:

1. Set the environment variables above (`NEXT_PUBLIC_SITE_URL`, `ADMIN_*`, `AUTH_SECRET`, `DATA_DIR`).
2. `npm ci && npm run build && npm start` (behind a reverse proxy with HTTPS; HSTS is already sent).
3. Back up `DATA_DIR` (CMS data **and** uploaded images) regularly.

Notes:

- **Vercel / serverless:** the filesystem is read-only and ephemeral, so admin edits and uploads are
  **not persisted**; the site falls back to the sample data in code. Use a persistent host, or replace
  `lib/store/json-file.ts` (and `lib/uploads.ts`) with a database / object storage.
- `next.config.ts` contains a commented-out `rewrites()` block that maps `/lopxe/**` and `/satthep/**` to
  `/404` on Vercel, for launching with only the fertilizer site public. Uncomment it to enable.
- Security headers (`nosniff`, `SAMEORIGIN`, referrer and permissions policies, HSTS) are set globally in
  `next.config.ts`; `X-Powered-By` is disabled.

### Before go-live

1. Admin → *Thông tin chung*: replace the sample phone numbers, address, service area, Zalo, Facebook,
   founding year and `mapQuery`.
2. Replace sample products and news; add real photos (set `images` on a product to override the vector art).
3. Resolve the `TODO(client)` notes in `src/constants/*`, `src/lib/verticals.ts` and `src/lib/content/default-content.ts`
   (crop calendar, plant-doctor wording, tyre tiers, steel factors).
4. Add the Google Search Console token to `metadata.verification` in `src/app/layout.tsx` and submit the sitemap.

---

## Known limitations

- A nested path under an unknown site (e.g. `/abc/lien-he`, `/abc/san-pham`) returns status 404 with
  `noindex`, but the 404 content is rendered client-side because `notFound()` is thrown from the
  `[site]` layout. Single-segment and `/tin-tuc` paths render the 404 on the server.
- Contact, quote and call-back forms are UI only (no e-mail/CRM delivery yet).
- Product, news and testimonial data are placeholders until the client supplies real content.
- The tyre and steel sites are quote-only by design – prices change over time, so none are listed.
