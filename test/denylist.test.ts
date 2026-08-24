import { describe, expect, test } from "vitest";
import { titulary, type Tradition } from "../src/index.js";

/**
 * No real living people: reigning-house surnames and current monarchs'
 * regnal combinations must never appear in any output. Historical and
 * defunct titles are fair game; these are not.
 */
const HOUSES = [
  "Windsor", "Mountbatten", "Bourbon", "Bernadotte", "Glücksburg",
  "Orange-Nassau", "Grimaldi", "Liechtenstein", "Nassau-Weilburg",
];

const REGNAL = [
  "Charles III", "Felipe VI", "Frederik X", "Harald V", "Carl XVI",
  "Willem-Alexander", "Albert II", "Hans-Adam II", "Leo XIV",
];

const TRADITIONS: Tradition[] = [
  "british", "hre", "byzantine", "iberian", "italian", "ottoman", "papal", "mixed",
];

describe("denylist", () => {
  test("no output names a reigning house or a current monarch", () => {
    for (const tradition of TRADITIONS) {
      for (let seed = 0; seed < 40; seed++) {
        for (const r of [0, 1]) {
          const text = [
            titulary({ seed: `${tradition}-${seed}`, tradition, ridiculous: r, length: 0.9 }),
            titulary({ seed: `${tradition}-${seed}`, tradition, ridiculous: r, kind: "proclamation" }),
          ].join("\n");
          for (const house of HOUSES) {
            expect(text.includes(house), `${tradition} ${seed}: ${house}`).toBe(false);
          }
          for (const combo of REGNAL) {
            expect(text.includes(combo), `${tradition} ${seed}: ${combo}`).toBe(false);
          }
        }
      }
    }
  });

  test("a court of many is just as careful", () => {
    const text = titulary({ seed: "big-court", kind: "court", count: 30, tradition: "mixed" });
    for (const bad of [...HOUSES, ...REGNAL]) {
      expect(text.includes(bad), bad).toBe(false);
    }
  });
});
