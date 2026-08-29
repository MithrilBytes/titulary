/**
 * The Italian states. The Doge is a head of state who never took a
 * regnal number, hence sovereign but unnumbered; "Patrician of Venice"
 * is a fixed dignity with no fief of its own, and a Signore held a city
 * the way the signorie actually did.
 */
import type { Rank } from "../types.js";
import type { TraditionDef } from "./index.js";

const T = ["italian"] as const;

const ladder: readonly Rank[] = [
  {
    key: "doge", forms: { m: "Doge", f: "Dogaressa", n: "Doge" },
    precedence: 88, sovereign: true, numbered: false, style: "serenity",
    particles: ["of"], traditions: T,
  },
  {
    key: "grand-duke", forms: { m: "Grand Duke", f: "Grand Duchess", n: "Grand Duke" },
    precedence: 75, sovereign: true, style: "royal-highness", particles: ["of", "di"], traditions: T,
  },
  {
    key: "prince", forms: { m: "Prince", f: "Princess", n: "Prince" },
    precedence: 68, sovereign: false, style: "serene-highness", particles: ["di"], traditions: T,
  },
  {
    key: "marchese", forms: { m: "Marchese", f: "Marchesa", n: "Marchese" },
    precedence: 60, sovereign: false, style: "excellency", particles: ["di"], traditions: T,
  },
  {
    key: "conte", forms: { m: "Conte", f: "Contessa", n: "Conte" },
    precedence: 50, sovereign: false, style: "most-illustrious", particles: ["di", "dei"], traditions: T,
  },
  {
    key: "signore", forms: { m: "Signore", f: "Signora", n: "Signore" },
    precedence: 45, sovereign: false, style: "none", particles: ["di"], traditions: T,
  },
  {
    key: "visconte", forms: { m: "Visconte", f: "Viscontessa", n: "Visconte" },
    precedence: 40, sovereign: false, style: "most-illustrious", particles: ["di"], traditions: T,
  },
  {
    key: "barone", forms: { m: "Barone", f: "Baronessa", n: "Barone" },
    precedence: 30, sovereign: false, style: "none", particles: ["di"], traditions: T,
  },
  {
    key: "patrician",
    forms: { m: "Patrician of Venice", f: "Patrician of Venice", n: "Patrician of Venice" },
    precedence: 20, sovereign: false, style: "none", territorial: false,
    particles: ["of"], traditions: T,
  },
  {
    key: "nobile", forms: { m: "Nobile", f: "Nobildonna", n: "Nobile" },
    precedence: 12, sovereign: false, style: "none", particles: ["dei"], traditions: T,
  },
];

export const italian: TraditionDef = {
  key: "italian",
  ladder,
  stemFlavor: "italian",
  house: "dei",
  protective0: ["Protector of the Lagoon"],
  names: {
    m: [
      "Cosimo", "Ludovico", "Galeazzo", "Ottaviano", "Ercole", "Sigismondo",
      "Pandolfo", "Astorre", "Bonifazio", "Tancredi", "Uguccione", "Malatesta",
      "Guidobaldo", "Ridolfo", "Cangrande", "Obizzo", "Azzo", "Taddeo",
      "Gherardo", "Lapo", "Neri", "Corso", "Farinata", "Brunetto",
    ],
    f: [
      "Lucrezia", "Bianca", "Ginevra", "Isotta", "Costanza", "Caterina",
      "Violante", "Fiammetta", "Sveva", "Ippolita", "Parisina", "Semiramide",
      "Selvaggia", "Contessina", "Nannina", "Alfonsina", "Diamante",
      "Smeralda", "Tessa", "Piccarda", "Gemma", "Lagia", "Cilia", "Vannozza",
    ],
  },
};
