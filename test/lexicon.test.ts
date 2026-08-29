import { describe, expect, test } from "vitest";
import {
  ACADEMIC, DECORATIONS, EPITHETS, FORMULAS, GRADES, MOTTOES, MUNDANE,
  OFFICES, ORDERS, PROTECTIVE, STEMS, STEM_SYLLABLES, TERRITORY_PREFIXES,
  TERRITORY_SUFFIXES,
} from "../src/lexicon/tiers.js";
import { ALL_RANKS, TRADITION_KEYS, TRADITION_DEFS } from "../src/lexicon/index.js";
import { CHARGES, ORDINARIES } from "../src/blazon.js";
import type { Gender } from "../src/types.js";

/* ------------------------------------------------------------------ */
/* Every string the lexicon can emit, grouped by tier.                 */
/* ------------------------------------------------------------------ */

function tierStrings(tier: "t0" | "t1" | "t2"): string[] {
  const out: string[] = [
    ...EPITHETS[tier],
    ...OFFICES[tier].flatMap((o) => [o.name, o.to ?? ""]),
    ...ORDERS[tier].map((o) => o.name),
    ...ORDERS[tier].flatMap((o) => o.augment ?? []),
    ...DECORATIONS[tier].map((d) => d.name),
    ...ACADEMIC[tier].map((a) => a.name),
    ...FORMULAS[tier].flatMap((f) => [f.en, f.la ?? ""]),
    ...PROTECTIVE[tier],
    ...MOTTOES[tier].map((m) => m.text),
    ...CHARGES[tier].flatMap((c) => [c.noun, c.attitude ?? ""]),
  ];
  if (tier === "t0") {
    out.push(...Object.values(STEMS).flat());
    out.push(...STEM_SYLLABLES, ...TERRITORY_SUFFIXES, ...TERRITORY_PREFIXES);
    for (const key of TRADITION_KEYS) {
      const def = TRADITION_DEFS[key];
      out.push(...(def.protective0 ?? []));
      out.push(...(def.formulas0 ?? []).flatMap((f) => [f.en, f.la ?? ""]));
    }
  }
  return out.filter((s) => s !== "");
}

function allStrings(): string[] {
  return [
    ...tierStrings("t0"), ...tierStrings("t1"), ...tierStrings("t2"),
    ...MUNDANE,
    ...ALL_RANKS.flatMap((r) => [r.forms.m, r.forms.f, r.forms.n]),
    ...TRADITION_KEYS.flatMap((k) => [
      ...TRADITION_DEFS[k].names.m, ...TRADITION_DEFS[k].names.f,
    ]),
    ...ORDINARIES,
  ];
}

/* ------------------------------------------------------------------ */
/* Scale                                                               */
/* ------------------------------------------------------------------ */

describe("lexicon scale", () => {
  const counts = {
    epithets: EPITHETS.t0.length + EPITHETS.t1.length + EPITHETS.t2.length,
    offices: OFFICES.t0.length + OFFICES.t1.length + OFFICES.t2.length,
    orders: ORDERS.t0.length + ORDERS.t1.length + ORDERS.t2.length,
    decorations: DECORATIONS.t0.length + DECORATIONS.t1.length + DECORATIONS.t2.length,
    academic: ACADEMIC.t0.length + ACADEMIC.t1.length + ACADEMIC.t2.length,
    formulas: FORMULAS.t0.length + FORMULAS.t1.length + FORMULAS.t2.length,
    protective: PROTECTIVE.t0.length + PROTECTIVE.t1.length + PROTECTIVE.t2.length,
    mottoes: MOTTOES.t0.length + MOTTOES.t1.length + MOTTOES.t2.length,
    mundane: MUNDANE.length,
    stems: Object.values(STEMS).flat().length,
    morphology: STEM_SYLLABLES.length + TERRITORY_SUFFIXES.length + TERRITORY_PREFIXES.length,
    names: TRADITION_KEYS.reduce(
      (n, k) => n + TRADITION_DEFS[k].names.m.length + TRADITION_DEFS[k].names.f.length, 0,
    ),
    ranks: ALL_RANKS.length,
    charges: CHARGES.t0.length + CHARGES.t1.length + CHARGES.t2.length,
    ordinaries: ORDINARIES.length,
  };

  test("each slot holds its floor", () => {
    expect(counts.epithets).toBeGreaterThanOrEqual(280);
    expect(counts.offices).toBeGreaterThanOrEqual(200);
    expect(counts.orders).toBeGreaterThanOrEqual(95);
    expect(counts.decorations).toBeGreaterThanOrEqual(30);
    expect(counts.academic).toBeGreaterThanOrEqual(20);
    expect(counts.formulas).toBeGreaterThanOrEqual(30);
    expect(counts.protective).toBeGreaterThanOrEqual(70);
    expect(counts.mottoes).toBeGreaterThanOrEqual(80);
    expect(counts.mundane).toBeGreaterThanOrEqual(120);
    expect(counts.stems).toBeGreaterThanOrEqual(170);
    expect(counts.names).toBeGreaterThanOrEqual(330);
    expect(counts.ranks).toBeGreaterThanOrEqual(90);
    expect(counts.charges).toBeGreaterThanOrEqual(70);
  });

  test("the lexicon as a whole clears 1600 entries", () => {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThanOrEqual(1600);
  });
});

/* ------------------------------------------------------------------ */
/* Uniqueness                                                          */
/* ------------------------------------------------------------------ */

