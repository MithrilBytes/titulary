/**
 * Ecclesiastical princes, kept medieval. The feminine ladder is the real
 * parallel hierarchy: princess-abbesses of the Empire sat in the
 * Reichstag, and abbesses, prioresses, and canonesses ran their own
 * houses. Berchtesgaden really was ruled by a Prince-Provost, and a
 * sacristine is a real word. "Servus servorum Dei" is the genuine
 * formula.
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
    key: "prince-provost",
    forms: { m: "Prince-Provost", f: "Princess-Provost", n: "Prince-Provost" },
    precedence: 70, sovereign: true, style: "grace", particles: ["of"], traditions: T,
  },
  {
    key: "prince-abbot",
    forms: { m: "Prince-Abbot", f: "Princess-Abbess", n: "Prince-Abbot" },
    precedence: 68, sovereign: true, style: "grace", particles: ["of"], traditions: T,
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
    key: "archdeacon",
    forms: { m: "Archdeacon", f: "Archdeacon", n: "Archdeacon" },
    precedence: 35, sovereign: false, style: "very-reverend", particles: ["of"], traditions: T,
  },
  {
    key: "protonotary",
    forms: { m: "Apostolic Protonotary", f: "Apostolic Protonotary", n: "Apostolic Protonotary" },
    precedence: 30, sovereign: false, style: "very-reverend", territorial: false,
    particles: ["of"], traditions: T,
  },
  {
    key: "precentor", forms: { m: "Precentor", f: "Precentor", n: "Precentor" },
    precedence: 25, sovereign: false, style: "none", particles: ["of"], traditions: T,
  },
  {
    key: "canon", forms: { m: "Canon", f: "Canoness", n: "Canon" },
    precedence: 20, sovereign: false, style: "none", particles: ["of"], traditions: T,
  },
  {
    key: "sacristan", forms: { m: "Sacristan", f: "Sacristine", n: "Sacristan" },
    precedence: 15, sovereign: false, style: "none", particles: ["of"], traditions: T,
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
      "Willehad", "Sturm", "Wynnebald", "Emmeram", "Gallus", "Othmar",
      "Pirmin", "Fridolin", "Wolfhard", "Adalgar", "Regino", "Meinwerk",
    ],
    f: [
      "Hildegard", "Hrotsvitha", "Walburga", "Lioba", "Gertrud", "Cunegund",
      "Radegund", "Mathilde", "Herrad", "Wiborada", "Notburga", "Relindis",
      "Hathumoda", "Gerberga", "Tetta", "Bugga", "Eadburga", "Thekla",
      "Cynehild", "Berthgyth", "Irmgardis", "Adelmoda", "Riclind", "Salome",
    ],
  },
};
