/**
 * titulary: seeded generator of nonsense royal and noble styles.
 *
 *   import { titulary } from "./dist/index.js";
 *   console.log(titulary({ seed: "cupboard-7", ridiculous: 0.9 }));
 */
import { Rng, randomSeed, type Seed } from "./rng.js";
import type {
  Address, Dials, Format, Gender, Honour, Kind, Motto, Office, Person, Rank,
  StyleKey, Title, TitleStatus, Titulary, TitularyOptions, Tradition,
} from "./types.js";
import { FORMATS, KINDS, TRADITIONS } from "./types.js";
import { generateTitulary, nameText, pickEpithet } from "./assemble.js";
import { renderText } from "./render/text.js";
import { renderMarkdown } from "./render/markdown.js";
import { escapeHtml, renderAddressHtml, renderHtml } from "./render/html.js";
import { renderJson } from "./render/json.js";
import { renderProclamation } from "./proclamation.js";
import { generateCourt, renderCourt } from "./court.js";

export type {
  Address, Dials, Format, Gender, Honour, Kind, Motto, Office, Person, Rank,
  Seed, StyleKey, Title, TitleStatus, Titulary, TitularyOptions, Tradition,
};
export { FORMATS, KINDS, TRADITIONS };
export { Rng, randomSeed };
export { generateTitulary, generateCourt, renderCourt };
export { renderText, renderMarkdown, renderHtml, renderJson };

/** Render a generated Titulary to the given format. */
export function render(t: Titulary, format: Format = "text"): string {
  switch (format) {
    case "text": return renderText(t);
    case "markdown": return renderMarkdown(t);
    case "html": return renderHtml(t);
    case "json": return renderJson(t);
  }
}

export interface TitularyCallOptions extends TitularyOptions {
  format?: Format;
  kind?: Kind;
  /** Persons for kind "court". */
  count?: number;
}

/** Generate and render in one call. */
export function titulary(opts: TitularyCallOptions = {}): string {
  const { format = "text", kind = "title", count = 8, ...rest } = opts;
  if (kind === "court") {
    return renderCourt(generateCourt(count, rest), format);
  }
  const t = generateTitulary(rest);
  if (format === "json") return renderJson(t);
  switch (kind) {
    case "title": return render(t, format);
    case "proclamation": return renderProclamation(t, format);
    case "name": return wrapFragment(nameText(t), "name", format);
    case "epithet": return wrapFragment(epithetOf(t), "epithet", format);
    case "motto": return wrapFragment(t.motto?.text ?? "", "motto", format, true);
    case "blazon": return wrapFragment(t.blazon ?? "", "blazon", format);
    case "honours":
      return wrapFragment(t.honours.map((h) => h.postNominal).join(", "), "honours", format);
    case "address": {
      const a = t.address!;
      if (format === "html") return renderAddressHtml(a);
      if (format === "markdown") {
        return [
          `**Envelope:** ${a.envelope}`,
          `**Salutation:** ${a.salutation}`,
          `**Verbal:** ${a.verbal}`,
        ].join("\n");
      }
      return [
        `Envelope:   ${a.envelope}`,
        `Salutation: ${a.salutation}`,
        `Verbal:     ${a.verbal}`,
      ].join("\n");
    }
  }
}

function wrapFragment(text: string, cls: string, format: Format, em = false): string {
  switch (format) {
    case "html": {
      const inner = em ? `<em>${escapeHtml(text)}</em>` : escapeHtml(text);
      return `<p class="${cls}">${inner}</p>`;
    }
    case "markdown":
      return em ? `*${text}*` : text;
    default:
      return text;
  }
}

/** The epithet a peer has, or would have if the dice had smiled. */
function epithetOf(t: Titulary): string {
  if (t.person.epithet) return t.person.epithet;
  const ep = new Rng(t.seed).fork("person:epithet");
  ep.chance(0.5); // consume the presence draw the generator made
  return pickEpithet(ep, t.dials.ridiculous, t.person.regnal);
}

/* ------------------------------------------------------------------ */
/* Fragments                                                           */
/* ------------------------------------------------------------------ */

/** One epithet: "the Insufficiently Boiled". */
export function epithet(opts: TitularyOptions = {}): string {
  return titulary({ ...opts, kind: "epithet" });
}

/** One blazon in correct blazon grammar. */
export function blazon(opts: TitularyOptions = {}): string {
  return titulary({ ...opts, kind: "blazon" });
}

/** The three Debrett's forms for a generated peer. */
export function address(opts: TitularyOptions = {}): Address {
  return generateTitulary(opts).address!;
}

/** One Latin-ish motto. */
export function motto(opts: TitularyOptions = {}): string {
  return titulary({ ...opts, kind: "motto" });
}

/** One proclamation with a dated close. */
export function proclamation(opts: TitularyOptions & { format?: Format } = {}): string {
  return titulary({ ...opts, kind: "proclamation" });
}

export const VERSION = "0.1.0";
