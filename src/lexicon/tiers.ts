/**
 * The three vocabulary tiers behind every slot.
 *
 * Tier 0 is plausible: it could appear in a peerage guide. Tier 1 is
 * over-egged but defensible. Tier 2 is mundane objects handled with full
 * bureaucratic gravity. The joke never lives in the grammar, only in the
 * contents, so entries must drop into the same sentence frames as their
 * tier 0 cousins.
 */

/* ------------------------------------------------------------------ */
/* Territory                                                           */
/* ------------------------------------------------------------------ */

export type StemFlavor =
  | "english" | "german" | "french" | "greek" | "iberian" | "italian" | "turkish";

/** Invented, plausible place stems by linguistic flavor. */
export const STEMS: Record<StemFlavor, readonly string[]> = {
  english: [
    "Wexcombe", "Ashworth", "Calderwick", "Ravensmere", "Brackenholm",
    "Aldbourne", "Farndale", "Greyhurst", "Marlingford", "Thornbury",
    "Osmundwick", "Netherleigh", "Dunsmere", "Harrowfield", "Wychbourne",
  ],
  german: [
    "Wittgenau", "Hohenfelsen", "Sternberg-Adlau", "Eichenwald", "Falkenberg",
    "Lindenau", "Rosenfeld", "Steinbach", "Adlerstein", "Greifenholz",
    "Wolfsheim", "Brandenau", "Kesselburg", "Tannenfels", "Osterfeld",
  ],
  french: [
    "Montfaucon-le-Bas", "Valcourt", "Bellegarde-sur-Ourse", "Rochefort-l'Abbaye",
    "Chastelnoir", "Fontaine-les-Ormes", "Pierrelune", "Hautmont",
  ],
  greek: [
    "Chalkomera", "Argyrokastron-under-the-Walls", "Anthemion", "Petrachora",
    "Kydonopolis", "Melissene", "Chrysokamara", "Porphyra", "Strymnos",
  ],
  iberian: [
    "Vallescuro", "Torrealba", "Villaseca de los Olmos", "Montefrío-la-Vieja",
    "Peñadorada", "Fuenteoscura", "Castrillo de Duero-Menor", "Sierraluz",
  ],
  italian: [
    "Castelvetri", "Pietraforte", "Selvamora", "Montefosco", "Torregrigia",
    "Valdispina", "Rocca d'Ombra", "Poggio Lucente", "Civitella del Vento",
  ],
  turkish: [
    "Gümüşkaya", "Taşdere", "Kumluova", "Yıldıztepe", "Akpınar-of-the-Meadows",
    "Karasu Vale", "Gülbahçe", "Demirhisar",
  ],
};

/**
 * The mundane nouns behind tier 2. Kept in one place because the
 * absurdity of an output is measured by how often these appear.
 */
export const MUNDANE = [
  "Cupboard", "Pantry", "Larder", "Stairwell", "Biscuit", "Teapot",
  "Spoons", "Thermostat", "Airing-Cupboard", "Ottoman", "Draining Board",
  "Mantelpiece", "Hatstand", "Skirting Board", "Linen Press", "Coal Scuttle",
  "Boot Room", "Vestibule", "Doormat", "Banister", "Umbrella Stand",
  "Windowsill", "Butter Dish", "Egg Cup", "Toast Rack", "Sideboard",
  "Wainscot", "Draught Excluder", "Second-Best Chairs", "Spare Keys",
  "Doilies", "Tea Cosy", "Antimacassar", "Fork", "Towel", "Receipt", "Damp",
] as const;

export const TERRITORY_PREFIXES = [
  "Upper", "Lower", "Nether", "Greater", "Lesser", "Outer", "Further",
  "Hither", "Old", "New",
] as const;

export const TERRITORY_SUFFIXES = [
  "burg", "stein", "heim", "shire", "wick", "mouth", "ington", "bourne",
  "ford", "stadt", "dorf", "au", "bach", "berg", "thorpe", "combe",
] as const;

export const STEM_SYLLABLES = [
  "Alden", "Bram", "Cald", "Dun", "Ester", "Fal", "Grim", "Hessel",
  "Ise", "Kettle", "Lang", "Mar", "Nor", "Oster", "Quern", "Ravens",
  "Sel", "Thorn", "Ulver", "Wex",
] as const;

