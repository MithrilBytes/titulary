import { describe, expect, test } from "vitest";
import { fromRoman, ordinalWord, toRoman } from "../src/roman.js";

describe("roman numerals", () => {
  test("every value from 1 to 3999 round-trips", () => {
    for (let n = 1; n <= 3999; n++) {
      expect(fromRoman(toRoman(n))).toBe(n);
    }
  });

  test("non-canonical or malformed numerals are rejected", () => {
    for (const bad of ["IIII", "XCX", "VX", "IL", "MMMM", "", "IV½", "ivx"]) {
      expect(fromRoman(bad), bad).toBeNull();
    }
  });

  test("out-of-range values throw", () => {
    expect(() => toRoman(0)).toThrow(RangeError);
    expect(() => toRoman(4000)).toThrow(RangeError);
    expect(() => toRoman(1.5)).toThrow(RangeError);
  });

  test("ordinal words come out in correct English", () => {
    expect(ordinalWord(0)).toBe("zeroth");
    expect(ordinalWord(1)).toBe("first");
    expect(ordinalWord(12)).toBe("twelfth");
    expect(ordinalWord(23)).toBe("twenty-third");
    expect(ordinalWord(40)).toBe("fortieth");
    expect(ordinalWord(70)).toBe("seventieth");
    expect(ordinalWord(99)).toBe("ninety-ninth");
    expect(() => ordinalWord(100)).toThrow(RangeError);
  });
});
