import { describe, it, expect } from "vitest";
import { validateConfig, isValidEmail, isValidHexColor } from "../../src/data/site";
import { config } from "../../site.config";

const clone = () => structuredClone(config) as typeof config;

describe("the shipped site.config.ts", () => {
  it("validates with zero problems", () => {
    expect(validateConfig(config)).toEqual([]);
  });
});

describe("validateConfig catches owner mistakes", () => {
  it("flags an empty studio name", () => {
    const cfg = clone();
    cfg.identity.name = "  ";
    expect(validateConfig(cfg).join(" ")).toMatch(/identity\.name/);
  });
  it("flags a malformed email", () => {
    const cfg = clone();
    cfg.identity.email = "hello at marenvale";
    expect(validateConfig(cfg).join(" ")).toMatch(/identity\.email/);
  });
  it("flags an empty role and location", () => {
    const cfg = clone();
    cfg.identity.role = "";
    cfg.identity.location = "";
    const problems = validateConfig(cfg).join(" ");
    expect(problems).toMatch(/identity\.role/);
    expect(problems).toMatch(/identity\.location/);
  });
  it.each(["background", "surface", "ink", "deep", "accent", "deepInk"] as const)(
    "flags a non-hex theme.%s",
    (key) => {
      const cfg = clone();
      cfg.theme[key] = "greige";
      expect(validateConfig(cfg).join(" ")).toMatch(new RegExp(`theme\\.${key}`));
    }
  );
  it("flags an unknown font preset", () => {
    const cfg = clone();
    cfg.theme.fonts = "comic-sans";
    expect(validateConfig(cfg).join(" ")).toMatch(/theme\.fonts/);
  });
  it("flags an empty hero headline", () => {
    const cfg = clone();
    cfg.home.headline = [];
    expect(validateConfig(cfg).join(" ")).toMatch(/home\.headline/);
  });
  it("flags a hero image outside /images/", () => {
    const cfg = clone();
    cfg.home.heroImage = "hero.jpg";
    expect(validateConfig(cfg).join(" ")).toMatch(/home\.heroImage/);
  });
  it("flags missing hero alt text", () => {
    const cfg = clone();
    cfg.home.heroImageAlt = "";
    expect(validateConfig(cfg).join(" ")).toMatch(/heroImageAlt/);
  });
  it("flags an empty manifesto and empty stat fields", () => {
    const cfg = clone();
    cfg.home.manifesto = [];
    cfg.home.stats[0].value = "";
    cfg.home.stats[1].label = "";
    const problems = validateConfig(cfg).join(" ");
    expect(problems).toMatch(/manifesto/);
    expect(problems).toMatch(/stats #1/);
    expect(problems).toMatch(/stats #2/);
  });
  it("flags a service with no summary or no items", () => {
    const cfg = clone();
    cfg.services[0].summary = "";
    cfg.services[1].items = [];
    const problems = validateConfig(cfg).join(" ");
    expect(problems).toMatch(/summary is empty/);
    expect(problems).toMatch(/at least one item/);
  });
  it("flags empty process fields", () => {
    const cfg = clone();
    cfg.process[0].step = "";
    cfg.process[0].title = "";
    cfg.process[0].text = "";
    expect(validateConfig(cfg).length).toBeGreaterThanOrEqual(3);
  });
  it("flags a story image outside /images/ and empty principles", () => {
    const cfg = clone();
    cfg.story.image = "/story.jpg";
    cfg.story.principles[0].title = "";
    cfg.story.principles[0].text = "";
    const problems = validateConfig(cfg).join(" ");
    expect(problems).toMatch(/story\.image/);
    expect(problems).toMatch(/principles #1/);
  });
  it("flags an empty project list", () => {
    const cfg = clone();
    cfg.projects = [];
    expect(validateConfig(cfg).join(" ")).toMatch(/projects is empty/);
  });
  it.each([
    ["title", ""],
    ["location", ""],
    ["category", ""],
    ["year", ""],
    ["summary", ""],
    ["imageAlt", ""],
  ] as const)("flags an empty project %s", (key, value) => {
    const cfg = clone();
    (cfg.projects[0] as Record<string, unknown>)[key] = value;
    expect(validateConfig(cfg).length).toBeGreaterThan(0);
  });
  it("flags a project image outside /images/ and an empty scope", () => {
    const cfg = clone();
    cfg.projects[0].image = "https://example.com/room.jpg";
    cfg.projects[0].scope = [];
    const problems = validateConfig(cfg).join(" ");
    expect(problems).toMatch(/image should be a path/);
    expect(problems).toMatch(/scope needs at least one item/);
  });
  it("flags an invalid explicit slug", () => {
    const cfg = clone();
    cfg.projects[0].slug = "Not A Slug!";
    expect(validateConfig(cfg).join(" ")).toMatch(/slug/);
  });
  it("flags duplicate slugs", () => {
    const cfg = clone();
    cfg.projects[1].slug = cfg.projects[0].slug;
    expect(validateConfig(cfg).join(" ")).toMatch(/already used by/);
  });
  it("accepts a project with the slug left out (auto-slugified)", () => {
    const cfg = clone();
    delete (cfg.projects[0] as { slug?: string }).slug;
    expect(validateConfig(cfg)).toEqual([]);
  });
  it("flags empty commission fields", () => {
    const cfg = clone();
    cfg.commissions[0].year = "";
    cfg.commissions[0].name = "";
    cfg.commissions[0].location = "";
    expect(validateConfig(cfg).length).toBeGreaterThanOrEqual(3);
  });
  it("flags empty social label and href", () => {
    const cfg = clone();
    cfg.socials[0].label = "";
    cfg.socials[0].href = "";
    expect(validateConfig(cfg).length).toBeGreaterThanOrEqual(2);
  });
  it("flags empty contact heading and text", () => {
    const cfg = clone();
    cfg.contact.heading = "";
    cfg.contact.text = "";
    expect(validateConfig(cfg).length).toBeGreaterThanOrEqual(2);
  });
});

describe("isValidEmail / isValidHexColor", () => {
  it.each([
    ["hello@marenvaleinteriors.com", true],
    ["a@b.co", true],
    ["not-an-email", false],
    ["missing@tld", false],
    ["two@@at.com", false],
    ["", false],
  ])("isValidEmail(%j) → %j", (input, expected) => {
    expect(isValidEmail(input)).toBe(expected);
  });
  it.each([
    ["#66584b", true],
    ["#fff", true],
    ["#F0DCAE", true],
    ["66584b", false],
    ["#12345", false],
    ["#gggggg", false],
    ["", false],
  ])("isValidHexColor(%j) → %j", (input, expected) => {
    expect(isValidHexColor(input)).toBe(expected);
  });
});
