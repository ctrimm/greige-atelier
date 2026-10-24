import { describe, it, expect } from "vitest";
import { slugify, isValidSlug, headlineParts } from "../../src/data/site";

describe("slugify", () => {
  it.each([
    ["Stonehouse Kitchen", "stonehouse-kitchen"],
    ["Long Table Room", "long-table-room"],
    ["Marble Bath", "marble-bath"],
    ["Hearth Room", "hearth-room"],
    ["Arch Bedroom", "arch-bedroom"],
    ["Kitchen & Bath!", "kitchen-bath"],
    ["Café Interiors", "cafe-interiors"],
    ["Maren's Studio", "marens-studio"],
    ["  Spaces   with   gaps  ", "spaces-with-gaps"],
    ["Already-a-slug", "already-a-slug"],
    ["Numbers 123 Stay", "numbers-123-stay"],
  ])("slugify(%j) → %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("collapses runs of punctuation into single dashes", () => {
    expect(slugify("one---two___three")).toBe("one-two-three");
  });
});

describe("isValidSlug", () => {
  it.each([
    ["stonehouse-kitchen", true],
    ["a", true],
    ["abc-123", true],
    ["", false],
    ["Has Caps", false],
    ["trailing-", false],
    ["-leading", false],
    ["double--dash", false],
    ["under_score", false],
    ["dot.name", false],
  ])("isValidSlug(%j) → %j", (input, expected) => {
    expect(isValidSlug(input)).toBe(expected);
  });
});

describe("headlineParts", () => {
  it("splits *asterisked* words out as italic segments", () => {
    expect(headlineParts("hold the *light*")).toEqual([
      { text: "hold the ", italic: false },
      { text: "light", italic: true },
    ]);
  });
  it("leaves a plain line untouched", () => {
    expect(headlineParts("Rooms that")).toEqual([{ text: "Rooms that", italic: false }]);
  });
  it("handles an italic word at the start", () => {
    expect(headlineParts("*Quiet* rooms")).toEqual([
      { text: "Quiet", italic: true },
      { text: " rooms", italic: false },
    ]);
  });
  it("handles two italic words in one line", () => {
    const parts = headlineParts("*stone* and *light*");
    expect(parts.filter((p) => p.italic).map((p) => p.text)).toEqual(["stone", "light"]);
  });
});
