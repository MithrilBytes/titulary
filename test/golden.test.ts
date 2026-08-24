import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { KINDS, titulary, type Kind } from "../src/index.js";

/**
 * Golden snapshots: eight seeds across every kind, plus one seed in all
 * four formats. `npm run snapshots` regenerates the files.
 */
const GOLDEN_DIR = join(dirname(fileURLToPath(import.meta.url)), "golden");
const UPDATE = process.env.UPDATE_GOLDENS === "1";

const SEEDS = ["1", "2", "3", "42", "cupboard-7", "wexcombe", "damp", "precedence"] as const;

function generate(seed: string, kind: Kind, format?: "markdown" | "html" | "json"): string {
  return titulary({ seed, kind, format, count: 5 }) + "\n";
}

describe("golden snapshots", () => {
  const cases: { file: string; content: string }[] = [];
  for (const seed of SEEDS) {
    for (const kind of KINDS) {
      cases.push({ file: `${seed}-${kind}.txt`, content: generate(seed, kind) });
    }
  }
  for (const format of ["markdown", "html", "json"] as const) {
    cases.push({
      file: `cupboard-7-title.${format === "markdown" ? "md" : format}`,
      content: generate("cupboard-7", "title", format),
    });
  }

  if (UPDATE) {
    test("regenerate golden files", () => {
      mkdirSync(GOLDEN_DIR, { recursive: true });
      for (const { file, content } of cases) {
        writeFileSync(join(GOLDEN_DIR, file), content);
      }
      expect(cases.length).toBeGreaterThan(0);
    });
  } else {
    test.each(cases.map((c) => [c.file, c.content] as const))("%s", (file, content) => {
      let expected: string;
      try {
        expected = readFileSync(join(GOLDEN_DIR, file), "utf8");
      } catch {
        throw new Error(`missing golden file ${file}; run: npm run snapshots`);
      }
      expect(content).toBe(expected);
    });
  }
});
