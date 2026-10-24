/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  YOUR INTERIOR STUDIO — EDIT THIS FILE ONLY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  This is the only file you need to touch to make this template yours.
 *  Change the words between the quotes, save, and rebuild / redeploy:
 *
 *      npm run dev        → preview your changes live
 *      npm run deploy     → publish them
 *
 *  Rules of thumb:
 *  • Keep the quotes " " around text and keep commas where you find them.
 *  • Images live in `public/images/` — put a photo there and write its
 *    path below, for example "/images/living-room.jpg".
 *  • A project's `slug` is its web address: "stonehouse-kitchen" becomes
 *    yoursite.com/stonehouse-kitchen. Lowercase letters, numbers and
 *    dashes only. Leave it out and one is made from the title.
 *  • Colors are hex codes like "#66584b". Search "hex color picker" if
 *    you want a different palette.
 *
 *  If something here is invalid — a bad email, a missing field, two
 *  projects with the same slug — the build stops and tells you exactly
 *  what to fix, in plain language.
 */

export const config = {
  // ── The studio ───────────────────────────────────────────────────────────
  identity: {
    name: "Maren Vale Interiors",
    shortName: "Maren Vale",
    role: "Interior Design Studio",
    email: "hello@marenvaleinteriors.com",
    // Your site's address once it is live, e.g. "https://marenvale.com".
    // Used for search engines and AI assistants. Leave "" until you have one.
    siteUrl: "",
    location: "Charleston · Copenhagen",
    founded: "2016",
    // Shown in the footer. Set to "" to hide the credit line.
    credit: "Made with Astro + SST",
  },

  // ── Social / contact links (footer) ──────────────────────────────────────
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Pinterest", href: "#" },
    { label: "Email", href: "mailto:hello@marenvaleinteriors.com" },
  ],

  // ── Look & feel ──────────────────────────────────────────────────────────
  theme: {
    background: "#66584b", // warm greige — the page ground
    surface: "#e9e1d4", // pale stone — panels and the footer
    ink: "#f7f2e9", // warm off-white — text on the greige ground
    deep: "#2c2721", // near-black brown — headings on pale panels
    accent: "#f0dcae", // pale brass — rules, numerals, small highlights
    // Body text color on the pale surface. Kept separate so small text
    // always has enough contrast on whichever ground it sits.
    deepInk: "#37312a",
    // One preset: "atelier" — high-contrast serif display, clean sans for
    // UI, and a monospace for the studio's notes and manifestos.
    fonts: "atelier",
  },

  // ── Home page ────────────────────────────────────────────────────────────
  home: {
    eyebrow: "Interior design for slow, luminous living",
    // The giant headline. Mark a word with *asterisks* to set it in italic.
    headline: ["Rooms that", "hold the *light*"],
    heroImage: "/images/hero.jpg",
    heroImageAlt:
      "Marble kitchen island and pale oak dining table in a sunlit room with greige walls",
    manifesto: [
      "Maren Vale Interiors is a studio for homes that feel inevitable — rooms composed from stone, plaster, pale timber and daylight, then softened with linen, wool and things made by hand. We believe a room should hold its people the way a well-cut coat does: quietly, and without effort.",
      "Every commission begins with the light. Where it enters, where it rests, where it leaves. Furniture, color and texture follow from there.",
    ],
    stats: [
      { value: "48", label: "Homes completed" },
      { value: "09", label: "Years of practice" },
      { value: "02", label: "Studios — Charleston & Copenhagen" },
    ],
  },

  // ── Services ─────────────────────────────────────────────────────────────
  // The home page shows the titles; the Services page shows everything.
  services: [
    {
      title: "Full-home interiors",
      summary:
        "Complete design for new builds and whole-home renovations, from the first plan to the last cushion.",
      items: ["Space planning", "Materials & finishes", "Bespoke joinery", "Installation & styling"],
    },
    {
      title: "Renovation direction",
      summary:
        "A steady design hand for projects already underway — decisions made in the right order, before they become expensive.",
      items: ["Kitchen & bath design", "Lighting plans", "Site reviews", "Trade coordination"],
    },
    {
      title: "Furniture & art",
      summary:
        "Sourcing and commissioning the pieces a room will be remembered by, including vintage and one-off work.",
      items: ["Furniture plans", "Vintage sourcing", "Art placement", "Textiles & rugs"],
    },
    {
      title: "Design consultation",
      summary:
        "A half-day working session in your home or over video — leave with a palette, a plan and a short list.",
      items: ["Color & materials palette", "Layout review", "Shopping shortlist", "Follow-up notes"],
    },
  ],

  // ── How the studio works ─────────────────────────────────────────────────
  process: [
    {
      step: "01",
      title: "Listen",
      text: "We walk the rooms, talk about how you live, and photograph the light at different hours.",
    },
    {
      step: "02",
      title: "Compose",
      text: "Plans, palettes and a materials board you can touch — stone, timber, fabric, metal — before anything is ordered.",
    },
    {
      step: "03",
      title: "Build",
      text: "We coordinate makers and trades, review the work on site, and solve problems while they are still small.",
    },
    {
      step: "04",
      title: "Settle",
      text: "Furniture placed, shelves arranged, art hung. The house is handed back ready to be lived in, not just looked at.",
    },
  ],

  // ── Projects ─────────────────────────────────────────────────────────────
  // Add, remove or reorder freely — the home page, the Gallery page and
  // each project's own page are all generated from this list.
  projects: [
    {
      slug: "stonehouse-kitchen",
      title: "Stonehouse Kitchen",
      location: "Charleston, South Carolina",
      category: "Kitchen & Dining",
      year: "2025",
      image: "/images/hero.jpg",
      imageAlt: "Marble island and oak dining table beneath a sculptural pendant light",
      summary:
        "A working kitchen built around a single slab of veined marble — pale oak, plaster walls and a pendant like a handful of petals. The dining table sits in the window light, where the room spends its mornings.",
      scope: ["Space planning", "Bespoke joinery", "Stone & materials", "Lighting"],
    },
    {
      slug: "hearth-room",
      title: "Hearth Room",
      location: "Hudson, New York",
      category: "Living Room",
      year: "2024",
      image: "/images/project-living.jpg",
      imageAlt: "Linen sofa and oak coffee table facing a stacked-stone fireplace",
      summary:
        "A living room arranged around its fireplace: stacked local stone, a deep linen sofa, and nothing on the walls to compete with the fire. Sheer curtains keep the daylight soft from morning to evening.",
      scope: ["Interior architecture", "Furniture", "Textiles", "Styling"],
    },
    {
      slug: "arch-bedroom",
      title: "Arch Bedroom",
      location: "Copenhagen, Denmark",
      category: "Primary Suite",
      year: "2024",
      image: "/images/project-bedroom.jpg",
      imageAlt: "Bed with layered linen bedding inside a plastered arch niche",
      summary:
        "A sleeping niche carved into plaster — the bed sits inside a shallow arch that catches the first light and holds the room's quiet. Layered linen and wool do the rest; there is deliberately little else.",
      scope: ["Space planning", "Plasterwork", "Bespoke bed & storage", "Textiles"],
    },
    {
      slug: "marble-bath",
      title: "Marble Bath",
      location: "Tribeca, New York",
      category: "Bathroom",
      year: "2023",
      image: "/images/project-bath.jpg",
      imageAlt: "Marble bathroom with round mirror, brass taps and an oak vanity",
      summary:
        "One stone, used everywhere: walls, counter and sill all cut from the same marble, so the small room feels carved rather than tiled. Brass taps and an oak vanity warm it; a round mirror keeps it gentle.",
      scope: ["Stone & materials", "Vanity design", "Fixtures", "Lighting"],
    },
    {
      slug: "long-table-room",
      title: "Long Table Room",
      location: "Charleston, South Carolina",
      category: "Dining Room",
      year: "2025",
      image: "/images/project-dining.jpg",
      imageAlt: "Long oak dining table with boucle chairs under woven pendant lights",
      summary:
        "A dining room for twelve that still feels intimate at two: a long oak table, boucle chairs with real backs, woven pendants low over the table, and plaster walls that take candlelight beautifully.",
      scope: ["Furniture", "Lighting", "Plaster finishes", "Tableware & styling"],
    },
  ],

  // ── Story page ───────────────────────────────────────────────────────────
  story: {
    image: "/images/story.jpg",
    imageAlt:
      "A studio worktable with marble and travertine samples, fabric swatches and a floor plan sketch",
    heading: "A studio built on daylight and honest materials",
    paragraphs: [
      "Maren Vale founded the studio in 2016 after a decade restoring houses in Denmark and the American South — two places that agree on very little, except that a room should be built for its weather and its light.",
      "The studio works with a small bench of joiners, plasterers and stone yards. We take on few projects at a time, and we stay until the last picture is hung. Most of our work arrives by word of mouth, from one finished room to the next.",
    ],
    principles: [
      {
        title: "Light first",
        text: "Orientation and daylight decide the plan. Everything else is negotiable; the sun is not.",
      },
      {
        title: "Few materials, well chosen",
        text: "Stone, timber, plaster, linen, wool, brass. A short list, repeated with intent, beats a long one every time.",
      },
      {
        title: "Rooms for living",
        text: "Chairs you can sit in for three hours. Surfaces that forgive a coffee ring. Beauty that survives Tuesday.",
      },
    ],
    availability: "Now booking full-home commissions for next spring — two places remain.",
  },

  // ── Selected commissions (home + story pages) ────────────────────────────
  commissions: [
    { year: "2025", name: "Stonehouse Kitchen", location: "Charleston" },
    { year: "2025", name: "Long Table Room", location: "Charleston" },
    { year: "2024", name: "Arch Bedroom", location: "Copenhagen" },
    { year: "2024", name: "Hearth Room", location: "Hudson" },
    { year: "2023", name: "Marble Bath", location: "Tribeca" },
    { year: "2023", name: "Garden Apartment", location: "Copenhagen" },
  ],

  // ── Contact page ─────────────────────────────────────────────────────────
  contact: {
    heading: "Begin with a conversation",
    text: "Tell us about the house, the rooms, and the life you want them to hold. We reply to every serious enquiry personally — usually within two working days.",
    notes: [
      "Full-home and renovation commissions worldwide",
      "Consultations in person (Charleston, Copenhagen) or by video",
      "Currently booking for next spring",
    ],
  },
};

export default config;
