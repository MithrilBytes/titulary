/**
 * The tradition registry: one ladder, name pool, and set of house rules
 * per tradition, on a shared precedence scale so `mixed` can sort.
 */
import type { Rank, SegmentKey, Tradition } from "../types.js";
import type { FormulaRow, StemFlavor } from "./tiers.js";
import { british } from "./british.js";
import { hre } from "./hre.js";
import { byzantine } from "./byzantine.js";
import { iberian } from "./iberian.js";
import { italian } from "./italian.js";
import { ottoman } from "./ottoman.js";
import { papal } from "./papal.js";

export interface TraditionDef {
  key: Exclude<Tradition, "mixed">;
  ladder: readonly Rank[];
  names: { m: readonly string[]; f: readonly string[] };
  stemFlavor: StemFlavor;
  /** How house names are joined: Wittgenau-Ashworth, X y Z, dei X. */
  house: "hyphen" | "of" | "y" | "dei";
  /** Extra tier 0 protective formulas particular to the tradition. */
  protective0?: readonly string[];
  /** Extra tier 0 grace-of-God formulas particular to the tradition. */
  formulas0?: readonly FormulaRow[];
  /** Segment order override for assembly. */
  order?: readonly SegmentKey[];
}

export const DEFAULT_ORDER: readonly SegmentKey[] = [
  "formulas", "titles", "offices", "protective", "honours",
];

export const TRADITION_DEFS: Record<Exclude<Tradition, "mixed">, TraditionDef> = {
  british, hre, byzantine, iberian, italian, ottoman, papal,
};

export const TRADITION_KEYS = Object.keys(TRADITION_DEFS) as Exclude<Tradition, "mixed">[];

/** Every rank of every tradition, for `mixed` subsidiaries. */
export const ALL_RANKS: readonly Rank[] = TRADITION_KEYS.flatMap(
  (k) => TRADITION_DEFS[k].ladder,
);

export function defFor(tradition: Exclude<Tradition, "mixed">): TraditionDef {
  return TRADITION_DEFS[tradition];
}

export function segmentOrder(tradition: Tradition): readonly SegmentKey[] {
  if (tradition === "mixed") return DEFAULT_ORDER;
  return TRADITION_DEFS[tradition].order ?? DEFAULT_ORDER;
}