describe("lexicon uniqueness", () => {
  test("no list repeats an entry", () => {
    const lists: [string, readonly string[]][] = [
      ["epithets", [...EPITHETS.t0, ...EPITHETS.t1, ...EPITHETS.t2]],
      ["offices", [...OFFICES.t0, ...OFFICES.t1, ...OFFICES.t2].map((o) => `${o.name}|${o.to ?? ""}`)],
      ["orders", [...ORDERS.t0, ...ORDERS.t1, ...ORDERS.t2].map((o) => o.name)],
      ["decorations", [...DECORATIONS.t0, ...DECORATIONS.t1, ...DECORATIONS.t2].map((d) => d.name)],
      ["academic", [...ACADEMIC.t0, ...ACADEMIC.t1, ...ACADEMIC.t2].map((a) => a.name)],
      ["formulas", [...FORMULAS.t0, ...FORMULAS.t1, ...FORMULAS.t2].map((f) => f.en)],
      ["protective", [...PROTECTIVE.t0, ...PROTECTIVE.t1, ...PROTECTIVE.t2]],
      ["mottoes", [...MOTTOES.t0, ...MOTTOES.t1, ...MOTTOES.t2].map((m) => m.text)],
      ["mundane", MUNDANE],
      ["stems", Object.values(STEMS).flat()],
      ["charges", [...CHARGES.t0, ...CHARGES.t1, ...CHARGES.t2].map((c) => `${c.noun}|${c.attitude ?? ""}`)],
    ];
    for (const [label, list] of lists) {
      const seen = new Set(list);
      expect(seen.size, `${label} has duplicates`).toBe(list.length);
    }
  });

  test("every realizable post-nominal is unique", () => {
    const pns: string[] = [];
    for (const row of [...ORDERS.t0, ...ORDERS.t1, ...ORDERS.t2]) {
      if (row.single) {
        pns.push(...new Set([row.single.m, row.single.f, row.single.n]));
      } else {
        for (const grade of GRADES) pns.push(`${grade.letter}${row.initials}`);
      }
    }
    for (const d of [...DECORATIONS.t0, ...DECORATIONS.t1, ...DECORATIONS.t2]) pns.push(d.postNominal);
    for (const a of [...ACADEMIC.t0, ...ACADEMIC.t1, ...ACADEMIC.t2]) pns.push(a.postNominal);
    pns.push("DL", "JP");
    const seen = new Map<string, number>();
    for (const pn of pns) seen.set(pn, (seen.get(pn) ?? 0) + 1);
    const dups = [...seen.entries()].filter(([, n]) => n > 1).map(([pn]) => pn);
    expect(dups, `duplicate post-nominals: ${dups.join(", ")}`).toEqual([]);
  });

  test("ranks keep distinct precedence within each tradition", () => {
    for (const key of TRADITION_KEYS) {
      const ladder = TRADITION_DEFS[key].ladder;
      const precedences = ladder.map((r) => r.precedence);
      expect(new Set(precedences).size, key).toBe(precedences.length);
    }
  });
});

/* ------------------------------------------------------------------ */
/* Purity                                                              */
/* ------------------------------------------------------------------ */

describe("lexicon purity", () => {
  test("no mundane word leaks into tier 0 or tier 1", () => {
    const patterns = MUNDANE.map(
      (word) => new RegExp(`\\b${word.replace(/[-\s]/g, "[-\\s]")}\\b`, "i"),
    );
    for (const tier of ["t0", "t1"] as const) {
      for (const s of tierStrings(tier)) {
        for (let i = 0; i < patterns.length; i++) {
          expect(
            patterns[i].test(s),
            `${tier} entry "${s}" contains mundane "${MUNDANE[i]}"`,
          ).toBe(false);
        }
      }
    }
  });

  test("no gendered rank word appears in a shared slot", () => {
    const cols: Record<Gender, Set<string>> = { m: new Set(), f: new Set(), n: new Set() };
    const tokensOf = (s: string) => s.split(/[^\p{L}']+/u).filter(Boolean);
    for (const rank of ALL_RANKS) {
      for (const g of ["m", "f", "n"] as const) {
        for (const t of tokensOf(rank.forms[g])) cols[g].add(t);
      }
    }
    for (const t of tokensOf("His Sir Don Father")) cols.m.add(t);
    for (const t of tokensOf("Her Madam Doña Mother Dame Lady")) cols.f.add(t);
    cols.n.add("Their");
    const exclusive = new Set<string>();
    for (const g of ["m", "f", "n"] as const) {
      const others = (["m", "f", "n"] as const).filter((x) => x !== g);
      for (const word of cols[g]) {
        if (others.every((o) => !cols[o].has(word))) exclusive.add(word);
      }
    }
    const shared = [
      ...tierStrings("t0"), ...tierStrings("t1"), ...tierStrings("t2"),
      ...MUNDANE, ...ORDINARIES,
    ];
    for (const s of shared) {
      for (const token of tokensOf(s)) {
        expect(exclusive.has(token), `shared entry "${s}" carries gendered "${token}"`).toBe(false);
      }
    }
  });

  test("no dashes and no reigning houses anywhere in the lexicon", () => {
    const houses = [
      "Windsor", "Mountbatten", "Bourbon", "Bernadotte", "Glücksburg",
      "Orange-Nassau", "Grimaldi", "Liechtenstein", "Nassau-Weilburg",
    ];
    for (const s of allStrings()) {
      expect(/[–—]/.test(s), `dash in "${s}"`).toBe(false);
      for (const house of houses) {
        expect(s.includes(house), `"${s}" names ${house}`).toBe(false);
      }
    }
  });
});
