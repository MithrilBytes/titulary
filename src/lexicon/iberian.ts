/**
 * Iberia: grandees, infantes, and the long double-barrelled surname.
 * Grandees really are addressed as Most Excellent; marquesses down to
 * viscounts as Most Illustrious.
 */
import type { Rank } from "../types.js";
import type { TraditionDef } from "./index.js";

const T = ["iberian"] as const;

const ladder: readonly Rank[] = [
  {
    key: "king", forms: { m: "King", f: "Queen", n: "Monarch" },
    precedence: 90, sovereign: true, style: "majesty", particles: ["of"], traditions: T,
  },
  {
    key: "infante", forms: { m: "Infante", f: "Infanta", n: "Infante" },
    precedence: 80, sovereign: false, style: "royal-highness", particles: ["de"], traditions: T,
  },
  {
    key: "grandee", forms: { m: "Grandee", f: "Grandee", n: "Grandee" },
    precedence: 72, sovereign: false, style: "excellency", particles: ["of"], traditions: T,
  },
  {
    key: "duke", forms: { m: "Duke", f: "Duchess", n: "Duke" },
    precedence: 70, sovereign: false, style: "excellency", particles: ["de"], traditions: T,
  },
  {
    key: "marquess", forms: { m: "Marquess", f: "Marchioness", n: "Marquess" },
    precedence: 60, sovereign: false, style: "most-illustrious", particles: ["de"], traditions: T,
  },
  {
    key: "count", forms: { m: "Count", f: "Countess", n: "Count" },
    precedence: 50, sovereign: false, style: "most-illustrious", particles: ["de"], traditions: T,
  },
  {
    key: "viscount", forms: { m: "Viscount", f: "Viscountess", n: "Viscount" },
    precedence: 40, sovereign: false, style: "most-illustrious", particles: ["de"], traditions: T,
  },
  {
    key: "baron", forms: { m: "Baron", f: "Baroness", n: "Baron" },
    precedence: 30, sovereign: false, style: "none", particles: ["de"], traditions: T,
  },
  {
    key: "senor", forms: { m: "Señor", f: "Señora", n: "Señor" },
    precedence: 5, sovereign: false, style: "none", particles: ["de"], traditions: T,
  },
  {
    key: "hidalgo", forms: { m: "Hidalgo", f: "Hidalga", n: "Hidalgo" },
    precedence: 8, sovereign: false, style: "none", territorial: false,
    particles: ["de"], traditions: T,
  },
];

export const iberian: TraditionDef = {
  key: "iberian",
  ladder,
  stemFlavor: "iberian",
  house: "y",
  protective0: ["Defender of the Marches"],
  names: {
    m: [
      "Sancho", "Alfonso", "Ordoño", "Ramiro", "Bermudo", "García",
      "Fruela", "Nuño", "Rodrigo", "Vermudo", "Gonzalo", "Suero",
    ],
    f: [
      "Urraca", "Berenguela", "Sancha", "Elvira", "Jimena", "Teresa",
      "Constanza", "Blanca", "Aldonza", "Mencía", "Violante", "Mayor",
    ],
  },
};
