import { describe, expect, test } from "vitest";
import { KINDS, titulary } from "../src/index.js";

const CONTAINERS = [
  "article", "section", "ol", "ul", "li", "p", "h1", "h2", "dl", "dt", "dd",
  "em", "span",
];

function assertBalanced(html: string, label: string): void {
  for (const tag of CONTAINERS) {
    const open = (html.match(new RegExp(`<${tag}[ >]`, "g")) ?? []).length;
    const close = (html.match(new RegExp(`</${tag}>`, "g")) ?? []).length;
    expect(open, `${label}: <${tag}>`).toBe(close);
  }
}

describe("html output", () => {
  test("every kind is tag-balanced at every dial extreme", () => {
    for (const kind of KINDS) {
      for (let seed = 0; seed < 6; seed++) {
        for (const dial of [0, 1]) {
          const html = titulary({
            seed, kind, format: "html",
            ridiculous: dial, length: dial, antiquity: dial, pretension: dial,
          });
          assertBalanced(html, `${kind} seed ${seed} dial ${dial}`);
          expect(html).not.toContain("undefined");
          expect(html).not.toContain("[object Object]");
        }
      }
    }
  });

  test("ampersands and angle brackets are escaped", () => {
    for (let seed = 0; seed < 20; seed++) {
      const html = titulary({ seed, format: "html", length: 1 });
      // Raw ampersands must all be entity starts.
      const raw = html.replace(/&(amp|lt|gt|quot|#\d+);/g, "");
      expect(raw.includes("&"), `seed ${seed}`).toBe(false);
    }
  });

  test("the et-cetera line renders as entities", () => {
    const html = titulary({ seed: 1, format: "html", length: 1 });
    expect(html).toContain('<p class="etc">&amp;c., &amp;c., &amp;c.</p>');
  });
});
