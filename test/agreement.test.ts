import { describe, expect, test } from "vitest";
import { titulary, type Gender, type Tradition } from "../src/index.js";
import { ALL_RANKS } from "../src/lexicon/index.js";

/**
 * Gendered word triples: every rank's (m, f, n) forms plus the style
 * vocabulary. A word that appears in exactly one column may never show
 * up in output generated for another gender.
 */
type Triple = { m: string; f: string; n: string };

const TRIPLES: Triple[] = [
  ...ALL_RANKS.map((rank) => rank.forms),
  { m: "His", f: "Her", n: "Their" },
  { m: "Sir", f: "Madam", n: "" },
  { m: "Don", f: "Doña", n: "" },
  { m: "Father", f: "Mother", n: "" },
  { m: "Knight Grand Cross", f: "Dame Grand Cross", n: "Grand Cross" },
  { m: "Knight Commander", f: "Dame Commander", n: "Commander" },
  { m: "KG", f: "LG", n: "KG" },
  { m: "KA", f: "LA", n: "KA" },
  { m: "KStH", f: "DStH", n: "KStH" },
  { m: "KDr", f: "DDr", n: "KDr" },
  { m: "Porphyrogennetos", f: "Porphyrogennete", n: "Porphyrogennetos" },
];

function tokens(phrase: string): string[] {
  return phrase.split(/[^\p{L}']+/u).filter((t) => t.length > 0);
}

function exclusiveWords(): Record<Gender, Set<string>> {
  const seen: Record<Gender, Set<string>> = { m: new Set(), f: new Set(), n: new Set() };
  for (const triple of TRIPLES) {
    for (const g of ["m", "f", "n"] as const) {
      for (const word of tokens(triple[g])) seen[g].add(word);
    }
  }
  const exclusive: Record<Gender, Set<string>> = { m: new Set(), f: new Set(), n: new Set() };
  for (const g of ["m", "f", "n"] as const) {
    const others = (["m", "f", "n"] as const).filter((x) => x !== g);
    for (const word of seen[g]) {
      if (others.every((o) => !seen[o].has(word))) exclusive[g].add(word);
    }
  }
  return exclusive;
}

const EXCLUSIVE = exclusiveWords();

const TRADITIONS: Tradition[] = [
  "british", "hre", "byzantine", "iberian", "italian", "ottoman", "papal", "mixed",
];
const KINDS = ["title", "address", "proclamation", "honours"] as const;

describe("gender agreement", () => {
  test.each(["m", "f", "n"] as const)("no output for gender %s borrows another column", (g) => {
    const forbidden = (["m", "f", "n"] as const)
      .filter((x) => x !== g)
      .flatMap((x) => [...EXCLUSIVE[x]].map((word) => ({ word, from: x })));
    for (const tradition of TRADITIONS) {
      for (let seed = 0; seed < 8; seed++) {
        for (const kind of KINDS) {
          const text = titulary({
            seed: `${tradition}-${seed}`, tradition, gender: g, kind,
            length: 0.8, antiquity: 0.6, ridiculous: 0.5,
          });
          const words = new Set(tokens(text));
          for (const { word, from } of forbidden) {
            expect(
              words.has(word),
              `${tradition} seed ${seed} kind ${kind} (${g}) leaked "${word}" from column ${from}\n${text}`,
            ).toBe(false);
          }
        }
      }
    }
  });
});
