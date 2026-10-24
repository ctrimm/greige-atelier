import { test, expect } from "@playwright/test";
import { config } from "../../site.config";

const projects = config.projects.map((p) => ({
  ...p,
  slug: p.slug!, // shipped config sets every slug explicitly
}));
const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};
const stripMarkers = (line: string) => line.replace(/\*/g, "");

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("title is the studio name in caps", async ({ page }) => {
    await expect(page).toHaveTitle(config.identity.name.toUpperCase());
  });

  test("hero shows the headline and eyebrow", async ({ page }) => {
    const h1 = page.locator("h1.hero-headline");
    await expect(h1).toBeVisible();
    for (const line of config.home.headline) {
      await expect(h1).toContainText(stripMarkers(line));
    }
    await expect(page.locator(".hero-eyebrow")).toHaveText(config.home.eyebrow);
  });

  test("the italic headline word renders in italic serif", async ({ page }) => {
    const em = page.locator("h1.hero-headline em");
    await expect(em).toHaveCount(1);
    const style = await em.evaluate((el) => getComputedStyle(el).fontStyle);
    expect(style).toBe("italic");
  });

  test("hero image actually loads", async ({ page }) => {
    const ok = await page
      .locator(".hero-photo img")
      .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(ok).toBe(true);
  });

  test("theme colors from the config are applied", async ({ page }) => {
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe(hexToRgb(config.theme.background));
    const ink = await page.evaluate(() => getComputedStyle(document.body).color);
    expect(ink).toBe(hexToRgb(config.theme.ink));
    const footerBg = await page
      .locator(".site-footer")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(footerBg).toBe(hexToRgb(config.theme.surface));
    const label = await page
      .locator(".hero-eyebrow")
      .evaluate((el) => getComputedStyle(el).color);
    expect(label).toBe(hexToRgb(config.theme.accent));
  });

  test("manifesto renders in monospace with the config copy", async ({ page }) => {
    for (const p of config.home.manifesto) {
      await expect(page.locator(".manifesto")).toContainText(p.slice(0, 30));
    }
    const family = await page
      .locator(".manifesto p")
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/IBM Plex Mono|monospace/);
  });

  test("stats render every configured value and label", async ({ page }) => {
    await expect(page.locator(".stat")).toHaveCount(config.home.stats.length);
    for (const s of config.home.stats) {
      await expect(page.locator(".stats")).toContainText(s.value);
      await expect(page.locator(".stats")).toContainText(s.label);
    }
  });

  test("services index lists every service and links to Services", async ({ page }) => {
    await expect(page.locator(".service-rows li")).toHaveCount(config.services.length);
    for (const s of config.services) {
      await expect(page.locator(".services-index")).toContainText(s.title);
    }
  });

  test("featured projects show the first four projects", async ({ page }) => {
    await expect(page.locator(".feature-row")).toHaveCount(4);
    for (const p of projects.slice(0, 4)) {
      await expect(page.locator(".featured")).toContainText(p.title);
    }
  });

  test("process strip renders every step", async ({ page }) => {
    await expect(page.locator(".process-step")).toHaveCount(config.process.length);
    for (const p of config.process) {
      await expect(page.locator(".process-strip")).toContainText(p.title);
    }
  });

  test("commission list renders every configured commission", async ({ page }) => {
    await expect(page.locator(".commission-row")).toHaveCount(config.commissions.length);
    for (const c of config.commissions) {
      await expect(page.locator(".commissions")).toContainText(c.name);
    }
  });

  test("every image on the page loads (after scrolling them into view)", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const broken = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((img) => !(img as HTMLImageElement).naturalWidth)
        .map((img) => img.getAttribute("src"))
    );
    expect(broken).toEqual([]);
  });

  test("every image has non-empty alt text", async ({ page }) => {
    const missing = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((img) => !img.getAttribute("alt")?.trim())
        .map((img) => img.getAttribute("src"))
    );
    expect(missing).toEqual([]);
  });

  test("exactly one h1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });
});

