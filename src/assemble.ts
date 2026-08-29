/**
 * Assembly: draw a whole peer from forked streams and put every part in
 * the order the tradition demands.
 *
 * Stream discipline: each slot draws from its own named fork, so turning
 * one dial never reshuffles an unrelated slot. Sweeping `ridiculous`
 * changes what things are called, never who the person is.
 */
import { Rng, lerp, randomSeed } from "./rng.js";
import { pickTiered, resolveDials } from "./dials.js";
import type {
  Dials, Gender, Honour, Motto, Office, Rank, SegmentKey, Title, TitleStatus,
  Titulary, TitularyOptions, Tradition,
} from "./types.js";
import {
  ALL_RANKS, TRADITION_KEYS, defFor, segmentOrder, type TraditionDef,
} from "./lexicon/index.js";
import {
  ACADEMIC, CONTRADICTORY_EPITHET, DECORATIONS, EPITHETS, FORMULAS, GRADES,
  MOTTOES, OFFICES, ORDERS, PRETENDER_STATUSES, PROTECTIVE,
  type FormulaRow, type OrderRow,
} from "./lexicon/tiers.js";
import { houseName, uniqueTerritory } from "./territory.js";
import { PUISSANCE, buildAddress, possessive, styleTokens, styleText } from "./address.js";
import { generateBlazon } from "./blazon.js";
import { ordinalWord, toRoman } from "./roman.js";

