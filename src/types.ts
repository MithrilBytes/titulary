/**
 * The Titulary intermediate representation. One plain data structure,
 * produced by the generator and walked by every renderer.
 */
import type { Seed } from "./rng.js";

export type Tradition =
  | "british" | "hre" | "byzantine" | "iberian"
  | "italian" | "ottoman" | "papal" | "mixed";

export const TRADITIONS: readonly Tradition[] = [
  "british", "hre", "byzantine", "iberian", "italian", "ottoman", "papal", "mixed",
];

export type Gender = "m" | "f" | "n";

export type Format = "text" | "markdown" | "html" | "json";

export const FORMATS: readonly Format[] = ["text", "markdown", "html", "json"];

export type Kind =
  | "title" | "name" | "epithet" | "honours" | "address"
  | "proclamation" | "blazon" | "motto" | "court";

export const KINDS: readonly Kind[] = [
  "title", "name", "epithet", "honours", "address",
  "proclamation", "blazon", "motto", "court",
];

/**
 * Middle segments of an assembled style, in tradition order. The style
 * line always opens and the motto and "&c." always close.
 */
export type SegmentKey = "formulas" | "titles" | "offices" | "protective" | "honours";

/** The four dials, each 0 to 1, defaulting to 0.5. */
export interface Dials {
  ridiculous: number;
  length: number;
  antiquity: number;
  pretension: number;
}

export type StyleKey =
  | "imperial-majesty" | "majesty" | "royal-highness" | "imperial-highness"
  | "serene-highness" | "illustrious-highness" | "highness" | "serenity"
  | "grace" | "excellency" | "most-illustrious" | "most-hon" | "rt-hon"
  | "right-reverend" | "very-reverend" | "much-honoured" | "none";

export type TitleStatus =
  | "held" | "titular" | "claimed" | "in-pretence" | "disputed"
  | "de-jure" | "in-exile" | "dormant" | "vacant";

export interface Rank {
  key: string;
  forms: { m: string; f: string; n: string };
  /** Shared scale across traditions so `mixed` sorts. */
  precedence: number;
  /** May carry a regnal ordinal. */
  sovereign: boolean;
  style: StyleKey;
  /** A second style some holders use, as princes may be Serene. */
  styleAlt?: StyleKey;
  /**
   * Court ranks such as Sebastokrator name no fief; they render bare,
   * with no particle and no territory.
   */
  territorial?: false;
  /**
   * Sovereign but unnumbered, as Doges were: heads of state who never
   * took a regnal ordinal.
   */
  numbered?: false;
  particles: readonly string[];
  traditions: readonly Exclude<Tradition, "mixed">[];
}

export interface Title {
  rank: Rank;
  particle: string;
  territory: string;
  status: TitleStatus;
}

export interface Office {
  name: string;
  hereditary: boolean;
  /** Whom the office serves: "the Electoral Court". */
  to?: string;
}

export interface Honour {
  order: string;
  grade: string;
  postNominal: string;
  precedence: number;
  tier: 0 | 1 | 2;
}

export interface Motto {
  text: string;
  language: "la" | "fr" | "en" | "mixed";
}

export interface Address {
  envelope: string;
  salutation: string;
  verbal: string;
}

export interface Person {
  given: string[];
  regnal?: string;
  epithet?: string;
  house?: string;
}

export interface Titulary {
  seed: Seed;
  tradition: Tradition;
  gender: Gender;
  dials: Dials;
  person: Person;
  /** Style words in order: ["Their", "Most Serene", "Highness"]. */
  style: string[];
  /** "by the Grace of God" and friends. */
  formulas: string[];
  primary: Title;
  /** Descending precedence. */
  subsidiary: Title[];
  offices: Office[];
  /** "Defender of the ..." */
  protective: string[];
  /** Sorted by precedence. */
  honours: Honour[];
  motto?: Motto;
  /** Close the list with "&c., &c., &c." */
  etc: boolean;
  blazon?: string;
  address?: Address;
}

export interface TitularyOptions {
  seed?: Seed;
  tradition?: Tradition;
  gender?: Gender | "random";
  ridiculous?: number;
  length?: number;
  antiquity?: number;
  pretension?: number;
}
