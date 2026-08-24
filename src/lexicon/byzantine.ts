/**
 * Byzantium. The feminine forms are the attested ones: Basilissa,
 * Despoina, Sebastokratorissa, Kaisarissa. Court dignities carry no
 * fief, so most rows are non-territorial; Logothetes head departments,
 * which is exactly where the cupboards go.
 */
import type { Rank } from "../types.js";
import type { TraditionDef } from "./index.js";

const T = ["byzantine"] as const;

const ladder: readonly Rank[] = [
  {
    key: "basileus", forms: { m: "Basileus", f: "Basilissa", n: "Basileus" },
    precedence: 100, sovereign: true, style: "imperial-majesty", particles: ["of"], traditions: T,
  },
  {
    key: "despot", forms: { m: "Despot", f: "Despoina", n: "Despot" },
    precedence: 85, sovereign: false, style: "highness", particles: ["of"], traditions: T,
  },
  {
    key: "sebastokrator",
    forms: { m: "Sebastokrator", f: "Sebastokratorissa", n: "Sebastokrator" },
    precedence: 82, sovereign: false, style: "highness", territorial: false,
    particles: ["of"], traditions: T,
  },
  {
    key: "caesar", forms: { m: "Caesar", f: "Kaisarissa", n: "Caesar" },
    precedence: 81, sovereign: false, style: "highness", territorial: false,
    particles: ["of"], traditions: T,
  },
  {
    key: "panhypersebastos",
    forms: { m: "Panhypersebastos", f: "Panhypersebaste", n: "Panhypersebastos" },
    precedence: 61, sovereign: false, style: "excellency", territorial: false,
    particles: ["of"], traditions: T,
  },
  {
    key: "megas-doux", forms: { m: "Megas Doux", f: "Megas Doux", n: "Megas Doux" },
    precedence: 55, sovereign: false, style: "excellency", territorial: false,
    particles: ["of"], traditions: T,
  },
  {
    key: "protovestiarios",
    forms: { m: "Protovestiarios", f: "Protovestiaria", n: "Protovestiarios" },
    precedence: 40, sovereign: false, style: "excellency", territorial: false,
    particles: ["of"], traditions: T,
  },
  {
    key: "logothete", forms: { m: "Logothete", f: "Logothetissa", n: "Logothete" },
    precedence: 35, sovereign: false, style: "excellency", particles: ["of"], traditions: T,
  },
  {
    key: "patrikios", forms: { m: "Patrikios", f: "Patrikia", n: "Patrikios" },
    precedence: 20, sovereign: false, style: "none", territorial: false,
    particles: ["of"], traditions: T,
  },
];

export const byzantine: TraditionDef = {
  key: "byzantine",
  ladder,
  stemFlavor: "greek",
  house: "of",
  protective0: ["Born in the Purple"],
  names: {
    m: [
      "Alexios", "Konstantinos", "Nikephoros", "Andronikos", "Theodoros",
      "Basileios", "Ioannes", "Isaakios", "Romanos", "Michael-Palaiologos",
      "Staurakios", "Leontios",
    ],
    f: [
      "Theophano", "Anna", "Irene", "Zoe", "Theodora", "Eudokia",
      "Pulcheria", "Euphrosyne", "Kassia", "Prokopia", "Martina", "Verina",
    ],
  },
};
