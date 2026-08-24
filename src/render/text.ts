/**
 * Plain text, in Unicode. Below length 0.6 everything sits on one line;
 * from 0.6 the style becomes a proclamation list, one title per line,
 * continuations indented, "&c., &c., &c." last.
 */
import type { Titulary } from "../types.js";
import { buildSegments, joinTitle, type Segments } from "../assemble.js";

const WIDTH = 78;

export function wrap(line: string, indent: string): string {
  if (line.length <= WIDTH) return line;
  const words = line.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current === "" ? word : `${current} ${word}`;
    if (candidate.length > WIDTH && current !== "") {
      lines.push(current);
      current = `${indent}${word}`;
    } else {
      current = candidate;
    }
  }
  lines.push(current);
  return lines.join("\n");
}

/** The pieces of the middle of the style, in tradition order. */
export function orderedPieces(seg: Segments): string[] {
  const pieces: string[] = [];
  for (const key of seg.order) {
    switch (key) {
      case "formulas":
        if (seg.formulas.length > 0) pieces.push(seg.formulas.join(", "));
        break;
      case "titles":
        for (const title of seg.titles) pieces.push(joinTitle(title));
        break;
      case "offices":
        pieces.push(...seg.offices);
        break;
      case "protective":
        pieces.push(...seg.protective);
        break;
      case "honours":
        break; // Post-nominals always close the style.
    }
  }
  return pieces;
}

/** The single-line form, whatever the length dial says. */
export function inlineText(t: Titulary): string {
  const seg = buildSegments(t);
  const pieces = [seg.styleName, ...orderedPieces(seg), ...seg.postNominals];
  return pieces.filter((p) => p !== "").join(", ");
}

export function renderText(t: Titulary): string {
  const seg = buildSegments(t);
  // Below 0.6 the style is one line, unwrapped: the terminal can fold
  // it, but the output itself stays a single line.
  if (seg.inline) return inlineText(t);
  const entries = [seg.styleName, ...orderedPieces(seg), ...seg.honoursSpelled];
  if (seg.motto) entries.push(seg.motto.text);
  if (seg.etc) entries.push("&c., &c., &c.");
  const last = entries.length - 1;
  return entries
    .map((entry, i) => {
      const indented = i === 0 ? entry : `  ${entry}`;
      const punctuated = i === last ? indented : `${indented},`;
      return wrap(punctuated, "    ");
    })
    .join("\n");
}
