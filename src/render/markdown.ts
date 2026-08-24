/**
 * Markdown: bold style line, italic formulas, one bullet per title,
 * post-nominals in code spans.
 */
import type { Titulary } from "../types.js";
import { buildSegments, joinTitle, type RenderedTitle } from "../assemble.js";

function mdTitle(r: RenderedTitle): string {
  const pre = r.pre ? (r.em ? `*${r.pre}* ` : `${r.pre} `) : "";
  const post = r.post ? ` ${r.post}` : "";
  return `${pre}${r.body}${post}`;
}

export function renderMarkdown(t: Titulary): string {
  const seg = buildSegments(t);
  if (seg.inline) {
    const pieces: string[] = [`**${seg.styleName}**`];
    for (const key of seg.order) {
      if (key === "formulas" && seg.formulas.length > 0) {
        pieces.push(`*${seg.formulas.join(", ")}*`);
      }
      if (key === "titles") pieces.push(...seg.titles.map(mdTitle));
      if (key === "offices") pieces.push(...seg.offices);
      if (key === "protective") pieces.push(...seg.protective);
    }
    pieces.push(...seg.postNominals.map((p) => `\`${p}\``));
    return pieces.join(", ");
  }
  const lines: string[] = [`**${seg.styleName}**`, ""];
  for (const key of seg.order) {
    switch (key) {
      case "formulas":
        if (seg.formulas.length > 0) lines.push(`*${seg.formulas.join(", ")}*`, "");
        break;
      case "titles":
        for (const title of seg.titles) lines.push(`- ${mdTitle(title)}`);
        break;
      case "offices":
        for (const office of seg.offices) lines.push(`- ${office}`);
        break;
      case "protective":
        for (const p of seg.protective) lines.push(`- ${p}`);
        break;
      case "honours":
        for (let i = 0; i < t.honours.length; i++) {
          lines.push(`- ${seg.honoursSpelled[i]} (\`${seg.postNominals[i]}\`)`);
        }
        break;
    }
  }
  if (seg.motto) lines.push("", `*${seg.motto.text}*`);
  if (seg.etc) lines.push("", "&c., &c., &c.");
  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

export { mdTitle, joinTitle };
