import { describe, expect, test } from "vitest";
import { buildAddress } from "../src/address.js";
import { british } from "../src/lexicon/british.js";
import { ALL_RANKS } from "../src/lexicon/index.js";
import type { Gender, Person, Rank, Title } from "../src/types.js";

function titleFor(rank: Rank): Title {
  if (rank.territorial === false) {
    return { rank, particle: "", territory: "", status: "held" };
  }
  return { rank, particle: rank.particles[0], territory: "the Lesser Cupboard", status: "held" };
}

const PERSON: Person = { given: ["Æthelred"], house: "Wexcombe" };

function forms(key: string, gender: Gender, antiquity = 0.2) {
  const rank = british.ladder.find((r) => r.key === key)!;
  return buildAddress(titleFor(rank), gender, PERSON, antiquity, "british");
}

describe("forms of address", () => {
  test("a marquess gets the Debrett's treatment exactly", () => {
    const a = forms("marquess", "m");
    expect(a.envelope).toBe("The Most Hon. the Marquess of the Lesser Cupboard");
    expect(a.salutation).toBe("Dear Lord Cupboard");
    expect(a.verbal).toBe("Lord Cupboard");
  });

  test("a marchioness gets the feminine column throughout", () => {
    const a = forms("marquess", "f");
    expect(a.envelope).toBe("The Most Hon. the Marchioness of the Lesser Cupboard");
    expect(a.salutation).toBe("Dear Lady Cupboard");
    expect(a.verbal).toBe("Lady Cupboard");
  });

  test("formal salutations appear once antiquity climbs", () => {
    expect(forms("marquess", "m", 0.8).salutation).toBe("My Lord Marquess");
    expect(forms("earl", "m", 0.8).salutation).toBe("My Lord");
    expect(forms("earl", "f", 0.8).salutation).toBe("My Lady");
    expect(forms("marquess", "m", 0.8).envelope)
      .toBe("The Most Honourable the Marquess of the Lesser Cupboard");
  });

  test("a duke is Your Grace", () => {
    const a = forms("duke", "m");
    expect(a.envelope).toBe("His Grace the Duke of the Lesser Cupboard");
    expect(a.salutation).toBe("Dear Duke");
    expect(a.verbal).toBe("Your Grace");
  });

  test("a king is addressed with full deference", () => {
    const a = forms("king", "f");
    expect(a.envelope).toBe("Her Majesty the Queen of the Lesser Cupboard");
    expect(a.salutation).toBe("May it please Your Majesty");
    expect(a.verbal).toBe("Your Majesty");
  });

  test("a baronet is Sir, a baronetess is Dame", () => {
    expect(forms("baronet", "m")).toEqual({
      envelope: "Sir Æthelred Wexcombe, Bt",
      salutation: "Dear Sir Æthelred",
      verbal: "Sir Æthelred",
    });
    expect(forms("baronet", "f")).toEqual({
      envelope: "Dame Æthelred Wexcombe, Btss",
      salutation: "Dear Dame Æthelred",
      verbal: "Dame Æthelred",
    });
    expect(forms("baronet", "f", 0.9).envelope).toBe("Dame Æthelred Wexcombe, Baronetess");
  });

  test("a laird is spoken to by the name of the place", () => {
    const a = forms("laird", "m");
    expect(a.envelope).toBe("The Much Hon. the Laird of the Lesser Cupboard");
    expect(a.verbal).toBe("Cupboard");
  });

  test("the neutral column invents nothing modern", () => {
    const a = forms("baron", "n");
    expect(a.salutation).toBe("Right Trusty and Well-Beloved Cousin");
    expect(a.verbal).toBe("Baron Cupboard");
  });

  test("every rank and gender yields complete, honest forms", () => {
    for (const rank of ALL_RANKS) {
      for (const gender of ["m", "f", "n"] as const) {
        for (const antiquity of [0.2, 0.8]) {
          const tradition = rank.traditions[0];
          const a = buildAddress(titleFor(rank), gender, PERSON, antiquity, tradition);
          const label = `${tradition}/${rank.key}/${gender}/${antiquity}`;
          for (const field of [a.envelope, a.salutation, a.verbal] as const) {
            expect(field.length, label).toBeGreaterThan(2);
            expect(field, label).not.toContain("undefined");
            expect(field, label).not.toMatch(/\s{2,}/);
          }
          // The spoken form never carries the envelope's full pomp.
          expect(a.verbal.length, label).toBeLessThanOrEqual(a.envelope.length);
        }
      }
    }
  });

  test("ottoman dignities go after the name", () => {
    const pasha = ALL_RANKS.find((r) => r.key === "pasha")!;
    const a = buildAddress(titleFor(pasha), "m", { given: ["Selim"] }, 0.2, "ottoman");
    expect(a.verbal).toBe("Selim Pasha");
    expect(a.envelope).toContain("Selim Pasha");
  });
});
