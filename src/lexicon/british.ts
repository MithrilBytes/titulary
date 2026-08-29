/**
 * The British ladder. Precedence follows the order of precedence as
 * Debrett's gives it; the numbers are our own shared scale. Thanes,
 * Chiefs of the Name, and Lords Proprietor are the real obscure corners
 * of the same system, and Proprietrix is the genuine feminine.
 */
import type { Rank } from "../types.js";
import type { TraditionDef } from "./index.js";

const T = ["british"] as const;

const ladder: readonly Rank[] = [
  {
    key: "emperor", forms: { m: "Emperor", f: "Empress", n: "Sovereign" },
    precedence: 100, sovereign: true, style: "imperial-majesty", particles: ["of"], traditions: T,
  },
  {
    key: "king", forms: { m: "King", f: "Queen", n: "Monarch" },
    precedence: 90, sovereign: true, style: "majesty", particles: ["of"], traditions: T,
  },
  {
    key: "prince", forms: { m: "Prince", f: "Princess", n: "Prince" },
    precedence: 80, sovereign: true, style: "royal-highness", styleAlt: "serene-highness",
    particles: ["of"], traditions: T,
  },
  {
    key: "grand-duke", forms: { m: "Grand Duke", f: "Grand Duchess", n: "Grand Duke" },
    precedence: 75, sovereign: true, style: "royal-highness", particles: ["of"], traditions: T,
  },
  {
    key: "archduke", forms: { m: "Archduke", f: "Archduchess", n: "Archduke" },
    precedence: 74, sovereign: false, style: "imperial-highness", particles: ["of"], traditions: T,
  },
  {
    key: "duke", forms: { m: "Duke", f: "Duchess", n: "Duke" },
    precedence: 70, sovereign: false, style: "grace", particles: ["of"], traditions: T,
  },
  {
    key: "marquess", forms: { m: "Marquess", f: "Marchioness", n: "Marquess" },
    precedence: 60, sovereign: false, style: "most-hon", particles: ["of"], traditions: T,
  },
  {
    key: "earl", forms: { m: "Earl", f: "Countess", n: "Earl" },
    precedence: 50, sovereign: false, style: "rt-hon", particles: ["of"], traditions: T,
  },
  {
    key: "viscount", forms: { m: "Viscount", f: "Viscountess", n: "Viscount" },
    precedence: 40, sovereign: false, style: "rt-hon", particles: ["of"], traditions: T,
  },
  {
    key: "baron", forms: { m: "Baron", f: "Baroness", n: "Baron" },
    precedence: 30, sovereign: false, style: "rt-hon", particles: ["of"], traditions: T,
  },
  {
    key: "lord-proprietor",
    forms: { m: "Lord Proprietor", f: "Lady Proprietrix", n: "Lord Proprietor" },
    precedence: 28, sovereign: false, style: "none", particles: ["of"], traditions: T,
  },
  {
    key: "chief-of-the-name",
    forms: { m: "Chief of the Name", f: "Chief of the Name", n: "Chief of the Name" },
    precedence: 25, sovereign: false, style: "much-honoured", particles: ["of"], traditions: T,
  },
  {
    key: "baronet", forms: { m: "Baronet", f: "Baronetess", n: "Baronet" },
    precedence: 20, sovereign: false, style: "none", particles: ["of"], traditions: T,
  },
  {
    key: "knight", forms: { m: "Knight", f: "Dame", n: "Knight" },
    precedence: 15, sovereign: false, style: "none", particles: ["of"], traditions: T,
  },
  {
    key: "thane", forms: { m: "Thane", f: "Thane", n: "Thane" },
    precedence: 12, sovereign: false, style: "much-honoured", particles: ["of"], traditions: T,
  },
  {
    key: "laird", forms: { m: "Laird", f: "Lady", n: "Laird" },
    precedence: 10, sovereign: false, style: "much-honoured", particles: ["of"], traditions: T,
  },
  {
    key: "lord-of-the-manor",
    forms: { m: "Lord of the Manor", f: "Lady of the Manor", n: "Lord of the Manor" },
    precedence: 5, sovereign: false, style: "none", particles: ["of"], traditions: T,
  },
  {
    key: "esquire", forms: { m: "Esquire", f: "Esquire", n: "Esquire" },
    precedence: 1, sovereign: false, style: "none", territorial: false,
    particles: ["of"], traditions: T,
  },
];

export const british: TraditionDef = {
  key: "british",
  ladder,
  stemFlavor: "english",
  house: "hyphen",
  names: {
    m: [
      "Æthelred", "Æthelstan", "Eadric", "Godwine", "Leofric", "Osric",
      "Wulfstan", "Cuthbert", "Dunstan", "Aldhelm", "Bertram", "Roderick",
      "Peregrine", "Ranulf", "Aylmer", "Crispin",
      "Oswine", "Eadwulf", "Beorhtric", "Sigeric", "Hereward", "Æthelwold",
      "Ceolwulf", "Ordgar", "Wigstan", "Ealdred", "Torhtmund", "Byrhtnoth",
    ],
    f: [
      "Æthelburga", "Eadgyth", "Wulfrun", "Godgifu", "Mildryth", "Rowena",
      "Isolde", "Berengaria", "Aldith", "Ermengarde", "Clotilda",
      "Petronilla", "Osburh", "Sexburga", "Wynflæd", "Everild",
      "Eadburh", "Cyneburh", "Leofgifu", "Wulfhild", "Ælfthryth",
      "Eormenhild", "Cwenburh", "Osgyth", "Hereswith", "Æbbe",
      "Frideswide", "Tova",
    ],
  },
};
