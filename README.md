# greige-atelier

> An interior-design studio template — [Astro 7](https://astro.build) + SST v3. A warm greige ground, high-contrast serif display type with an italic counterpoint, monospace studio notes, and large unframed room photography — built from scratch with custom components.

[![CI](https://github.com/ctrimm/greige-atelier/actions/workflows/ci.yml/badge.svg)](https://github.com/ctrimm/greige-atelier/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/ctrimm/greige-atelier/actions/workflows/deploy.yml/badge.svg)](https://github.com/ctrimm/greige-atelier/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

**Live preview: https://ctrimm.github.io/greige-atelier/**

![Maren Vale Interiors — hero](screenshots/home-hero.png)

**Edit one config file, get a studio site** · **165 automated tests** · **Lighthouse Accessibility / Best Practices / SEO = 100** · **AI-readable (llms.txt, JSON-LD)**

The studio — **Maren Vale Interiors**, an interior design practice working
between Charleston and Copenhagen — is fully fictional, created for this
template. All copy is original (it lives in `site.config.ts`) and all
photographs are AI-generated for this project (originals in
`source-images/`).

## Stack
- **Astro 7.4** (static output)
- **SST v3** — `sst.aws.Astro` → S3 + CloudFront
- Custom components only; self-hosted fonts: Playfair Display (display
  serif), Inter (sans), IBM Plex Mono (studio notes & manifestos)

## Pages
- `/` — hero ("Rooms that hold the *light*"), monospace manifesto + studio
  stats, services index, selected projects, process, commission list
- `/services` — the four services with what's included, plus the process
- `/gallery` — every project, each linking to its own page
- `/story` — the studio's story, principles, availability, commissions
- `/contact` — enquiry email and what to know before writing
- `/<project>` — one page per project (stonehouse-kitchen, hearth-room,
  arch-bedroom, marble-bath, long-table-room), generated from the config

## Make it yours

Everything an owner changes — studio name, email, colors, every word and
every project — lives in **one file**: `site.config.ts` at the top of the
repo. Open it, change the values between the quotes, save. The file is
heavily commented for non-technical owners, and the build validates it:
a bad email, a missing photo or two projects with the same web address
stops the build with a plain-language list of what to fix.

Photos go in `public/images/`; run `python3 scripts/optimize-images.py`
afterwards to regenerate the responsive sizes (optional — the site serves
the original gracefully if a variant is missing).

## Develop

```sh
npm install
npm run dev        # local preview
npm run build      # production build → dist/
npm run test:all   # unit + integration + end-to-end tests
npm run grade      # Lighthouse against every page (needs Chrome)
```

## Tests

165 tests in three layers, all run in CI on every push:

- **Unit** (Vitest) — slug + headline helpers, font presets, theme CSS
  variables, palette contrast ratios computed from the shipped config
  (WCAG AA), project routing, image srcsets, and 30+ config-validation
  cases written from the owner's point of view.
- **Integration** (Vitest) — every configured photo and font really exists
  on disk and is a real JPEG/WOFF2; a real production build contains
  every page, project, service and commission; a second build in GitHub
  Pages subpath mode asserts every link, image, font and sitemap URL
  carries the prefix.
- **End-to-end** (Playwright) — the built site in a real browser:
  navigation and active states, theme colors applied from the config,
  images loading, alt text present, project-to-project cycling, and no
  horizontal overflow on mobile.

## Accessibility & performance notes

- All text colors are chosen to pass WCAG AA on their ground — the unit
  suite computes the ratios from the config so a palette edit that breaks
  contrast fails the build. The pale-brass accent (`#f0dcae`) is the
  lightest tone that still passes on the greige ground (`#66584b`).
- Scroll-reveal animations use transform only — deliberately **no
  opacity fade**, because audits that snapshot mid-fade report phantom
  contrast failures on half-blended colors.
- Lighthouse: Accessibility / Best Practices / SEO score 100 on every
  page, locally and in CI. Performance is 88–99 depending on the grading
  machine's CPU and the simulated network; in CI it is reported, not
  gated (the same stance as the owner's other Astro starters).

## AI readiness

- `/llms.txt` — a plain-language map of the site (services, projects,
  contact), generated from the config so it never drifts.
- schema.org `LocalBusiness` JSON-LD on every page.
- `/sitemap.xml` generated from the page + project list.
- `robots.txt` explicitly welcomes AI crawlers.

## Deploy

Preview deploys to GitHub Pages automatically on push to `main`
(`.github/workflows/deploy.yml`). Production is the owner's step:

```sh
npm run deploy              # SST dev stage
npm run deploy:production   # SST production stage
```

The Pages build uses `SITE`/`BASE` environment variables to serve under
the `/greige-atelier` subpath; those variables are scoped to the build
job only — if they leak into the test job, the e2e preview server serves
under the subpath and its root-URL check can never pass.

## License

MIT © 2026 Cory Trimm
