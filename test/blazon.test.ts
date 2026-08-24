import { describe, expect, test } from "vitest";
import { Rng } from "../src/rng.js";
import { TINCTURES, generateBlazonParts } from "../src/blazon.js";

describe("blazon", () => {
  test("the rule of tincture holds below ridiculous 0.8", () => {
    for (const r of [0, 0.3, 0.5, 0.79]) {
      for (let seed = 0; seed < 300; seed++) {
        const parts = generateBlazonParts(new Rng(`b-${seed}`), r);
        expect(parts.violation).toBe(false);
        for (const p of parts.placements) {
          if (p.cls === "proper") continue;
          expect(p.cls, `${r} ${seed}: ${parts.text}`).not.toBe(p.on);
        }
      }
    }
  });

  test("high ridiculousness breaks the rule and owns up to it", () => {
    let violations = 0;
    for (let seed = 0; seed < 300; seed++) {
      const parts = generateBlazonParts(new Rng(`v-${seed}`), 1);
      if (parts.violation) {
        violations++;
        expect(parts.text.endsWith("(armes à enquérir)"), parts.text).toBe(true);
      } else {
        expect(parts.text.includes("armes à enquérir")).toBe(false);
      }
    }
    expect(violations).toBeGreaterThan(20);
  });

  test("blazons open with a tincture and stay grammatical", () => {
    for (let seed = 0; seed < 200; seed++) {
      const { text } = generateBlazonParts(new Rng(seed), seed / 200);
      const field = text.split(",")[0];
      expect(TINCTURES as readonly string[], text).toContain(field);
      expect(text).not.toContain("undefined");
      expect(text).not.toMatch(/\s{2,}/);
    }
  });

  test("blazons are deterministic", () => {
    for (const r of [0, 0.5, 1]) {
      expect(generateBlazonParts(new Rng("same"), r).text).toBe(
        generateBlazonParts(new Rng("same"), r).text,
      );
    }
  });
});