export function generateTitulary(opts: TitularyOptions = {}): Titulary {
  const seed = opts.seed ?? randomSeed();
  const dials = resolveDials(opts);
  const { ridiculous: r, length, antiquity, pretension } = dials;
  const root = new Rng(seed);

  const traditionOpt: Tradition = opts.tradition ?? "british";
  const actual = traditionOpt === "mixed"
    ? root.fork("tradition").pick(TRADITION_KEYS)
    : traditionOpt;
  const def = defFor(actual);

  const gender: Gender =
    opts.gender === undefined || opts.gender === "random"
      ? root.fork("person:gender").pick(["m", "f"] as const)
      : opts.gender;

  /* Primary rank, drawn before anything that depends on it. */
  const primaryRank = root.fork("primary:rank").pick(def.ladder);
  const styleKey =
    primaryRank.styleAlt && root.fork("primary:style").chance(0.5)
      ? primaryRank.styleAlt
      : primaryRank.style;

  /* Person. */
  const namePool = gender === "n"
    ? [...def.names.m, ...def.names.f]
    : def.names[gender];
  const givenCount = length >= 0.6 ? 2 : 1;
  const given = root.fork("person:given").sample(namePool, givenCount);

  const houseRng = root.fork("person:house");
  const house = houseRng.chance(0.7) ? houseName(houseRng, def, length) : undefined;

  let regnal: string | undefined;
  const numbered = primaryRank.sovereign && primaryRank.numbered !== false;
  const base = root.fork("person:regnal").range(1, 12);
  if (numbered) {
    regnal = toRoman(base);
    const abs = root.fork("person:regnal-absurd");
    if (r >= 0.5 && abs.chance((r - 0.5) * 0.9)) {
      const variant = abs.int(3);
      if (variant === 0) regnal = toRoman(abs.range(13, 47));
      else if (variant === 1) regnal = "0th";
      else regnal = `${toRoman(base)}½`;
    } else if (antiquity >= 0.7 && abs.chance(0.5)) {
      regnal = `the ${capitalize(ordinalWord(base))} of That Name`;
    }
  }

  const ep = root.fork("person:epithet");
  const hasEpithet = ep.chance(0.2 + 0.7 * r);
  let epithet = hasEpithet ? pickEpithet(ep, r, regnal) : undefined;
  if (actual === "byzantine" && antiquity >= 0.5 && ep.chance(0.4)) {
    epithet = gender === "f" ? "Porphyrogennete" : "Porphyrogennetos";
  }

  const person = { given, regnal, epithet, house };

  /* Style tokens, with puissance stacked in as antiquity climbs. */
  const stackRng = root.fork("style");
  const stackCount =
    antiquity >= 0.9 ? 3 : antiquity >= 0.75 ? 2 : antiquity >= 0.5 ? 1 : 0;
  const stacked = stackRng.chance((antiquity - 0.4) * 1.2);
  const stack =
    stacked && stackCount > 0 && primaryRank.precedence >= 60 && isPossessive(styleKey)
      ? stackRng.sample(PUISSANCE, stackCount)
      : [];
  const style = styleTokens(styleKey, gender, antiquity, stack);

  /* Territories, unique across the whole style. */
  const used = new Set<string>();
  const primary = drawTitle(
    root.fork("primary:territory"), primaryRank, actual, r, length, used,
  );
  primary.status = drawStatus(root.fork("primary:status"), pretension);

  /* Formulas. */
  const formulas: string[] = [];
  if (primaryRank.sovereign && (length >= 0.25 || antiquity >= 0.5)) {
    const f = root.fork("formulas");
    const pool = {
      t0: [...FORMULAS.t0, ...(def.formulas0 ?? [])],
      t1: FORMULAS.t1,
      t2: FORMULAS.t2,
    };
    const count = 1 + (length >= 0.7 ? 1 : 0) + (antiquity >= 0.75 ? 1 : 0);
    for (let i = 0; i < count; i++) {
      const row = pickTiered(f, r, pool).value as FormulaRow;
      const text = antiquity >= 0.6 && row.la ? row.la : row.en;
      if (!formulas.includes(text)) formulas.push(text);
    }
  }

  /* Subsidiary titles: strictly descending precedence; held ones stay
   * below the primary, but a pretender may claim above their station,
   * as the Jacobites styled themselves kings while holding less. */
  const subsidiary: Title[] = [];
  const targetCount = Math.round(lerp(0, 14, length));
  if (targetCount > 0) {
    const pool = traditionOpt === "mixed" ? ALL_RANKS : def.ladder;
    const claims = root.fork("subsidiary:claims");
    const wantClaims =
      pretension >= 0.3 ? Math.min(2, Math.round(pretension * 2 * claims.next())) : 0;
    const above = distinctByPrecedence(
      pool.filter((k) => k.precedence > primaryRank.precedence),
    );
    const below = distinctByPrecedence(
      pool.filter((k) => k.precedence < primaryRank.precedence && k.key !== "esquire"),
    );
    const claimRanks = claims.sample(above, Math.min(wantClaims, targetCount));
    const heldRanks = root
      .fork("subsidiary:ranks")
      .sample(below, targetCount - claimRanks.length);
    const chosen = [...claimRanks, ...heldRanks].sort(
      (a, b) => b.precedence - a.precedence,
    );
    chosen.forEach((rank, i) => {
      const stream = root.fork(`subsidiary:${i}`);
      const title = drawTitle(stream, rank, actual, r, length, used);
      const isClaim = rank.precedence > primaryRank.precedence;
      title.status = isClaim
        ? (stream.fork("status").weighted(PRETENDER_STATUSES) as TitleStatus)
        : drawStatus(stream.fork("status"), pretension);
      subsidiary.push(title);
    });
  }

  /* Offices. */
  const offices: Office[] = [];
  const officeCount = Math.round(lerp(0, 7, length));
  const officeRng = root.fork("offices");
  for (let i = 0; i < officeCount * 2 && offices.length < officeCount; i++) {
    const row = pickTiered(officeRng, r, OFFICES).value;
    if (offices.some((o) => o.name === row.name)) continue;
    offices.push({ name: row.name, hereditary: row.hereditary, to: row.to });
  }

  /* Protective formulas. */
  const protective: string[] = [];
  if (length >= 0.55 || (primaryRank.sovereign && length >= 0.3)) {
    const pool = {
      t0: [...PROTECTIVE.t0, ...(def.protective0 ?? [])],
      t1: PROTECTIVE.t1,
      t2: PROTECTIVE.t2,
    };
    const p = root.fork("protective");
    const count = Math.max(1, Math.round(lerp(0, 3, length)));
    for (let i = 0; i < count * 2 && protective.length < count; i++) {
      const text = pickTiered(p, r, pool).value;
      if (!protective.includes(text)) protective.push(text);
    }
  }

  /* Honours. */
  const honours = drawHonours(root.fork("honours"), r, length, antiquity, gender, actual);

  /* Motto, always drawn so the motto kind exists at every length. */
  const mottoRow = pickTiered(root.fork("motto"), r, MOTTOES).value;
  const motto: Motto = { text: mottoRow.text, language: mottoRow.language };

  const t: Titulary = {
    seed,
    tradition: traditionOpt,
    gender,
    dials,
    person,
    style,
    formulas,
    primary,
    subsidiary,
    offices,
    protective,
    honours,
    motto,
    etc: length >= 0.6,
    blazon: generateBlazon(root.fork("blazon"), r),
  };
  t.address = buildAddress(primary, gender, person, antiquity, actual);
  return t;
}

