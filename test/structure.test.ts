import { describe, expect, test } from "vitest";
import { generateTitulary, type Titulary, type Tradition } from "../src/index.js";
import { fromRoman } from "../src/roman.js";

const TRADITIONS: Tradition[] = [
  "british", "hre", "byzantine", "iberian", "italian", "ottoman", "papal", "mixed",
];

function samples(): Titulary[] {
  const out: Titulary[] = [];
  for (const tradition of TRADITIONS) {
    for (let seed = 0; seed < 12; seed++) {
      for (const dial of [0, 0.5, 1]) {
        out.push(generateTitulary({
          seed: `${tradition}-${seed}-${dial}`,
          tradition,
          ridiculous: dial,
          length: dial,
          pretension: dial,
        }));
      }
    }
  }
  return out;
}

const all = samples();

describe("structure", () => {
  test("subsidiaries descend strictly in precedence", () => {
    for (const t of all) {
      const precedences = t.subsidiary.map((s) => s.rank.precedence);
      for (let i = 1; i < precedences.length; i++) {
        expect(precedences[i], String(t.seed)).toBeLessThan(precedences[i - 1]);
      }
    }
  });

  test("held subsidiaries stay below the primary; anything above is a claim", () => {
    for (const t of all) {
      for (const s of t.subsidiary) {
        if (s.rank.precedence >= t.primary.rank.precedence) {
          expect(s.status, `${t.seed}: ${s.rank.key}`).not.toBe("held");
        }
      }
    }
  });

  test("no two titles share a territory", () => {
    for (const t of all) {
      const territories = [t.primary, ...t.subsidiary]
        .map((title) => title.territory)
        .filter((x) => x !== "");
      expect(new Set(territories).size, String(t.seed)).toBe(territories.length);
    }
  });

  test("honours are sorted by precedence with no duplicate orders", () => {
    for (const t of all) {
      const precedences = t.honours.map((h) => h.precedence);
      for (let i = 1; i < precedences.length; i++) {
        expect(precedences[i]).toBeLessThanOrEqual(precedences[i - 1]);
      }
      const orders = t.honours.map((h) => h.order);
      expect(new Set(orders).size, String(t.seed)).toBe(orders.length);
    }
  });

  test("regnal ordinals only on sovereign ranks, correctly formed", () => {
    for (const t of all) {
      if (t.person.regnal === undefined) continue;
      expect(t.primary.rank.sovereign, String(t.seed)).toBe(true);
      expect(t.primary.rank.numbered ?? true, String(t.seed)).toBe(true);
      const regnal = t.person.regnal;
      const plain = /^[IVXLCDM]+$/.test(regnal);
      const half = /^[IVXLCDM]+½$/.test(regnal);
      const zero = regnal === "0th";
      const spoken = /^the [A-Z][a-z-]+(?: [A-Za-z-]+)* of That Name$/.test(regnal);
      expect(plain || half || zero || spoken, `${t.seed}: ${regnal}`).toBe(true);
      if (plain) expect(fromRoman(regnal), regnal).not.toBeNull();
      if (half) expect(fromRoman(regnal.slice(0, -1)), regnal).not.toBeNull();
    }
  });

  test("non-territorial ranks carry no particle and no territory", () => {
    for (const t of all) {
      for (const title of [t.primary, ...t.subsidiary]) {
        if (title.rank.territorial === false) {
          expect(title.territory).toBe("");
          expect(title.particle).toBe("");
        } else {
          expect(title.territory.length).toBeGreaterThan(0);
        }
      }
    }
  });

  test("the et-cetera flag follows the length dial", () => {
    for (const t of all) {
      expect(t.etc).toBe(t.dials.length >= 0.6);
    }
  });

  test("pretension 1 makes a pretender of everything", () => {
    for (let seed = 0; seed < 30; seed++) {
      const t = generateTitulary({ seed, pretension: 1, length: 0.8 });
      expect(t.primary.status, String(seed)).not.toBe("held");
    }
  });

  test("pretension 0 holds everything", () => {
    for (let seed = 0; seed < 30; seed++) {
      const t = generateTitulary({ seed, pretension: 0, length: 0.8 });
      expect(t.primary.status).toBe("held");
      for (const s of t.subsidiary) {
        if (s.rank.precedence < t.primary.rank.precedence) {
          expect(s.status, String(seed)).toBe("held");
        }
      }
    }
  });
});
