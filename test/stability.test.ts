import { describe, expect, test } from "vitest";
import { generateTitulary, type Tradition } from "../src/index.js";

const SWEEP = Array.from({ length: 11 }, (_, i) => i / 10);

describe("stability under the ridiculous dial", () => {
  test("sweeping ridiculous never changes name, gender, house, or primary rank", () => {
    const traditions: Tradition[] = ["british", "hre", "byzantine", "ottoman", "mixed"];
    for (const tradition of traditions) {
      for (let seed = 0; seed < 20; seed++) {
        const reference = generateTitulary({ seed, tradition, ridiculous: 0 });
        for (const r of SWEEP) {
          const t = generateTitulary({ seed, tradition, ridiculous: r });
          const label = `${tradition} seed ${seed} r ${r}`;
          expect(t.person.given, label).toEqual(reference.person.given);
          expect(t.gender, label).toBe(reference.gender);
          expect(t.person.house, label).toBe(reference.person.house);
          expect(t.primary.rank.key, label).toBe(reference.primary.rank.key);
        }
      }
    }
  });

  test("sweeping ridiculous keeps the subsidiary rank sequence", () => {
    for (let seed = 0; seed < 10; seed++) {
      const reference = generateTitulary({ seed, length: 0.8, ridiculous: 0 });
      for (const r of SWEEP) {
        const t = generateTitulary({ seed, length: 0.8, ridiculous: r });
        expect(t.subsidiary.map((s) => s.rank.key), `seed ${seed} r ${r}`).toEqual(
          reference.subsidiary.map((s) => s.rank.key),
        );
      }
    }
  });
});
