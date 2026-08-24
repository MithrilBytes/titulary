/**
 * A court: n distinct persons in order of precedence, ties broken by
 * seeded date of creation, as real precedence tables do.
 */
import { Rng } from "./rng.js";
import type { Titulary, TitularyOptions } from "./types.js";
import { generateTitulary } from "./assemble.js";
import { inlineText } from "./render/text.js";
import { escapeHtml } from "./render/html.js";

interface Courtier {
  t: Titulary;
  creation: number;
}

export function generateCourt(count: number, opts: TitularyOptions = {}): Titulary[] {
  const n = Math.max(1, Math.min(50, Math.floor(count) || 1));
  const baseSeed = String(opts.seed ?? "court");
  const seenNames = new Set<string>();
  const seenTerritories = new Set<string>();
  const courtiers: Courtier[] = [];
  for (let i = 0; i < n; i++) {
    let entry: Titulary | undefined;
    for (let retry = 0; retry < 8 && !entry; retry++) {
      const entrySeed = retry === 0 ? `${baseSeed}#court-${i}` : `${baseSeed}#court-${i}#r${retry}`;
      const candidate = generateTitulary({ ...opts, seed: entrySeed });
      const nameKey = candidate.person.given.join(" ");
      const territoryKey = candidate.primary.territory || `rank:${candidate.primary.rank.key}`;
      if (seenNames.has(nameKey) || seenTerritories.has(territoryKey)) continue;
      seenNames.add(nameKey);
      seenTerritories.add(territoryKey);
      entry = candidate;
    }
    if (!entry) continue;
    const creation = new Rng(String(entry.seed)).fork("creation").range(1100, 1900);
    courtiers.push({ t: entry, creation });
  }
  courtiers.sort((a, b) => {
    if (b.t.primary.rank.precedence !== a.t.primary.rank.precedence) {
      return b.t.primary.rank.precedence - a.t.primary.rank.precedence;
    }
    if (a.creation !== b.creation) return a.creation - b.creation;
    return a.t.person.given.join(" ").localeCompare(b.t.person.given.join(" "));
  });
  return courtiers.map((c) => c.t);
}

export function renderCourt(
  court: Titulary[], format: "text" | "markdown" | "html" | "json",
): string {
  switch (format) {
    case "text":
      return [
        "Order of Precedence",
        "",
        ...court.map((t, i) => `${String(i + 1).padStart(2)}. ${inlineText(t)}`),
      ].join("\n");
    case "markdown":
      return [
        "## Order of Precedence",
        "",
        ...court.map((t, i) => `${i + 1}. ${inlineText(t)}`),
      ].join("\n");
    case "html":
      return [
        '<section class="court">',
        "<h2>Order of Precedence</h2>",
        '<ol class="precedence">',
        ...court.map((t) => `<li>${escapeHtml(inlineText(t))}</li>`),
        "</ol>",
        "</section>",
      ].join("\n");
    case "json":
      return JSON.stringify(court, null, 2);
  }
}
