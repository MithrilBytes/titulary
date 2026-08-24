import { describe, expect, test } from "vitest";
import { titulary } from "../src/index.js";
import { MUNDANE } from "../src/lexicon/tiers.js";

const PATTERNS = MUNDANE.map(
  (word) => new RegExp(`\\b${word.replace(/[-\s]/g, "[-\\s]")}\\b`, "gi"),
);

function mundaneRatio(r: number, seeds: number): number {
  let hits = 0;
  let words = 0;
  for (let seed = 0; seed < seeds; seed++) {
    const text = titulary({ seed, ridiculous: r, length: 0.7 });
    words += text.split(/\s+/).length;
    for (const pattern of PATTERNS) {
      hits += (text.match(pattern) ?? []).length;
    }
  }
  return hits / words;
}

describe("monotone absurdity", () => {
  test("the mundane-noun ratio is non-decreasing in the ridiculous dial", () => {
    const grid = [0, 0.25, 0.5, 0.75, 1];
    const ratios = grid.map((r) => mundaneRatio(r, 200));
    for (let i = 1; i < ratios.length; i++) {
      expect(ratios[i], `r=${grid[i]} ratio ${ratios[i]} vs r=${grid[i - 1]} ${ratios[i - 1]}`)
        .toBeGreaterThanOrEqual(ratios[i - 1]);
    }
    expect(ratios[0]).toBe(0);
    expect(ratios[4]).toBeGreaterThan(0.02);
  });
});