/* ------------------------------------------------------------------ */
/* Draw helpers                                                        */
/* ------------------------------------------------------------------ */

export function pickEpithet(rng: Rng, r: number, regnal: string | undefined): string {
  let { value } = pickTiered(rng, r, EPITHETS);
  // "The Fourth of That Name" only lands when the ordinal is II.
  if (value === CONTRADICTORY_EPITHET && regnal !== "II") {
    const alternates = EPITHETS.t2.filter((e) => e !== CONTRADICTORY_EPITHET);
    value = rng.pick(alternates);
  }
  return value;
}

function drawTitle(
  rng: Rng, rank: Rank, fallback: Exclude<Tradition, "mixed">,
  r: number, length: number, used: Set<string>,
): Title {
  if (rank.territorial === false) {
    used.add(`rank:${rank.key}`);
    return { rank, particle: "", territory: "", status: "held" };
  }
  const flavor = defFor(rank.traditions[0] ?? fallback).stemFlavor;
  const territory = uniqueTerritory(rng, r, length, flavor, used);
  // "von" and its cousins govern bare names, never an English article:
  // "Margravine zu Eichenwald" but "Margravine of the Lesser Cupboard".
  const drawn = rng.pick(rank.particles);
  const particle = territory.startsWith("the ") && drawn !== "of" ? "of" : drawn;
  return { rank, particle, territory, status: "held" };
}

function drawStatus(rng: Rng, pretension: number): TitleStatus {
  // One draw either way, so the pretension sweep stays aligned.
  const pretend = rng.chance(pretension);
  const status = rng.weighted(PRETENDER_STATUSES) as TitleStatus;
  return pretend ? status : "held";
}

function distinctByPrecedence(ranks: readonly Rank[]): Rank[] {
  const seen = new Set<number>();
  const out: Rank[] = [];
  for (const rank of ranks) {
    if (seen.has(rank.precedence)) continue;
    seen.add(rank.precedence);
    out.push(rank);
  }
  return out;
}

