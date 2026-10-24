import { describe, it, expect } from "vitest";
import { existsSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "../../site.config";

const PUBLIC = join(process.cwd(), "public");

function expectRealJpeg(publicPath: string) {
  const file = join(PUBLIC, publicPath);
  expect(existsSync(file), `${publicPath} should exist in public/`).toBe(true);
  expect(statSync(file).size, `${publicPath} should not be empty`).toBeGreaterThan(1000);
  const head = readFileSync(file).subarray(0, 3);
  // JPEG magic bytes FF D8 FF
  expect([...head], `${publicPath} should be a real JPEG`).toEqual([0xff, 0xd8, 0xff]);
}

describe("config ↔ images on disk", () => {
  it("hero image exists and is a JPEG", () => {
    expectRealJpeg(config.home.heroImage);
  });
  it("story image exists and is a JPEG", () => {
    expectRealJpeg(config.story.image);
  });
  it.each(config.projects.map((p) => [p.title, p.image] as const))(
    "project image exists: %s",
    (_title, image) => {
      expectRealJpeg(image);
    }
  );
  it("every font preset's self-hosted woff2 files exist", async () => {
    const { FONT_PRESETS } = await import("../../src/data/site");
    for (const preset of Object.values(FONT_PRESETS)) {
      for (const file of [preset.serifFile, preset.sansFile, preset.monoFile]) {
        const path = join(PUBLIC, file);
        expect(existsSync(path), file).toBe(true);
        const head = readFileSync(path).subarray(0, 4).toString("ascii");
        expect(head, `${file} should be a woff2`).toBe("wOF2");
      }
    }
  });
  it("every @font-face file referenced by the plumbing exists", async () => {
    const { fontFaceCss } = await import("../../src/data/site");
    const files = [...fontFaceCss().matchAll(/\/fonts\/([a-z0-9-]+\.woff2)/g)].map((m) => m[1]);
    expect(files.length).toBeGreaterThanOrEqual(6);
    for (const f of files) {
      expect(existsSync(join(PUBLIC, "fonts", f)), f).toBe(true);
    }
  });
  it("favicon and robots.txt ship in public/", () => {
    expect(existsSync(join(PUBLIC, "favicon.svg"))).toBe(true);
    const robots = readFileSync(join(PUBLIC, "robots.txt"), "utf-8");
    expect(robots).toMatch(/User-agent: \*/);
    expect(robots).toMatch(/Allow: \//);
  });
  it("responsive variants exist for the hero and story images", () => {
    for (const v of ["hero-640.jpg", "hero-960.jpg", "hero-1440.jpg", "story-550.jpg", "story-800.jpg"]) {
      expect(existsSync(join(PUBLIC, "images", v)), v).toBe(true);
    }
  });
});

describe("config completeness for the templates", () => {
  it("every image has meaningful alt text configured", () => {
    expect(config.home.heroImageAlt.trim().length).toBeGreaterThan(10);
    expect(config.story.imageAlt.trim().length).toBeGreaterThan(10);
    for (const p of config.projects) {
      expect(p.imageAlt.trim().length, p.title).toBeGreaterThan(10);
    }
  });
  it("hero headline is 1–3 lines, with exactly one italic marker pair", () => {
    expect(config.home.headline.length).toBeGreaterThanOrEqual(1);
    expect(config.home.headline.length).toBeLessThanOrEqual(3);
    const markers = config.home.headline.join(" ").match(/\*/g) ?? [];
    expect(markers.length).toBe(2);
  });
  it("social links labelled Email point at the identity email", () => {
    const emailSocial = config.socials.find((s) => s.label === "Email");
    if (emailSocial) {
      expect(emailSocial.href).toBe(`mailto:${config.identity.email}`);
    }
  });
  it("every commission names a place and a year", () => {
    for (const c of config.commissions) {
      expect(c.year).toMatch(/^\d{4}$/);
      expect(c.location.trim().length).toBeGreaterThan(2);
    }
  });
});