/* ------------------------------------------------------------------ */
/* Epithets                                                            */
/* ------------------------------------------------------------------ */

export const EPITHETS = {
  t0: [
    "the Bold", "the Great", "the Wise", "the Pious", "the Fair",
    "the Elder", "the Younger", "the Steadfast", "the Just",
    "the Magnificent", "the Silent", "the Good",
  ],
  t1: [
    "the Unready", "the Fat", "the Bald", "the Stammerer",
    "the Mostly Reasonable", "the Adequate", "the Late (while living)",
    "the Quarrelsome", "the Posthumous", "the Approximate",
    "the Unavoidable", "the Easily Startled",
  ],
  t2: [
    "the Insufficiently Boiled", "the Fully Reimbursed",
    "the Fourth of That Name", "the Slightly Damp", "the Punctual",
    "the Twice-Postponed", "the Beige", "the Lightly Salted",
    "the Regrettably Informed", "the Structurally Sound",
    "the Correctly Filed", "the Room-Temperature",
  ],
} as const;

/**
 * "The Fourth of That Name" only lands when the ordinal is II, so the
 * generator treats this entry as conditional.
 */
export const CONTRADICTORY_EPITHET = "the Fourth of That Name";

/* ------------------------------------------------------------------ */
/* Offices                                                             */
/* ------------------------------------------------------------------ */

export interface OfficeRow {
  name: string;
  hereditary: boolean;
  to?: string;
}

export const OFFICES: { t0: readonly OfficeRow[]; t1: readonly OfficeRow[]; t2: readonly OfficeRow[] } = {
  // Real historical offices, all of them defunct or generic.
  t0: [
    { name: "Master of the Horse", hereditary: false },
    { name: "Lord High Admiral", hereditary: false },
    { name: "Keeper of the Privy Seal", hereditary: false },
    { name: "Warden of the Marches", hereditary: false },
    { name: "Lord Warden of the Cinque Ports", hereditary: false },
    { name: "Grand Falconer", hereditary: true },
    { name: "Custos Rotulorum", hereditary: false },
    { name: "Chief Butler", hereditary: true },
    { name: "Lord High Steward", hereditary: false },
    { name: "Master of the Buckhounds", hereditary: false },
    { name: "Clerk of the Green Cloth", hereditary: false },
    { name: "Master of the Revels", hereditary: false },
    { name: "Keeper of the Great Seal", hereditary: false },
  ],
  t1: [
    { name: "Cup-Bearer", hereditary: true, to: "the Electoral Court" },
    { name: "Warden of the Lesser Forests", hereditary: false },
    { name: "Grand Master of the Hunt (Suspended)", hereditary: false },
    { name: "Keeper of the Second Seal", hereditary: false },
    { name: "Under-Falconer", hereditary: false, to: "the Margravial Mews" },
    { name: "Comptroller of the Outer Marches", hereditary: false },
    { name: "Surveyor of the Upper and Nether Roads", hereditary: false },
    { name: "Standard-Bearer", hereditary: true, to: "the Court of the Two Wexcombes" },
  ],
  t2: [
    { name: "Keeper of the Spoons", hereditary: true },
    { name: "Warden of the Lesser Stairwell", hereditary: false },
    { name: "Lord High Adjuster of the Thermostat", hereditary: false },
    { name: "Grand Falconer", hereditary: true, to: "the Pantry" },
    { name: "Custodian of the Second-Best Chairs", hereditary: false },
    { name: "Comptroller of the Biscuit", hereditary: false },
    { name: "Master of the Draining Board", hereditary: false },
    { name: "Keeper of the Draught Excluder", hereditary: true },
    { name: "Warden of the Decorative Soaps", hereditary: false },
    { name: "Lord High Rearranger of the Hall Cupboard", hereditary: false },
    { name: "Clerk of the Doilies", hereditary: false },
    { name: "Surveyor of the Queue", hereditary: false },
    { name: "Remembrancer of the Spare Keys", hereditary: true },
  ],
};

/* ------------------------------------------------------------------ */
/* Orders and other honours                                            */
/* ------------------------------------------------------------------ */

