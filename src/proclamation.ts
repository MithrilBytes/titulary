/**
 * Proclamations: "We, N, ... to all to whom these Presents shall come,
 * Greeting." The royal We goes to everyone who asks for a proclamation,
 * baron or basileus; that is half the joke. The date and the regnal
 * year are seeded, and the reign never outruns seventy years.
 */
import { Rng } from "./rng.js";
import type { Titulary } from "./types.js";
import { buildSegments, joinTitle, nameText, renderTitle } from "./assemble.js";
import { ordinalWord } from "./roman.js";
import { escapeHtml } from "./render/html.js";
import { wrap } from "./render/text.js";

const MONTHS = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December",
] as const;

export interface Proclamation {
  body: string;
  close: string;
}

export function buildProclamation(t: Titulary): Proclamation {
  const seg = buildSegments(t);
  const p = new Rng(t.seed).fork("proclamation");
  const day = ordinalWord(p.range(1, 28));
  const month = p.pick(MONTHS);
  const reignYear = ordinalWord(p.range(1, 70));
  const anno = 1200 + p.int(700);

  const pieces: string[] = [];
  if (t.person.house) pieces.push(`of the House of ${t.person.house}`);
  if (seg.formulas.length > 0) pieces.push(seg.formulas.join(", "));
  // The style line is not used here, so the primary always leads.
  const titles = [t.primary, ...t.subsidiary].map((title) => renderTitle(title, t.gender));
  pieces.push(...titles.map(joinTitle));
  pieces.push(...seg.offices);
  pieces.push(...seg.protective);
  pieces.push(...seg.honoursSpelled);

  const body =
    `We, ${nameText(t)}, ${pieces.join(", ")}, &c., &c., &c., ` +
    `to all to whom these Presents shall come, Greeting.`;

  const at = t.primary.territory
    || t.subsidiary.find((s) => s.territory !== "")?.territory
    || t.person.house
    || "the Old Hall";
  const close = t.primary.rank.sovereign
    ? `Given at Our Court at ${at}, this ${day} day of ${month}, in the ${reignYear} year of Our Reign.`
    : `Given at Our Court at ${at}, this ${day} day of ${month}, in the year of Our Lord ${anno}.`;
  return { body, close };
}

export function renderProclamation(t: Titulary, format: "text" | "markdown" | "html" | "json"): string {
  const { body, close } = buildProclamation(t);
  switch (format) {
    case "text":
      return `${wrap(body, "  ")}\n\n${wrap(close, "  ")}`;
    case "markdown":
      return `${body}\n\n*${close}*`;
    case "html":
      return [
        '<article class="proclamation">',
        `<p>${escapeHtml(body)}</p>`,
        `<p class="dateline">${escapeHtml(close)}</p>`,
        "</article>",
      ].join("\n");
    case "json":
      return JSON.stringify({ body, close }, null, 2);
  }
}
