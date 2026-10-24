import type { APIRoute } from "astro";
import { site, projects, commissions, url as withBase } from "../data/site";

/**
 * /llms.txt — a plain-language map of this site for AI assistants,
 * following the llms.txt convention. Generated from site.config.ts so
 * it can never drift out of sync with the site itself.
 */
export const GET: APIRoute = () => {
  const base = site.siteUrl;
  const url = (path: string) => (base ? `${base}${withBase(path)}` : withBase(path));
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.name} is an ${site.role.toLowerCase()} based in ${site.location}. This site presents the studio's services, selected interior projects, story and contact details.`,
    "",
    "## Pages",
    "",
    `- [Home](${url("/")}): Hero, studio manifesto, services index, selected projects, process and commissions.`,
    `- [Services](${url("/services")}): The studio's four services and how a commission unfolds.`,
    `- [Gallery](${url("/gallery")}): All projects.`,
    `- [Story](${url("/story")}): The studio's story, principles and availability.`,
    `- [Contact](${url("/contact")}): How to enquire about a commission.`,
    "",
    "## Services",
    "",
    ...site.services.map((s) => `- ${s.title}: ${s.summary}`),
    "",
    "## Projects",
    "",
    ...projects.map(
      (p) => `- [${p.title}](${url("/" + p.slug)}): ${p.category} in ${p.location}, ${p.year}. ${p.summary}`
    ),
    "",
    "## Selected commissions",
    "",
    ...commissions.map((c) => `- ${c.name} — ${c.location}, ${c.year}`),
    "",
    "## Contact",
    "",
    `- Email: ${site.email}`,
    ...site.socials.map((s) => `- ${s.label}: ${s.href}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