export interface OrderRow {
  /** "the Silver Heron" reads as "the Order of the Silver Heron". */
  name: string;
  /** Post-nominal initials appended to the grade letter: "SH" makes KSH. */
  initials: string;
  /**
   * Single-class orders (as the Garter is) carry fixed conventional
   * post-nominals instead of graded ones.
   */
  single?: { m: string; f: string; n: string };
  /** Tier 2 grades sometimes carry an augmentation. */
  augment?: readonly string[];
}

export const ORDERS: { t0: readonly OrderRow[]; t1: readonly OrderRow[]; t2: readonly OrderRow[] } = {
  // Historical orders, post-nominals per convention.
  t0: [
    { name: "the Garter", initials: "G", single: { m: "KG", f: "LG", n: "KG" } },
    { name: "the Golden Fleece", initials: "GF", single: { m: "GF", f: "GF", n: "GF" } },
    { name: "the Elephant", initials: "E", single: { m: "RE", f: "RE", n: "RE" } },
    { name: "St. Hubert", initials: "SH", single: { m: "KStH", f: "DStH", n: "KStH" } },
    { name: "the Iron Crown", initials: "IC" },
    { name: "the Crescent", initials: "C", single: { m: "KC", f: "KC", n: "KC" } },
    { name: "the Amaranth", initials: "A", single: { m: "KA", f: "LA", n: "KA" } },
  ],
  t1: [
    { name: "the Silver Heron", initials: "SH" },
    { name: "the Wittgenau Lion", initials: "WL" },
    { name: "Merit of the Two Wexcombes", initials: "MW" },
    { name: "the Oaken Garland", initials: "OG" },
    { name: "the Falcon of Hohenfelsen", initials: "FH" },
    { name: "the Starry Girdle", initials: "SG" },
    { name: "the Vigilant Owl", initials: "VO" },
  ],
  t2: [
    {
      name: "the Slightly Bent Fork", initials: "BF",
      augment: ["with Collar and Receipt", "with Crossed Spoons"],
    },
    { name: "the Towel", initials: "TW", augment: ["with Fringe"] },
    { name: "the Damp", initials: "D", augment: ["with Collar and Receipt"] },
    { name: "the Second Drawer", initials: "SD" },
    { name: "the Overwound Clock", initials: "OC" },
    { name: "the Tea Cosy", initials: "TC", augment: ["with Pom-Pom"] },
    { name: "Merit of the Pantry", initials: "MP" },
  ],
};

/** Grade prefixes for graded orders, most senior first. */
export const GRADES: readonly {
  letter: string;
  words: { m: string; f: string; n: string };
}[] = [
  { letter: "G", words: { m: "Knight Grand Cross", f: "Dame Grand Cross", n: "Grand Cross" } },
  { letter: "K", words: { m: "Knight Commander", f: "Dame Commander", n: "Commander" } },
  { letter: "C", words: { m: "Companion", f: "Companion", n: "Companion" } },
  { letter: "M", words: { m: "Member", f: "Member", n: "Member" } },
];

export interface DecorationRow {
  name: string;
  postNominal: string;
}

export const DECORATIONS: { t0: readonly DecorationRow[]; t1: readonly DecorationRow[]; t2: readonly DecorationRow[] } = {
  t0: [
    { name: "the Cross of Merit", postNominal: "CM" },
    { name: "the Medal of Valour", postNominal: "MV" },
  ],
  t1: [
    { name: "the Long Service Medal of the Electoral Court", postNominal: "LSM" },
    { name: "the Wittgenau Cross, Second Class", postNominal: "WC2" },
  ],
  t2: [
    { name: "the Medal of the Damp, Second Class", postNominal: "MD2" },
    { name: "the Household Order of the Butter Dish, Third Class", postNominal: "BD3" },
  ],
};

