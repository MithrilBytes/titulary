/**
 * HTML: an <article class="titulary"> with an <h1> style line, an <ol>
 * of titles, and small-caps post-nominals via the .postnominal class.
 * No scripts; a stylesheet does the small caps.
 */
import type { Address, Titulary } from "../types.js";
import { buildSegments, type RenderedTitle } from "../assemble.js";

export function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function htmlTitle(r: RenderedTitle): string {
  const pre = r.pre ? (r.em ? `<em>${escapeHtml(r.pre)}</em> ` : `${escapeHtml(r.pre)} `) : "";
  const post = r.post ? ` ${escapeHtml(r.post)}` : "";
  return `${pre}${escapeHtml(r.body)}${post}`;
}

export function renderHtml(t: Titulary): string {
  const seg = buildSegments(t);
  const out: string[] = ['<article class="titulary">'];
  out.push(`<h1>${escapeHtml(seg.styleName)}</h1>`);
  for (const key of seg.order) {
    switch (key) {
      case "formulas":
        if (seg.formulas.length > 0) {
          out.push(`<p class="formulas"><em>${escapeHtml(seg.formulas.join(", "))}</em></p>`);
        }
        break;
      case "titles":
        if (seg.titles.length > 0) {
          out.push('<ol class="titles">');
          for (const title of seg.titles) out.push(`<li>${htmlTitle(title)}</li>`);
          out.push("</ol>");
        }
        break;
      case "offices":
        if (seg.offices.length > 0) {
          out.push('<ul class="offices">');
          for (const office of seg.offices) out.push(`<li>${escapeHtml(office)}</li>`);
          out.push("</ul>");
        }
        break;
      case "protective":
        if (seg.protective.length > 0) {
          out.push('<ul class="protective">');
          for (const p of seg.protective) out.push(`<li>${escapeHtml(p)}</li>`);
          out.push("</ul>");
        }
        break;
      case "honours":
        if (t.honours.length > 0) {
          out.push('<ul class="honours">');
          t.honours.forEach((h, i) => {
            out.push(
              `<li>${escapeHtml(seg.honoursSpelled[i])} <span class="postnominal">${escapeHtml(h.postNominal)}</span></li>`,
            );
          });
          out.push("</ul>");
        }
        break;
    }
  }
  if (seg.motto) out.push(`<p class="motto"><em>${escapeHtml(seg.motto.text)}</em></p>`);
  if (seg.etc) out.push('<p class="etc">&amp;c., &amp;c., &amp;c.</p>');
  out.push("</article>");
  return out.join("\n");
}

/** The three Debrett's forms as a definition list. */
export function renderAddressHtml(address: Address): string {
  return [
    '<dl class="address">',
    `<dt>Envelope</dt><dd>${escapeHtml(address.envelope)}</dd>`,
    `<dt>Salutation</dt><dd>${escapeHtml(address.salutation)}</dd>`,
    `<dt>Verbal</dt><dd>${escapeHtml(address.verbal)}</dd>`,
    "</dl>",
  ].join("\n");
}
