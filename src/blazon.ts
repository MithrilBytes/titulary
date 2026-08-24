/**
 * Blazons in correct blazon grammar: field, ordinary, charges, tinctures.
 * The rule of tincture (no colour on colour, no metal on metal) and the
 * term "armes à enquérir" for a deliberate breach follow standard
 * heraldic usage; see Fox-Davies, A Complete Guide to Heraldry (1909).
 * "Proper" (natural colours) is exempt from the rule, which is why the
 * biscuits get away with it.
 */
import type { Rng } from "./rng.js";
import { pickTier } from "./dials.js";
import { pluralize } from "./territory.js";

export type TinctureClass = "metal" | "colour" | "proper";

export const METALS = ["Or", "Argent"] as const;
export const COLOURS = ["Gules", "Azure", "Vert", "Sable", "Purpure"] as const;
export const TINCTURES = [...METALS, ...COLOURS] as const;

const ORDINARIES = ["fess", "chevron", "bend", "pale", "cross", "saltire", "chief"] as const;

interface ChargeRow {
  noun: string;
  attitude?: string;
  /** Tier 2 kitchenware is usually blazoned proper. */
  properChance?: number;
}

const CHARGES: { t0: readonly ChargeRow[]; t1: readonly ChargeRow[]; t2: readonly ChargeRow[] } = {
  t0: [
    { noun: "lion", attitude: "rampant" },
    { noun: "eagle", attitude: "displayed" },
    { noun: "mullet" },
    { noun: "cross", attitude: "moline" },
    { noun: "griffin", attitude: "segreant" },
    { noun: "martlet" },
    { noun: "escallop" },
    { noun: "boar's head", attitude: "erased" },
  ],
  t1: [
    { noun: "heron", attitude: "close" },
    { noun: "owl", attitude: "guardant" },
    { noun: "oak sprig", attitude: "fructed" },
    { noun: "tower", attitude: "embattled" },
    { noun: "hedgehog", attitude: "statant" },
  ],
  t2: [
    { noun: "spoon", attitude: "in bend", properChance: 0.3 },
    { noun: "teapot", attitude: "passant", properChance: 0.5 },
    { noun: "biscuit", properChance: 0.8 },
    { noun: "tea cosy", properChance: 0.6 },
    { noun: "draught excluder", attitude: "fesswise", properChance: 0.5 },
    { noun: "thermostat", properChance: 0.4 },
  ],
};

export interface Placement {
  tincture: string;
  cls: TinctureClass;
  /** What it lies upon, for the rule of tincture. */
  on: TinctureClass;
}

export interface BlazonParts {
  text: string;
  field: { tincture: string; cls: TinctureClass };
  placements: Placement[];
  violation: boolean;
}

function tinctureOf(cls: "metal" | "colour", rng: Rng): string {
  return cls === "metal" ? rng.pick(METALS) : rng.pick(COLOURS);
}

function classOf(t: string): TinctureClass {
  return (METALS as readonly string[]).includes(t) ? "metal" : "colour";
}

function contrasting(on: TinctureClass, rng: Rng, violate: boolean): string {
  const cls: "metal" | "colour" =
    on === "metal" ? (violate ? "metal" : "colour") : violate ? "colour" : "metal";
  return tinctureOf(cls, rng);
}

function article(phrase: string): string {
  return /^[aeiou]/i.test(phrase) ? "an" : "a";
}

function chargePhrase(row: ChargeRow, count: number): string {
  const noun = count === 1 ? row.noun : pluralize(row.noun);
  const counted = count === 1 ? `${article(noun)} ${noun}` : `${count === 2 ? "two" : count === 3 ? "three" : "five"} ${noun}`;
  return row.attitude ? `${counted} ${row.attitude}` : counted;
}

/** One blazon with its structure exposed, for the tincture test. */
export function generateBlazonParts(rng: Rng, r: number): BlazonParts {
  const fieldTincture = rng.chance(0.4) ? rng.pick(METALS) : rng.pick(COLOURS);
  const field = { tincture: fieldTincture, cls: classOf(fieldTincture) };
  // Above 0.8 the dial deliberately breaks the rule and says so.
  const violation = r >= 0.8 && rng.chance((r - 0.8) * 3);
  const placements: Placement[] = [];
  const clauses: string[] = [];

  const place = (on: TinctureClass, violate: boolean): string => {
    const t = contrasting(on === "proper" ? "colour" : on, rng, violate);
    placements.push({ tincture: t, cls: classOf(t), on });
    return t;
  };

  const tier = pickTier(rng, r);
  const chargeList = tier === 0 ? CHARGES.t0 : tier === 1 ? CHARGES.t1 : CHARGES.t2;

  const useOrdinary = rng.chance(0.55);
  if (useOrdinary) {
    const ordinary = rng.pick(ORDINARIES);
    const t = place(field.cls, violation);
    clauses.push(`${article(ordinary)} ${ordinary} ${t}`);
    if (rng.chance(0.45)) {
      const row = rng.pick(chargeList);
      const proper = rng.chance(row.properChance ?? 0);
      const count = rng.pick([2, 3, 3, 3, 5] as const);
      if (proper) {
        placements.push({ tincture: "proper", cls: "proper", on: field.cls });
        clauses[0] += ` between ${chargePhrase(row, count)} proper`;
      } else {
        const t2 = place(field.cls, false);
        clauses[0] += ` between ${chargePhrase(row, count)} ${t2}`;
      }
    }
  } else {
    const row = rng.pick(chargeList);
    const proper = rng.chance(row.properChance ?? 0);
    if (proper) {
      placements.push({ tincture: "proper", cls: "proper", on: field.cls });
      clauses.push(`${chargePhrase(row, 1)} proper`);
    } else {
      const t = place(field.cls, violation);
      clauses.push(`${chargePhrase(row, 1)} ${t}`);
    }
  }

  if (rng.chance(0.3)) {
    const ordinary = rng.pick(ORDINARIES);
    const t = place(field.cls, false);
    const row = rng.pick(chargeList);
    const proper = rng.chance(row.properChance ?? 0);
    const count = rng.pick([2, 3, 3] as const);
    if (proper) {
      placements.push({ tincture: "proper", cls: "proper", on: classOf(t) });
      clauses.push(`on ${article(ordinary)} ${ordinary} ${t} ${chargePhrase(row, count)} proper`);
    } else {
      const t2 = place(classOf(t), false);
      clauses.push(`on ${article(ordinary)} ${ordinary} ${t} ${chargePhrase(row, count)} ${t2}`);
    }
  }

  let text = `${field.tincture}, ${clauses.join(", ")}`;
  if (violation) text += " (armes à enquérir)";
  return { text, field, placements, violation };
}

export function generateBlazon(rng: Rng, r: number): string {
  return generateBlazonParts(rng, r).text;
}

export { classOf as tinctureClassOf };
