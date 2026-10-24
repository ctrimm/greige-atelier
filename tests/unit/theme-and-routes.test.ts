import { describe, it, expect } from "vitest";
import {
  getFontPreset,
  themeCssVars,
  FONT_PRESETS,
  DEFAULT_FONT_PRESET,
  projects,
  projectRoutes,
  nextProject,
  mailto,
  imgSrcset,
} from "../../src/data/site";
import { config } from "../../site.config";

describe("font presets", () => {
  it("returns the default preset for undefined", () => {
    expect(getFontPreset(undefined)).toBe(FONT_PRESETS[DEFAULT_FONT_PRESET]);
  });
  it("returns the default preset for an unknown name", () => {
    expect(getFontPreset("nope")).toBe(FONT_PRESETS[DEFAULT_FONT_PRESET]);
  });
  it("returns each named preset", () => {
    for (const name of Object.keys(FONT_PRESETS)) {
      expect(getFontPreset(name)).toBe(FONT_PRESETS[name]);
    }
  });
  it("every preset has serif/sans/mono stacks and self-hosted font files", () => {
    for (const preset of Object.values(FONT_PRESETS)) {
      expect(preset.serif).toMatch(/serif/);
      expect(preset.sans).toMatch(/sans-serif/);
      expect(preset.mono).toMatch(/monospace/);
      expect(preset.serifFile).toMatch(/^\/fonts\/[a-z0-9-]+\.woff2$/);
      expect(preset.sansFile).toMatch(/^\/fonts\/[a-z0-9-]+\.woff2$/);
      expect(preset.monoFile).toMatch(/^\/fonts\/[a-z0-9-]+\.woff2$/);
    }
  });
});

describe("themeCssVars", () => {
  const css = themeCssVars(config.theme);
  it("emits the configured colors", () => {
    expect(css).toContain(`--bg: ${config.theme.background};`);
    expect(css).toContain(`--surface: ${config.theme.surface};`);
    expect(css).toContain(`--ink: ${config.theme.ink};`);
    expect(css).toContain(`--deep: ${config.theme.deep};`);
    expect(css).toContain(`--accent: ${config.theme.accent};`);
    expect(css).toContain(`--deep-ink: ${config.theme.deepInk};`);
  });
  it("emits the configured font stacks", () => {
    const preset = getFontPreset(config.theme.fonts);
    expect(css).toContain(`--serif: ${preset.serif};`);
    expect(css).toContain(`--sans: ${preset.sans};`);
    expect(css).toContain(`--mono: ${preset.mono};`);
  });
  it("is a single :root block", () => {
    expect(css.startsWith(":root {")).toBe(true);
    expect(css.trimEnd().endsWith("}")).toBe(true);
  });
});

describe("palette contrast (WCAG AA, computed from the shipped config)", () => {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const lin = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  };
  const ratio = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  it("body ink on the greige ground passes AA for normal text", () => {
    expect(ratio(config.theme.ink, config.theme.background)).toBeGreaterThanOrEqual(4.5);
  });
  it("accent (small labels/numerals) on the ground passes AA", () => {
    expect(ratio(config.theme.accent, config.theme.background)).toBeGreaterThanOrEqual(4.5);
  });
  it("deep ink on the pale surface passes AA", () => {
    expect(ratio(config.theme.deepInk, config.theme.surface)).toBeGreaterThanOrEqual(4.5);
  });
  it("deep headings on the pale surface pass AA", () => {
    expect(ratio(config.theme.deep, config.theme.surface)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("project routes", () => {
  it("generates one route per project, in config order", () => {
    const routes = projectRoutes();
    expect(routes).toHaveLength(config.projects.length);
    expect(routes.map((r) => r.params.slug)).toEqual(projects.map((p) => p.slug));
  });
  it("every route's next project wraps around", () => {
    const routes = projectRoutes();
    routes.forEach((r, i) => {
      expect(r.props.project).toBe(projects[i]);
      expect(r.props.next).toBe(projects[(i + 1) % projects.length]);
    });
    expect(routes[routes.length - 1].props.next).toBe(projects[0]);
  });
  it("all slugs are unique", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });
  it("no project slug collides with a fixed page route", () => {
    const fixed = ["services", "gallery", "story", "contact"];
    for (const p of projects) expect(fixed).not.toContain(p.slug);
  });
});

describe("nextProject", () => {
  it("returns the following project", () => {
    expect(nextProject(projects[0].slug)).toBe(projects[1]);
  });
  it("wraps from last to first", () => {
    expect(nextProject(projects[projects.length - 1].slug)).toBe(projects[0]);
  });
  it("throws for an unknown slug", () => {
    expect(() => nextProject("no-such-project")).toThrow(/Unknown project slug/);
  });
});

describe("mailto", () => {
  it("prefixes an email address", () => {
    expect(mailto("a@b.co")).toBe("mailto:a@b.co");
  });
});

describe("imgSrcset", () => {
  it("includes existing hero variants plus the original, sorted by width", () => {
    const srcset = imgSrcset("/images/hero.jpg", [640, 960, 1440], 1920);
    expect(srcset).toBe(
      "/images/hero-640.jpg 640w, /images/hero-960.jpg 960w, /images/hero-1440.jpg 1440w, /images/hero.jpg 1920w"
    );
  });
  it("includes project variants at their real widths", () => {
    const srcset = imgSrcset("/images/project-living.jpg", [480, 960], 944);
    expect(srcset).toBe(
      "/images/project-living-480.jpg 480w, /images/project-living.jpg 944w, /images/project-living-960.jpg 960w"
    );
  });
  it("skips variants that don't exist on disk", () => {
    expect(imgSrcset("/images/hero.jpg", [123], 1920)).toBeUndefined();
  });
  it("returns undefined for an image with no variants at all", () => {
    expect(imgSrcset("/images/story.jpg", [999], 1280)).toBeUndefined();
  });
});
