/**
 * Ecclesiastical princes, kept medieval. The feminine ladder is the real
 * parallel hierarchy: princess-abbesses of the Empire sat in the
 * Reichstag, and abbesses, prioresses, and canonesses ran their own
 * houses. "Servus servorum Dei" is the genuine formula.
 */
import type { Rank } from "../types.js";
import type { TraditionDef } from "./index.js";

const T = ["papal"] as const;

const ladder: readonly Rank[] = [
  {
    key: "prince-bishop",
    forms: { m: "Prince-Bishop", f: "Princess-Abbess", n: "Prince-Bishop" },
    precedence: 72, sovereign: true, style: "grace", particles: ["of"], traditions: T,
  },
  {
    key: "abbot", forms: { m: "Abbot", f: "Abbess", n: "Abbot" },
    precedence: 50, sovereign: false, style: "right-reverend", particles: ["of"], traditions: T,
  },
  {
    key: "abbot-commendatory",
    forms: { m: "Abbot Commendatory", f: "Abbess Commendatory", n: "Abbot Commendatory" },
    precedence: 45, sovereign: false, style: "very-reverend", particles: ["of"], traditions: T,
  },
  {
    key: "prior", forms: { m: "Prior", f: "Prioress", n: "Prior" },
    precedence: 40, sovereign: false, style: "very-reverend", particles: ["of"], traditions: T,
  },
  {
    key: "protonotary",
    forms: { m: "Apostolic Protonotary", f: "Apostolic Protonotary", n: "Apostolic Protonotary" },
    precedence: 30, sovereign: false, style: "very-reverend", territorial: false,
    particles: ["of"], traditions: T,
  },
  {
    key: "canon", forms: { m: "Canon", f: "Canoness", n: "Canon" },
    precedence: 20, sovereign: false, style: "none", particles: ["of"], traditions: T,
  },
];

export const papal: TraditionDef = {
  key: "papal",
  ladder,
  stemFlavor: "german",
  house: "of",
  formulas0: [{ en: "Servant of the Servants of God", la: "Servus servorum Dei" }],
  names: {
    m: [
      "Odo", "Anselm", "Adalbert", "Ansgar", "Columbanus", "Notker",
      "Rabanus", "Ludger", "Wolbodo", "Poppo", "Burchard", "Hincmar",
    ],
    f: [
      "Hildegard", "Hrotsvitha", "Walburga", "Lioba", "Gertrud", "Cunegund",
      "Radegund", "Mathilde", "Herrad", "Wiborada", "Notburga", "Relindis",
    ],
  },
};
