import { describe, expect, test } from "vitest";
import { FORMATS, KINDS, titulary } from "../src/index.js";

describe("determinism", () => {
  test("same seed, byte-identical output in every format", () => {
    for (const format of FORMATS) {
      expect(titulary({ seed: "quandle", format })).toEqual(
        titulary({ seed: "quandle", format }),
      );
    }
  });

  test("same seed, byte-identical output for every kind", () => {
    for (const kind of KINDS) {
      expect(titulary({ seed: "cupboard-7", kind })).toEqual(
        titulary({ seed: "cupboard-7", kind }),
      );
    }
  });

  test("numeric and string seeds are both stable", () => {
    expect(titulary({ seed: 7 })).toEqual(titulary({ seed: 7 }));
    expect(titulary({ seed: "7" })).toEqual(titulary({ seed: "7" }));
  });

  test("100 seeds all differ", () => {
    const seen = new Set<string>();
    for (let seed = 0; seed < 100; seed++) {
      seen.add(titulary({ seed, length: 0.7 }));
    }
    expect(seen.size).toBe(100);
  });

  test("dials are clamped, so out-of-range values collapse", () => {
    expect(titulary({ seed: "c", ridiculous: 5 })).toEqual(
      titulary({ seed: "c", ridiculous: 1 }),
    );
    expect(titulary({ seed: "c", length: -3 })).toEqual(
      titulary({ seed: "c", length: 0 }),
    );
    expect(titulary({ seed: "c", antiquity: NaN })).toEqual(
      titulary({ seed: "c", antiquity: 0.5 }),
    );
  });
});