export const ACADEMIC: { t0: readonly DecorationRow[]; t1: readonly DecorationRow[]; t2: readonly DecorationRow[] } = {
  t0: [
    { name: "Fellow of the Royal Society of Wittgenau", postNominal: "FRSW" },
    { name: "Fellow of the Society of Antiquaries of Wexcombe", postNominal: "FSAW" },
  ],
  t1: [
    { name: "Corresponding Member of the Academy of the Two Wexcombes", postNominal: "CMAW" },
    { name: "Honorary Doctor of the University of Osterfeld", postNominal: "DrOst (hc)" },
  ],
  t2: [
    { name: "Fellow of the Royal Society of Biscuitry", postNominal: "FRSB" },
    { name: "Reader Emeritus in Cupboard Studies", postNominal: "RECS" },
  ],
};

/* ------------------------------------------------------------------ */
/* Formulas and protective formulas                                    */
/* ------------------------------------------------------------------ */

export interface FormulaRow {
  en: string;
  /** Latin form used when antiquity runs high. */
  la?: string;
}

export const FORMULAS: { t0: readonly FormulaRow[]; t1: readonly FormulaRow[]; t2: readonly FormulaRow[] } = {
  t0: [
    { en: "by the Grace of God", la: "Dei Gratia" },
    { en: "by Right of Conquest" },
  ],
  t1: [
    { en: "by the Grace of God and the Will of the Electors" },
    { en: "by the Grace of God and the Consent of the Estates" },
    { en: "by the Grace of God and the Will of the Nation" },
  ],
  t2: [
    { en: "by the Grace of God and the Parish Council (disputed)" },
    { en: "by the Grace of God and a Narrow Vote" },
    { en: "by Sufferance of the Tenants" },
    { en: "by the Grace of God and the Residents' Association (minuted)" },
    { en: "by the Grace of God and the Rota" },
  ],
};

export const PROTECTIVE = {
  t0: [
    "Defender of the Faith", "Protector of the Realm",
    "Guardian of the Marches", "Keeper of the Two Roads",
  ],
  t1: [
    "Advocate of the Abbey of Wittgenau", "Protector of the Lesser Forests",
    "Warden of the Coasts", "Advocate of the Abbey of Netherleigh",
  ],
  t2: [
    "Defender of the Biscuit", "Protector of the Lesser Cupboard (Contents)",
    "Guarantor of the Thermostat", "Keeper of the Spare Keys",
    "Defender of the Doormat", "Upholder of the Banister",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Mottoes                                                             */
/* ------------------------------------------------------------------ */

export interface MottoRow {
  text: string;
  language: "la" | "fr" | "en" | "mixed";
}

export const MOTTOES: { t0: readonly MottoRow[]; t1: readonly MottoRow[]; t2: readonly MottoRow[] } = {
  // Invented but grammatical.
  t0: [
    { text: "Fide et Fortitudine", language: "la" },
    { text: "Virtute Non Verbis", language: "la" },
    { text: "Constantia et Labore", language: "la" },
    { text: "Sub Umbra Quiescens", language: "la" },
    { text: "Droit et Loyal", language: "fr" },
    { text: "Lumen in Tenebris", language: "la" },
  ],
  // Correct Latin, suspicious sentiments.
  t1: [
    { text: "Festina Lentissime", language: "la" },
    { text: "Semper Aliquantulum", language: "la" },
    { text: "Dum Spiro, Dormio", language: "la" },
    { text: "Post Nubila, Merenda", language: "la" },
  ],
  // The joke must be visible to a non-Latinist: an English word in a
  // Latin frame.
  t2: [
    { text: "Semper Damp", language: "mixed" },
    { text: "Nihil Sine Receipt", language: "mixed" },
    { text: "Post Prandium Nihil", language: "la" },
    { text: "In Cupboard Veritas", language: "mixed" },
    { text: "Per Biscuit ad Astra", language: "mixed" },
    { text: "Non Sine Teapot", language: "mixed" },
    { text: "Honi Soit Qui Mal y Biscuit", language: "mixed" },
  ],
};

/* ------------------------------------------------------------------ */
/* Title statuses                                                      */
/* ------------------------------------------------------------------ */

import type { TitleStatus } from "../types.js";

/** Non-held statuses with weights, drawn as pretension climbs. */
export const PRETENDER_STATUSES: readonly (readonly [TitleStatus, number])[] = [
  ["titular", 3], ["claimed", 3], ["in-pretence", 2], ["disputed", 2],
  ["de-jure", 2], ["in-exile", 1], ["dormant", 1], ["vacant", 1],
];
