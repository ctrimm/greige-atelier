import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

// The GitHub Pages preview is served from a subpath (/greige-atelier).
// This suite builds exactly the way the deploy workflow does and checks
// that every internal URL carries the prefix — the class of bug that
// makes a Pages preview look fine on the home page and broken everywhere
// else (unstyled fonts, dead links, 404 images).
const OUT = "/tmp/greige-pages-build";
const read = (p: string) => readFileSync(join(OUT, p), "utf-8");

beforeAll(() => {
  rmSync(OUT, { recursive: true, force: true });
  execSync(`npx astro build --outDir ${OUT}`, {
    stdio: "pipe",
    timeout: 180_000,
    // Deliberately a clean environment, not a spread of process.env:
    // a variable inherited from the test-runner process makes Vite
    // silently drop the site/base config (verified empirically — with a
    // spread env the same command emits an unprefixed root build).
    env: {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      SITE: "https://ctrimm.github.io",
      BASE: "/greige-atelier",
    },
  });
}, 200_000);

describe("GitHub Pages build (subpath mode)", () => {
  it("prefixes navigation and project links", () => {
    const html = read("index.html");
    expect(html).toContain('href="/greige-atelier/services"');
    expect(html).toContain('href="/greige-atelier/gallery"');
    expect(html).toContain('href="/greige-atelier/stonehouse-kitchen"');
  });
  it("prefixes image sources and srcsets", () => {
    const html = read("index.html");
    expect(html).toContain('src="/greige-atelier/images/hero.jpg"');
    expect(html).toContain("/greige-atelier/images/hero-640.jpg 640w");
    expect(html).not.toContain('src="/images/');
  });
  it("prefixes the self-hosted font URLs in the generated @font-face CSS", () => {
    expect(read("index.html")).toContain(
      'url("/greige-atelier/fonts/playfair-display-normal.woff2")'
    );
    expect(read("index.html")).toContain(
      'url("/greige-atelier/fonts/ibm-plex-mono-400.woff2")'
    );
  });
  it("prefixes favicon and font preloads", () => {
    const html = read("index.html");
    expect(html).toContain('href="/greige-atelier/favicon.svg"');
    expect(html).toContain('href="/greige-atelier/fonts/playfair-display-normal.woff2"');
  });
  it("sitemap URLs carry the full Pages address", () => {
    const xml = read("sitemap.xml");
    expect(xml).toContain("https://ctrimm.github.io/greige-atelier/services</loc>");
    expect(xml).toContain(
      "https://ctrimm.github.io/greige-atelier/long-table-room</loc>"
    );
  });
  it("project pages prefix the next-project link", () => {
    const html = read("stonehouse-kitchen/index.html");
    expect(html).toContain('href="/greige-atelier/hearth-room"');
  });
});