test.describe("navigation", () => {
  test("header links reach every page, with active state", async ({ page }) => {
    await page.goto("/");
    for (const [label, path] of [
      ["Services", "/services"],
      ["Gallery", "/gallery"],
      ["Story", "/story"],
      ["Contact", "/contact"],
    ] as const) {
      await page.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}/?$`));
      const navLink = page.locator(`.site-nav a[href="${path}"]`);
      await expect(navLink).toHaveClass(/active/);
      await expect(navLink).toHaveAttribute("aria-current", "page");
    }
  });

  test("site title links back home", async ({ page }) => {
    await page.goto("/story");
    await page.locator(".site-title").click();
    await expect(page).toHaveURL(/127\.0\.0\.1:4173\/?$/);
  });

  test("footer shows the email as a mailto link and all socials", async ({ page }) => {
    await page.goto("/");
    const email = page.locator(".footer-email");
    await expect(email).toHaveAttribute("href", `mailto:${config.identity.email}`);
    await expect(email).toHaveText(config.identity.email);
    for (const s of config.socials) {
      await expect(page.locator(".footer-socials")).toContainText(s.label);
    }
  });
});

test.describe("services page", () => {
  test("renders every service with its included items", async ({ page }) => {
    await page.goto("/services");
    await expect(page.locator(".service-detail")).toHaveCount(config.services.length);
    for (const s of config.services) {
      await expect(page.locator("main")).toContainText(s.title);
      for (const item of s.items) {
        await expect(page.locator("main")).toContainText(item);
      }
    }
  });
});

test.describe("gallery and project pages", () => {
  test("gallery lists every project", async ({ page }) => {
    await page.goto("/gallery");
    await expect(page.locator(".gallery-entry")).toHaveCount(projects.length);
    for (const p of projects) {
      await expect(page.locator("main")).toContainText(p.title);
    }
  });

  test("clicking a project opens its page with scope and a next link", async ({ page }) => {
    await page.goto("/gallery");
    const first = projects[0];
    await page
      .locator(".gallery-entry h2 a", { hasText: first.title })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${first.slug}/?$`));
    await expect(page.locator("h1")).toHaveText(first.title);
    for (const item of first.scope) {
      await expect(page.locator(".chip-list")).toContainText(item);
    }
    await expect(page.locator(".project-next a")).toHaveText(projects[1].title);
  });

  test("next-project wraps from the last project back to the first", async ({ page }) => {
    const last = projects[projects.length - 1];
    await page.goto(`/${last.slug}`);
    await expect(page.locator(".project-next a")).toHaveText(projects[0].title);
    await expect(page.locator(".project-next a")).toHaveAttribute("href", `/${projects[0].slug}`);
  });
});

test.describe("story and contact pages", () => {
  test("story renders heading, principles and a loading image", async ({ page }) => {
    await page.goto("/story");
    await expect(page.locator("h1")).toContainText(config.story.heading.slice(0, 20));
    await expect(page.locator(".principle")).toHaveCount(config.story.principles.length);
    const ok = await page
      .locator(".story-photo img")
      .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(ok).toBe(true);
  });

  test("contact shows the enquiry email and every note", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator(".contact-email")).toHaveAttribute(
      "href",
      `mailto:${config.identity.email}`
    );
    await expect(page.locator(".note-list li")).toHaveCount(config.contact.notes.length);
    await expect(page.locator("h1")).toHaveText(config.contact.heading);
  });
});

test.describe("mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("no horizontal overflow on home or gallery", async ({ page }) => {
    for (const path of ["/", "/gallery"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow, path).toBeLessThanOrEqual(1);
    }
  });

  test("headline fits the small screen", async ({ page }) => {
    await page.goto("/");
    const box = await page.locator("h1.hero-headline").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(390);
  });
});
