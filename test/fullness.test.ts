import { describe, expect, test } from "vitest";
import { generateTitulary, renderText, titulary } from "../src/index.js";

describe("fullness", () => {
  test("length 1 produces at least twenty lines", () => {
    for (let seed = 0; seed < 25; seed++) {
      const text = titulary({ seed, length: 1 });
      const lines = text.split("\n").length;
      expect(lines, `seed ${seed}\n${text}`).toBeGreaterThanOrEqual(20);
    }
  });

  test("length 0 produces exactly one line", () => {
    for (let seed = 0; seed < 25; seed++) {
      const text = titulary({ seed, length: 0 });
      expect(text.includes("\n"), `seed ${seed}: ${text}`).toBe(false);
      expect(text.length).toBeGreaterThan(10);
    }
  });

  test("the length dial scales the trappings monotonically at the ends", () => {
    let loParts = 0;
    let hiParts = 0;
    for (let seed = 0; seed < 10; seed++) {
      const lo = generateTitulary({ seed, length: 0 });
      const hi = generateTitulary({ seed, length: 1 });
      loParts += lo.subsidiary.length + lo.offices.length + lo.honours.length;
      hiParts += hi.subsidiary.length + hi.offices.length + hi.honours.length;
    }
    expect(hiParts).toBeGreaterThan(loParts * 3);
  });

  test("the full treatment ends with the et-cetera line", () => {
    for (let seed = 0; seed < 10; seed++) {
      const text = renderText(generateTitulary({ seed, length: 1 }));
      expect(text.trimEnd().endsWith("&c., &c., &c."), `seed ${seed}`).toBe(true);
    }
  });
});