function drawHonours(
  rng: Rng, r: number, length: number, antiquity: number,
  gender: Gender, tradition: Exclude<Tradition, "mixed">,
): Honour[] {
  const honours: Honour[] = [];
  const usedOrders = new Set<string>();
  const orderCount = Math.round(6 * length * length);
  for (let i = 0; i < orderCount * 2 && honours.length < orderCount; i++) {
    const { value, tier } = pickTiered(rng, r, ORDERS);
    const row = value as OrderRow;
    if (usedOrders.has(row.name)) continue;
    usedOrders.add(row.name);
    // Precedence is fixed per order, as the real tables do it: a
    // Companion of a senior order walks ahead of a Grand Cross of a
    // junior one.
    const precedence = orderPrecedence(row, tier);
    if (row.single) {
      honours.push({
        order: row.name,
        grade: gender === "f" ? "Lady" : "Knight",
        postNominal: row.single[gender],
        precedence,
        tier,
      });
      continue;
    }
    const grade = rng.weighted([
      [GRADES[0], 1 + 2 * length], [GRADES[1], 2], [GRADES[2], 2], [GRADES[3], 1],
    ] as const);
    let words = grade.words[gender];
    if (tier === 2 && row.augment && rng.chance(0.5)) {
      words = `${words} ${rng.pick(row.augment)}`;
    }
    honours.push({
      order: row.name,
      grade: words,
      postNominal: `${grade.letter}${row.initials}`,
      precedence,
      tier,
    });
  }
  if (length >= 0.5 && rng.chance(0.6)) {
    const { value, tier } = pickTiered(rng, r, DECORATIONS);
    honours.push({ order: value.name, grade: "", postNominal: value.postNominal, precedence: 50 - tier, tier });
  }
  if (length >= 0.6 && rng.chance(0.5)) {
    const { value, tier } = pickTiered(rng, r, ACADEMIC);
    honours.push({ order: value.name, grade: "", postNominal: value.postNominal, precedence: 30 - tier, tier });
  }
  // The modern British tail: DL, then JP, exactly where Debrett's puts them.
  if (tradition === "british" && antiquity < 0.5) {
    if (rng.chance(0.35 + 0.4 * length)) {
      honours.push({ order: "Deputy Lieutenant", grade: "", postNominal: "DL", precedence: 10, tier: 0 });
    }
    if (rng.chance(0.2)) {
      honours.push({ order: "Justice of the Peace", grade: "", postNominal: "JP", precedence: 8, tier: 0 });
    }
  }
  const seen = new Set<string>();
  return honours
    .filter((h) => (seen.has(h.postNominal) ? false : (seen.add(h.postNominal), true)))
    .sort((a, b) => b.precedence - a.precedence);
}

/** 96 down to 61: tier 0 orders first, then tier 1, then tier 2. */
function orderPrecedence(row: OrderRow, tier: 0 | 1 | 2): number {
  const list = tier === 0 ? ORDERS.t0 : tier === 1 ? ORDERS.t1 : ORDERS.t2;
  const index = list.findIndex((o) => o.name === row.name);
  return 96 - tier * 12 - index;
}

