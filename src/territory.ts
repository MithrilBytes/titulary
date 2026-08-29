/**
 * Territorial designations: invented plausible places at tier 0,
 * over-egged compounds at tier 1, mundane objects with formal prefixes
 * at tier 2. Also house names and the short form used in address.
 */
import type { Rng } from "./rng.js";
import { lerp } from "./rng.js";
import { pickTier } from "./dials.js";
import type { TraditionDef } from "./lexicon/index.js";
import {
  MUNDANE, STEMS, STEM_SYLLABLES, TERRITORY_PREFIXES, TERRITORY_SUFFIXES,
  type StemFlavor,
} from "./lexicon/tiers.js";

/** Dynastic prefixes for over-egged compounds. */
const DYNASTIC = ["Saxe", "Hesse", "Schleswig"] as const;

// Hundreds, sokes, wapentakes, liberties, and ridings are all real
// English administrative fossils, which is why they carry cupboards so
// well.
const WRAPPERS = [
  "Palatinate", "Marches", "March", "Vale", "Meadows", "Walls",
  "Hundred", "Hundreds", "Soke", "Wapentake", "Liberty", "Chase",
  "Warren", "Riding",
];

function stem(rng: Rng, flavor: StemFlavor): string {
  // English honors keep a few Norman names, as the real peerage does.
  const pool = flavor === "english" && rng.chance(0.15) ? STEMS.french : STEMS[flavor];
  if ((flavor === "english" || flavor === "german") && rng.chance(0.4)) {
    return rng.pick(STEM_SYLLABLES) + rng.pick(TERRITORY_SUFFIXES);
  }
  return rng.pick(pool);
}

export function pluralize(word: string): string {
  const parts = word.split(" ");
  const last = parts[parts.length - 1];
  let plural: string;
  if (/s$/.test(last)) plural = last;
  else if (/[^aeiou]y$/.test(last)) plural = last.slice(0, -1) + "ies";
  else if (/(s|x|z|ch|sh)$/.test(last)) plural = last + "es";
  else plural = last + "s";
  parts[parts.length - 1] = plural;
  return parts.join(" ");
}

/** A territorial designation. Length feeds the hyphenation appetite. */
export function generateTerritory(rng: Rng, r: number, length: number, flavor: StemFlavor): string {
  const tier = pickTier(rng, r);
  if (tier === 0) {
    const s = stem(rng, flavor);
    return rng.chance(0.2) ? `${rng.pick(TERRITORY_PREFIXES)} ${s}` : s;
  }
  if (tier === 1) {
    const s1 = stem(rng, flavor);
    let s2 = stem(rng, flavor);
    for (let i = 0; i < 4 && s2 === s1; i++) s2 = stem(rng, flavor);
    const hyphens = 1 + Math.round(lerp(0, 2, length));
    const patterns: readonly (() => string)[] = [
      () => `${rng.pick(DYNASTIC)}-${s1}-${s2}`,
      () => hyphens >= 2
        ? `${s1}-${s2}-and-Lower-${s1}`
        : `${s1}-${s2}`,
      () => `the Two ${pluralize(s1)}`,
      () => `the Upper and Nether Marches`,
      () => `${rng.pick(TERRITORY_PREFIXES)} ${s1} and the ${rng.pick(WRAPPERS)} of ${s2}`,
      () => `${s1}-cum-${s2}`,
      () => `${s1}-juxta-${s2}`,
      () => `the Honour of ${s1}`,
    ];
    return rng.pick(patterns)();
  }
  const m = rng.pick(MUNDANE);
  const patterns: readonly (() => string)[] = [
    () => `the Lesser ${m}`,
    () => `the Greater ${m}`,
    () => `Upper ${m}`,
    () => `the Lower ${m}`,
    () => `Nether ${m}`,
    () => `the ${m} Palatinate`,
    () => `the Two ${pluralize(m)}`,
    () => `the Damp Marches`,
    () => `the Airing-Cupboard Palatinate`,
    () => `the Outer ${m}`,
    () => `${m} Regis`,
    () => `${m} Parva`,
    () => `${m} Magna`,
    () => `the Soke of the ${m}`,
    () => `the Wapentake of the ${m}`,
    () => `the Liberty of the ${m}`,
    () => `the ${m} Hundreds`,
    () => `the Rural District of the ${m}`,
  ];
  return rng.pick(patterns)();
}

/** Draw a territory not already in use. */
export function uniqueTerritory(
  rng: Rng, r: number, length: number, flavor: StemFlavor, used: Set<string>,
): string {
  let t = generateTerritory(rng, r, length, flavor);
  for (let i = 0; i < 12 && used.has(t); i++) {
    t = generateTerritory(rng, r, length, flavor);
  }
  used.add(t);
  return t;
}

/** An invented house name in the tradition's shape. */
export function houseName(rng: Rng, def: TraditionDef, length: number): string {
  const one = stem(rng, def.stemFlavor);
  const two = stem(rng, def.stemFlavor);
  const double = length >= 0.4 && one !== two;
  switch (def.house) {
    case "hyphen": return double ? `${one}-${two}` : one;
    case "y": return double ? `${one} y ${two}` : one;
    case "dei":
    case "of": return one;
  }
}

const SHORT_STOPWORDS = new Set<string>([
  ...TERRITORY_PREFIXES, ...DYNASTIC, ...WRAPPERS,
  "the", "and", "of", "de", "los", "la", "le", "les", "d'Ombra", "Two", "Damp",
  "sur", "under", "the-Walls", "aux", "del", "der", "di", "el",
  "Regis", "Parva", "Magna", "cum", "juxta", "Honour", "Rural", "District",
]);

function singularize(word: string): string {
  if (/ies$/.test(word)) return word.slice(0, -3) + "y";
  if (/(ses|xes|zes|ches|shes)$/.test(word)) return word.slice(0, -2);
  if (/s$/.test(word) && !/ss$/.test(word)) return word.slice(0, -1);
  return word;
}

/**
 * The bare name a peer is spoken by: "the Lesser Cupboard" makes
 * "Lord Cupboard", "the Two Wexcombes" makes "Lord Wexcombe".
 */
export function shortTerritory(full: string): string {
  const tokens = full
    .split(/[\s]+/)
    .flatMap((t) => (t.includes("-") && !t.startsWith("d'") ? t.split("-") : [t]))
    .filter((t) => t.length > 0 && !SHORT_STOPWORDS.has(t));
  if (tokens.length === 0) return full.replace(/^the\s+/i, "");
  return singularize(tokens[tokens.length - 1]);
}
