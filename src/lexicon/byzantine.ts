/**
 * Byzantium. The feminine forms are the attested ones: Basilissa,
 * Despoina, Sebastokratorissa, Kaisarissa, Kouropalatissa. Court
 * dignities carry no fief, so most rows are non-territorial; Logothetes
 * head departments, which is exactly where the cupboards go.
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
    key: "nobilissimos",
    forms: { m: "Nobilissimos", f: "Nobilissima", n: "Nobilissimos" },
    precedence: 78, sovereign: false, style: "highness", territorial: false,
    particles: ["of"], traditions: T,
  },
  {
    key: "kouropalates",
    forms: { m: "Kouropalates", f: "Kouropalatissa", n: "Kouropalates" },
    precedence: 62, sovereign: false, style: "excellency", territorial: false,
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
    key: "protostrator",
    forms: { m: "Protostrator", f: "Protostratorissa", n: "Protostrator" },
    precedence: 54, sovereign: false, style: "excellency", territorial: false,
    particles: ["of"], traditions: T,
  },
  {
    key: "domestikos",
    forms: {
      m: "Domestikos of the Schools", f: "Domestikos of the Schools",
      n: "Domestikos of the Schools",
    },
    precedence: 50, sovereign: false, style: "excellency", territorial: false,
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
    key: "protospatharios",
    forms: { m: "Protospatharios", f: "Protospatharios", n: "Protospatharios" },
    precedence: 30, sovereign: false, style: "none", territorial: false,
    particles: ["of"], traditions: T,
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
      "Bardas", "Symbatios", "Herakleios", "Maurikios", "Bardanes",
      "Artabasdos", "Philippikos", "Anastasios", "Zenon", "Tiberios",
      "Alexandros", "Christophoros", "Stephanos",
    ],
    f: [
      "Theophano", "Anna", "Irene", "Zoe", "Theodora", "Eudokia",
      "Pulcheria", "Euphrosyne", "Kassia", "Prokopia", "Martina", "Verina",
      "Aikaterine", "Xene", "Simonis", "Anthousa", "Theokiste", "Thomais",
      "Kyra", "Danelis", "Eudoxia", "Alypia", "Ariadne", "Zenonis",
    ],
  },
};
