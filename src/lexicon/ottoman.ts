/**
 * The Ottoman court. Titles are the real historical ones, used straight:
 * Hatun and Hanimefendi are the attested feminine dignities, and the
 * grandiloquence ("Sultan of Sultans") goes first, as the sultans put it.
 */
import type { Rank } from "../types.js";
import type { TraditionDef } from "./index.js";

const T = ["ottoman"] as const;

const ladder: readonly Rank[] = [
  {
    key: "padishah", forms: { m: "Padishah", f: "Padishah", n: "Padishah" },
    precedence: 95, sovereign: true, style: "imperial-majesty", particles: ["of"], traditions: T,
  },
  {
    key: "sultan", forms: { m: "Sultan", f: "Sultana", n: "Sultan" },
    precedence: 90, sovereign: true, style: "majesty", particles: ["of"], traditions: T,
  },
  {
    key: "grand-vizier", forms: { m: "Grand Vizier", f: "Grand Vizier", n: "Grand Vizier" },
    precedence: 72, sovereign: false, style: "highness", territorial: false,
    particles: ["of"], traditions: T,
  },
  {
    key: "pasha", forms: { m: "Pasha", f: "Pasha", n: "Pasha" },
    precedence: 60, sovereign: false, style: "excellency", particles: ["of"], traditions: T,
  },
  {
    key: "bey", forms: { m: "Bey", f: "Hatun", n: "Bey" },
    precedence: 40, sovereign: false, style: "excellency", particles: ["of"], traditions: T,
  },
  {
    key: "agha", forms: { m: "Agha", f: "Agha", n: "Agha" },
    precedence: 30, sovereign: false, style: "none", particles: ["of"], traditions: T,
  },
  {
    key: "effendi", forms: { m: "Effendi", f: "Hanimefendi", n: "Effendi" },
    precedence: 15, sovereign: false, style: "none", territorial: false,
    particles: ["of"], traditions: T,
  },
];

export const ottoman: TraditionDef = {
  key: "ottoman",
  ladder,
  stemFlavor: "turkish",
  house: "of",
  order: ["protective", "formulas", "titles", "offices", "honours"],
  protective0: ["Sultan of Sultans", "Khan of Khans", "Shadow of God on Earth"],
  names: {
    m: [
      "Bayezid", "Murad", "Orhan", "Selim", "Mehmed", "Sinan", "Evliya",
      "Piri", "Turgut", "Iskender", "Davud", "Kasim",
    ],
    f: [
      "Hürrem", "Mihrimah", "Safiye", "Kösem", "Nurbanu", "Gevherhan",
      "Esma", "Adile", "Hatice", "Beyhan", "Fatma", "Gülruh",
    ],
  },
};
