#!/usr/bin/env node
/**
 * titulary CLI.
 *
 *   node dist/cli.js --seed 42 --ridiculous 1 --length 1
 *   node dist/cli.js -k address --gender f --tradition hre
 */
import { writeFileSync } from "node:fs";
import {
  FORMATS, KINDS, TRADITIONS, VERSION, titulary,
  type Format, type Gender, type Kind, type Tradition,
} from "./index.js";

const HELP = `titulary ${VERSION}

Usage: titulary [options]

Options:
  -s, --seed <seed>        any string or number; same seed, same peer
  -f, --format <format>    text | markdown | html | json    (default: text,
                           or by extension when --out ends in .html/.md/.json)
  -k, --kind <kind>        title | name | epithet | honours | address
                           | proclamation | blazon | motto | court
                           (default: title)
      --ridiculous <0..1>  how absurd the contents run
      --length <0..1>      one line up to the full proclamation treatment
      --antiquity <0..1>   Rt Hon. and DL up to Dei Gratia and of That Name
      --pretension <0..1>  how many titles are merely claimed
                           (each dial defaults to 0.5)
      --tradition <t>      british | hre | byzantine | iberian | italian
                           | ottoman | papal | mixed       (default: british)
      --gender <g>         m | f | n | random              (default: random)
  -n, --count <n>          persons for --kind court        (default: 8)
  -o, --out <file>         write to a file instead of stdout
  -h, --help               show this help
  -v, --version            show version

Examples:
  titulary --seed 42 --ridiculous 1 --length 1
  titulary -k proclamation --antiquity 0.9 -f html -o proclamation.html
  titulary -k court -n 12 --pretension 0.8
  titulary -k blazon --ridiculous 0.9
`;

interface Args {
  seed?: string | number;
  format?: Format;
  kind: Kind;
  count: number;
  ridiculous?: number;
  length?: number;
  antiquity?: number;
  pretension?: number;
  tradition?: Tradition;
  gender?: Gender | "random";
  out?: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { kind: "title", count: 8 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = (): string => {
      const v = argv[++i];
      if (v === undefined) fail(`missing value for ${a}`);
      return v;
    };
    switch (a) {
      case "-h": case "--help":
        process.stdout.write(HELP);
        process.exit(0);
        break;
      case "-v": case "--version":
        process.stdout.write(VERSION + "\n");
        process.exit(0);
        break;
      case "-s": case "--seed": {
        const raw = next();
        args.seed = /^-?\d+$/.test(raw) ? Number(raw) : raw;
        break;
      }
      case "-f": case "--format": {
        const f = next();
        if (!(FORMATS as readonly string[]).includes(f)) {
          fail(`unknown format "${f}" (expected ${FORMATS.join(" | ")})`);
        }
        args.format = f as Format;
        break;
      }
      case "-k": case "--kind": {
        const k = next();
        if (!(KINDS as readonly string[]).includes(k)) {
          fail(`unknown kind "${k}" (expected ${KINDS.join(" | ")})`);
        }
        args.kind = k as Kind;
        break;
      }
      case "--tradition": {
        const t = next();
        if (!(TRADITIONS as readonly string[]).includes(t)) {
          fail(`unknown tradition "${t}" (expected ${TRADITIONS.join(" | ")})`);
        }
        args.tradition = t as Tradition;
        break;
      }
      case "--gender": {
        const g = next();
        if (!["m", "f", "n", "random"].includes(g)) {
          fail(`unknown gender "${g}" (expected m | f | n | random)`);
        }
        args.gender = g as Gender | "random";
        break;
      }
      case "-n": case "--count":
        args.count = num(next(), a);
        break;
      case "--ridiculous":
        args.ridiculous = num(next(), a);
        break;
      case "--length":
        args.length = num(next(), a);
        break;
      case "--antiquity":
        args.antiquity = num(next(), a);
        break;
      case "--pretension":
        args.pretension = num(next(), a);
        break;
      case "-o": case "--out":
        args.out = next();
        break;
      default:
        fail(`unknown option "${a}" (try --help)`);
    }
  }
  return args;
}

function fail(msg: string): never {
  process.stderr.write(`titulary: ${msg}\n`);
  process.exit(1);
}

function num(raw: string, flag: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) fail(`invalid number "${raw}" for ${flag}`);
  return n;
}

function formatFromOut(out: string | undefined): Format | undefined {
  if (!out) return undefined;
  if (out.endsWith(".html")) return "html";
  if (out.endsWith(".md")) return "markdown";
  if (out.endsWith(".json")) return "json";
  return undefined;
}

const args = parseArgs(process.argv.slice(2));
const format: Format = args.format ?? formatFromOut(args.out) ?? "text";

let output = titulary({
  seed: args.seed,
  format,
  kind: args.kind,
  count: args.count,
  ridiculous: args.ridiculous,
  length: args.length,
  antiquity: args.antiquity,
  pretension: args.pretension,
  tradition: args.tradition,
  gender: args.gender,
});

if (!output.endsWith("\n")) output += "\n";
if (args.out) {
  writeFileSync(args.out, output);
  process.stderr.write(`titulary: wrote ${args.out}\n`);
} else {
  process.stdout.write(output);
}