function isPossessive(key: string): boolean {
  return ![
    "most-illustrious", "most-hon", "rt-hon", "right-reverend",
    "very-reverend", "much-honoured", "none",
  ].includes(key);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ------------------------------------------------------------------ */
/* Segments: the renderer-neutral reading order                        */
/* ------------------------------------------------------------------ */

export interface RenderedTitle {
  /** "titular" or "de jure", before the rank. */
  pre: string;
  /** Whether the prefix is set in italics where the format can. */
  em: boolean;
  body: string;
  /** "(disputed)" and friends, after the territory. */
  post: string;
}

export interface Segments {
  /** The opening line: style, name, or style plus primary title. */
  styleName: string;
  /** True when the primary title is already inside the opening line. */
  primaryInStyle: boolean;
  formulas: string[];
  titles: RenderedTitle[];
  offices: string[];
  protective: string[];
  honoursSpelled: string[];
  postNominals: string[];
  motto?: Motto;
  etc: boolean;
  order: readonly SegmentKey[];
  /** Below length 0.6 everything joins into a single line. */
  inline: boolean;
}

export function nameText(t: Titulary): string {
  let name = t.person.given.join(" ");
  if (t.person.regnal) name += ` ${t.person.regnal}`;
  if (t.person.epithet) {
    // "the Tenth of That Name, the Fully Reimbursed" wants the comma;
    // "Adelheid IV the Unready" does not.
    const comma = t.person.regnal?.startsWith("the ") ? "," : "";
    name += `${comma} ${t.person.epithet}`;
  }
  return name;
}

export function titleBody(title: Title, gender: Gender): string {
  const form = title.rank.forms[gender];
  if (title.territory === "") return form;
  return `${form} ${title.particle} ${title.territory}`;
}

// "In abeyance" and "sub judice" are the genuine legal registers for a
// peerage in limbo, which is what makes them fit.
const STATUS_POST: Partial<Record<TitleStatus, readonly string[]>> = {
  claimed: ["(claimed)", "(by courtesy)", "(claim lodged)"],
  "in-pretence": ["(in pretence)"],
  disputed: ["(disputed)", "(subject to appeal)", "(sub judice)"],
  "in-exile": ["(in exile)"],
  dormant: ["(dormant)", "(in abeyance)"],
  vacant: ["(vacant; claimed)", "(vacant; contested)"],
};

export function renderTitle(title: Title, gender: Gender): RenderedTitle {
  const body = titleBody(title, gender);
  let pre = "";
  let em = false;
  let post = "";
  if (title.status === "titular") pre = "titular";
  else if (title.status === "de-jure") { pre = "de jure"; em = true; }
  else if (title.status !== "held") {
    const variants = STATUS_POST[title.status]!;
    post = variants[hashParity(title.territory) % variants.length];
  }
  return { pre, em, body, post };
}

function hashParity(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function spellHonour(h: Honour): string {
  return h.grade ? `${h.grade} of the Order of ${h.order}` : h.order;
}

function styleUsesName(t: Titulary): boolean {
  const key = t.primary.rank.style;
  if (isPossessive(key) && t.style.length > 0) return true;
  // Peerage tables write "The Earl of Wexcombe" with no given name; the
  // name appears once the entry grows ceremonial, or when an epithet
  // demands a bearer.
  return t.dials.length > 0.5 || t.dials.antiquity > 0.5 || Boolean(t.person.epithet);
}

export function buildSegments(t: Titulary): Segments {
  const gender = t.gender;
  const styled = styleText(t.style);
  const name = nameText(t);
  const primaryRendered = renderTitle(t.primary, gender);
  let styleName: string;
  let primaryInStyle = false;

  if (t.style.length === 0) {
    // Untitled styles: Sir Given House, or the bare name.
    const rank = t.primary.rank;
    const surnamed = t.person.house ? `${name} ${t.person.house}` : name;
    if (rank.key === "baronet" || rank.key === "knight") {
      const sir = gender === "f" ? "Dame" : gender === "m" ? "Sir" : "";
      styleName = sir ? `${sir} ${surnamed}` : surnamed;
    } else {
      styleName = surnamed;
    }
  } else if (styleUsesName(t)) {
    styleName = `${styled} ${name}`;
  } else {
    styleName = `${styled} the ${joinTitle(primaryRendered)}`;
    primaryInStyle = true;
  }

  const titles: RenderedTitle[] = [];
  if (!primaryInStyle) titles.push(primaryRendered);
  for (const s of t.subsidiary) titles.push(renderTitle(s, gender));

  const offices = t.offices.map(
    (o) => `${o.hereditary ? "Hereditary " : ""}${o.name}${o.to ? ` to ${o.to}` : ""}`,
  );

  return {
    styleName,
    primaryInStyle,
    formulas: [...t.formulas],
    titles,
    offices,
    protective: [...t.protective],
    honoursSpelled: t.honours.map(spellHonour),
    postNominals: t.honours.map((h) => h.postNominal),
    motto: t.motto,
    etc: t.etc,
    order: segmentOrder(t.tradition),
    inline: t.dials.length < 0.6,
  };
}

export function joinTitle(r: RenderedTitle): string {
  const pre = r.pre ? `${r.pre} ` : "";
  const post = r.post ? ` ${r.post}` : "";
  return `${pre}${r.body}${post}`;
}

export { possessive, styleText };
