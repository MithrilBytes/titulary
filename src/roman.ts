/**
 * Roman numerals and English ordinal words, for regnal numbers,
 * proclamation dates, and reign years.
 */

// Standard subtractive notation, valid for 1 to 3999.
const ROMAN: readonly (readonly [number, string])[] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    throw new RangeError(`no Roman numeral for ${n}`);
  }
  let rest = n;
  let out = "";
  for (const [value, glyph] of ROMAN) {
    while (rest >= value) {
      out += glyph;
      rest -= value;
    }
  }
  return out;
}

/** Parse a strict subtractive-notation numeral; null when malformed. */
export function fromRoman(s: string): number | null {
  if (!/^[MDCLXVI]+$/.test(s)) return null;
  let rest = s;
  let n = 0;
  for (const [value, glyph] of ROMAN) {
    while (rest.startsWith(glyph)) {
      n += value;
      rest = rest.slice(glyph.length);
    }
  }
  if (rest.length > 0 || n < 1 || n > 3999) return null;
  // Reject non-canonical spellings such as IIII or XCX.
  return toRoman(n) === s ? n : null;
}

const ONES = [
  "zeroth", "first", "second", "third", "fourth", "fifth", "sixth",
  "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth",
  "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth",
  "eighteenth", "nineteenth",
] as const;

const TENS = [
  "", "", "twentieth", "thirtieth", "fortieth", "fiftieth",
  "sixtieth", "seventieth", "eightieth", "ninetieth",
] as const;

const TENS_PREFIX = [
  "", "", "twenty", "thirty", "forty", "fifty",
  "sixty", "seventy", "eighty", "ninety",
] as const;

/** English ordinal words for 0 to 99: "first", "twenty-third", ... */
export function ordinalWord(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 99) {
    throw new RangeError(`no ordinal word for ${n}`);
  }
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (ones === 0) return TENS[tens];
  return `${TENS_PREFIX[tens]}-${ONES[ones]}`;
}
