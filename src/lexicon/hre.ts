/**
 * The Holy Roman Empire: electors, prince-bishops, and hyphenated houses.
 * German sovereign dukes kept regnal numbers, so dukes are sovereign here.
 */
import type { Rank } from "../types.js";
import type { TraditionDef } from "./index.js";

const T = ["hre"] as const;

const ladder: readonly Rank[] = [
  {
    key: "emperor", forms: { m: "Emperor", f: "Empress", n: "Sovereign" },
    precedence: 100, sovereign: true, style: "imperial-majesty", particles: ["of"], traditions: T,
  },
  {
    key: "elector", forms: { m: "Elector", f: "Electress", n: "Elector" },
    precedence: 78, sovereign: false, style: "serene-highness", particles: ["of"], traditions: T,
  },
  {
    key: "prince-bishop",
    forms: { m: "Prince-Bishop", f: "Princess-Abbess", n: "Prince-Bishop" },
    precedence: 72, sovereign: true, style: "grace", particles: ["of"], traditions: T,
  },
  {
    key: "duke", forms: { m: "Duke", f: "Duchess", n: "Duke" },
    precedence: 70, sovereign: true, style: "grace", particles: ["of", "von", "zu"], traditions: T,
  },
  {
    key: "prince-fuerst", forms: { m: "Prince", f: "Princess", n: "Prince" },
    precedence: 68, sovereign: false, style: "serene-highness", particles: ["von", "zu"], traditions: T,
  },
  {
    key: "landgrave", forms: { m: "Landgrave", f: "Landgravine", n: "Landgrave" },
    precedence: 65, sovereign: false, style: "illustrious-highness", particles: ["in", "von"], traditions: T,
  },
  {
    key: "margrave", forms: { m: "Margrave", f: "Margravine", n: "Margrave" },
    precedence: 64, sovereign: false, style: "illustrious-highness", particles: ["von", "zu"], traditions: T,
  },
  {
    key: "count-palatine",
    forms: { m: "Count Palatine", f: "Countess Palatine", n: "Count Palatine" },
    precedence: 63, sovereign: false, style: "serene-highness", particles: ["of", "von"], traditions: T,
  },
  {
    key: "imperial-count",
    forms: { m: "Imperial Count", f: "Imperial Countess", n: "Imperial Count" },
    precedence: 50, sovereign: false, style: "illustrious-highness",
    particles: ["von", "zu", "in"], traditions: T,
  },
  {
    key: "burgrave", forms: { m: "Burgrave", f: "Burgravine", n: "Burgrave" },
    precedence: 45, sovereign: false, style: "none", particles: ["von", "zu"], traditions: T,
  },
  {
    key: "freiherr", forms: { m: "Baron", f: "Baroness", n: "Baron" },
    precedence: 30, sovereign: false, style: "none", particles: ["von", "zu"], traditions: T,
  },
  {
    key: "free-imperial-knight",
    forms: { m: "Free Imperial Knight", f: "Free Imperial Dame", n: "Free Imperial Knight" },
    precedence: 15, sovereign: false, style: "none", particles: ["von", "zu"], traditions: T,
  },
];

export const hre: TraditionDef = {
  key: "hre",
  ladder,
  stemFlavor: "german",
  house: "hyphen",
  // "Semper Augustus" closed the imperial style from Sigismund on.
  formulas0: [{ en: "ever August", la: "Semper Augustus" }],
  names: {
    m: [
      "Otto-Friedrich", "Sigismund", "Wenceslaus", "Balthasar", "Ludwig-Ernst",
      "Heinrich", "Albrecht", "Gottfried", "Adolphus", "Ferdinand-Karl",
      "Leopold-Anton", "Johann-Nepomuk", "Wolfram", "Berthold",
    ],
    f: [
      "Adelheid", "Wilhelmina", "Kunigunde", "Theodelinde", "Amalia-Sophie",
      "Charlotte-Luise", "Brunhilde", "Mechtild", "Walburga", "Ottilie",
      "Friederike", "Hedwig", "Adelgunde", "Sieglinde",
    ],
  },
};
