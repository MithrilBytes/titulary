# titulary

Seeded generator of nonsense royal and noble styles. Produces the honorific,
name, regnal number, epithet, primary title, cascade of subsidiary titles,
hereditary offices, orders and post-nominals, divine-right formulas, motto,
and the closing "&c., &c., &c." The grammar of Debrett's with the contents
of a broom cupboard.

Live demo: https://mithrilbytes.github.io/titulary/

Sibling of [theorem-ipsum](https://github.com/MithrilBytes/theorem-ipsum).
The same seed always produces the same peer, in plain text, Markdown, HTML,
and JSON.

The principle: **the grammar is always correct; only the content is absurd.**
Forms of address agree in gender and rank, subsidiary titles descend in
precedence, post-nominals stand in the right order. At `--ridiculous 0` an
output could sit in a peerage guide unremarked; at `--ridiculous 1` it is
indistinguishable from a real entry in form only.

Not published to npm; clone and build locally.

## CLI

```bash
npm install && npm run build
node dist/cli.js                                     # one style, random seed
node dist/cli.js --seed 42 --ridiculous 1 --length 1
node dist/cli.js -k address --gender f --tradition hre
node dist/cli.js -k proclamation --antiquity 0.9 -f html -o proclamation.html
node dist/cli.js -k court -n 12 --pretension 0.8
node dist/cli.js -k blazon --ridiculous 0.9
```

| Flag | Values |
| --- | --- |
| `-s, --seed` | any string or number |
| `--ridiculous` | 0 to 1; from peerage guide to broom cupboard |
| `--length` | 0 to 1; from a single line to the full proclamation treatment |
| `--antiquity` | 0 to 1; from "The Rt Hon." and "DL" to *Dei Gratia* and "of That Name" |
| `--pretension` | 0 to 1; how many titles are titular, claimed, disputed, or in pretence |
| `--tradition` | `british`, `hre`, `byzantine`, `iberian`, `italian`, `ottoman`, `papal`, `mixed` |
| `--gender` | `m`, `f`, `n`, `random` |
| `-k, --kind` | `title`, `name`, `epithet`, `honours`, `address`, `proclamation`, `blazon`, `motto`, `court` |
| `-f, --format` | `text`, `markdown`, `html`, `json` |
| `-n, --count` | persons for `-k court` |
| `-o, --out` | output file; `.html`, `.md`, and `.json` extensions pick the format |

Each dial defaults to 0.5. A taste of the sweep:

- ridiculous 0: "The Rt Hon. the Earl of Wexcombe, DL"
- ridiculous 1: "We, Æthelburga the Insufficiently Boiled, by the Grace of
  God and the Parish Council, Empress of the Airing-Cupboard Palatinate,
  Queen of the Two Wexcombes (in pretence), ... &c., &c., &c."

## Library

```ts
import { titulary, generateTitulary, render, epithet, blazon, address } from "./dist/index.js";

const text = titulary({ seed: "cupboard-7", ridiculous: 0.9 });

const t = generateTitulary({ seed: 42, length: 1, tradition: "mixed" });
const html = render(t, "html");

epithet({ seed: 3 });                 // "the Insufficiently Boiled"
blazon({ seed: 4, ridiculous: 1 });   // "Azure, a teapot passant Or"
address({ seed: 5, gender: "f" });    // { envelope, salutation, verbal }
```

`generateTitulary` returns a plain data structure that every renderer walks;
`-f json` prints it as-is. Zero runtime dependencies.

## What holds even at ridiculous 1

- Forms of address follow the conventions Debrett's records: a duke is
  "Your Grace", a marquess is "My Lord Marquess" on paper and
  "Lord Cupboard" out loud, a laird is spoken to by the name of the place.
- Subsidiary titles descend strictly in precedence. A held title never
  outranks the primary; anything above it is marked titular, claimed, or
  in pretence, the way pretenders have always styled themselves.
- Post-nominals stand in precedence order: orders, then decorations, then
  the academic tail, then "DL".
- Regnal ordinals are valid Roman numerals, even "XLVII", even "IV½".
- Blazons obey the rule of tincture below ridiculous 0.8, and break it
  above only with the honest note "(armes à enquérir)".

## House rules

No real living people: a denylist test keeps reigning houses and current
monarchs' regnal names out of every output. Historical and defunct titles
are fair game. The absurdity comes from mundane objects and bureaucratic
over-precision, never from mocking a culture; every tradition uses its real
historical titles with the same respect, and gets the same cupboards.
Gender agreement is a hard requirement: a mismatch is a bug, not a joke.

## Development

```bash
npm test              # vitest: determinism, agreement, structure, goldens
npm run typecheck
npm run snapshots     # regenerate test/golden/ after intended changes
npm run dev           # rebuild site bundle on change; serve site/ anyhow
```

CI typechecks, tests, and builds on every push, and runs every kind and
format through the CLI on the oldest supported Node. A daily workflow
publishes the Peer of the Day as a release, seeded by the date. `pages.yml`
deploys the demo.
