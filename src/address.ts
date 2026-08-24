/**
 * Styles and forms of address. The shapes follow the conventions
 * summarized in Debrett's Correct Form: a duke is Your Grace, a
 * marquess is My Lord Marquess on paper and Lord Wexcombe out loud,
 * a laird is spoken to by the name of the place. Meticulous correctness
 * here is the joke, so deviations are bugs.
 */
import type { Address, Gender, Person, Rank, StyleKey, Title, Tradition } from "./types.js";
import { shortTerritory } from "./territory.js";

export function possessive(gender: Gender): string {
  return gender === "m" ? "His" : gender === "f" ? "Her" : "Their";
}

/** Style epithets stacked in as antiquity climbs. */
export const PUISSANCE = [
  "Most High", "Most Mighty", "Most Puissant", "Most Excellent", "Most Noble",
] as const;

interface StyleSpec {
  kind: "possessive" | "the" | "none";
  /** Adjective phrases before the noun: ["Serene"] in "Serene Highness". */
  adjectives: readonly string[];
  noun: string;
  abbrev?: readonly string[];
  verbal: string;
}

const STYLES: Record<StyleKey, StyleSpec> = {
  "imperial-majesty": { kind: "possessive", adjectives: ["Imperial"], noun: "Majesty", verbal: "Your Imperial Majesty" },
  "majesty": { kind: "possessive", adjectives: [], noun: "Majesty", verbal: "Your Majesty" },
  "royal-highness": { kind: "possessive", adjectives: ["Royal"], noun: "Highness", verbal: "Your Royal Highness" },
  "imperial-highness": { kind: "possessive", adjectives: ["Imperial"], noun: "Highness", verbal: "Your Imperial Highness" },
  "serene-highness": { kind: "possessive", adjectives: ["Serene"], noun: "Highness", verbal: "Your Serene Highness" },
  "illustrious-highness": { kind: "possessive", adjectives: ["Illustrious"], noun: "Highness", verbal: "Your Illustrious Highness" },
  "highness": { kind: "possessive", adjectives: [], noun: "Highness", verbal: "Your Highness" },
  "serenity": { kind: "possessive", adjectives: [], noun: "Serenity", verbal: "Your Serenity" },
  "grace": { kind: "possessive", adjectives: [], noun: "Grace", verbal: "Your Grace" },
  "excellency": { kind: "possessive", adjectives: [], noun: "Excellency", verbal: "Your Excellency" },
  "most-illustrious": { kind: "the", adjectives: ["Most"], noun: "Illustrious", verbal: "" },
  "most-hon": { kind: "the", adjectives: ["Most"], noun: "Honourable", abbrev: ["Most", "Hon."], verbal: "" },
  "rt-hon": { kind: "the", adjectives: ["Right"], noun: "Honourable", abbrev: ["Rt", "Hon."], verbal: "" },
  "right-reverend": { kind: "the", adjectives: ["Right"], noun: "Reverend", abbrev: ["Rt", "Revd"], verbal: "" },
  "very-reverend": { kind: "the", adjectives: ["Very"], noun: "Reverend", abbrev: ["Very", "Revd"], verbal: "" },
  "much-honoured": { kind: "the", adjectives: ["Much"], noun: "Honoured", abbrev: ["Much", "Hon."], verbal: "" },
  "none": { kind: "none", adjectives: [], noun: "", verbal: "" },
};

/**
 * The style as ordered tokens: ["Their", "Most Serene", "Highness"].
 * Electors and their like pick up "Most" from antiquity 0.5; stacked
 * puissance epithets replace the plain adjectives entirely, as the
 * proclamation register does.
 */
export function styleTokens(
  key: StyleKey, gender: Gender, antiquity: number, stack: readonly string[] = [],
): string[] {
  const spec = STYLES[key];
  if (spec.kind === "none") return [];
  if (spec.kind === "the") {
    const abbrev = antiquity < 0.35 && spec.abbrev;
    return ["The", ...(abbrev ? spec.abbrev! : [...spec.adjectives, spec.noun])];
  }
  if (stack.length > 0) return [possessive(gender), ...stack, spec.noun];
  const adjectives =
    antiquity >= 0.5 ? spec.adjectives.map((a) => (a.startsWith("Most") ? a : `Most ${a}`)) : spec.adjectives;
  return [possessive(gender), ...adjectives.map(String), spec.noun];
}

/** Join style tokens for prose: "His Most High, Most Mighty Highness". */
export function styleText(tokens: readonly string[]): string {
  if (tokens.length === 0) return "";
  if (tokens.length <= 2) return tokens.join(" ");
  const [head, ...rest] = tokens;
  const noun = rest.pop()!;
  if (rest.length <= 1) return [head, ...rest, noun].join(" ");
  const last = rest.pop()!;
  return `${head} ${rest.join(", ")}, and ${last} ${noun}`;
}

function styleThe(key: StyleKey, antiquity: number): string {
  return styleText(styleTokens(key, "n", antiquity));
}

function rankForm(rank: Rank, gender: Gender): string {
  return rank.forms[gender];
}

function withTerritory(rank: Rank, gender: Gender, title: Title): string {
  if (rank.territorial === false || title.territory === "") return rankForm(rank, gender);
  return `${rankForm(rank, gender)} ${title.particle} ${title.territory}`;
}

const OTTOMAN_AFTER_NAME = new Set(["pasha", "bey", "agha", "effendi"]);

/**
 * The three Debrett's forms for a peer: envelope, letter salutation,
 * spoken address.
 */
export function buildAddress(
  primary: Title, gender: Gender, person: Person, antiquity: number, tradition: Tradition,
): Address {
  const rank = primary.rank;
  const spec = STYLES[rank.style];
  const short = primary.territory === "" ? rankForm(rank, gender) : shortTerritory(primary.territory);
  const given = person.given[0] ?? "";
  const house = person.house ? ` ${person.house}` : "";
  const modern = antiquity < 0.35;

  // Ottoman usage puts the dignity after the name: Selim Pasha.
  if (tradition === "ottoman" && OTTOMAN_AFTER_NAME.has(rank.key)) {
    const spoken = `${given} ${rankForm(rank, gender)}`;
    const style = spec.kind === "possessive" ? `${possessive(gender)} ${spec.noun} ` : "";
    return {
      envelope: `${style}${spoken}${primary.territory ? `, ${withTerritory(rank, gender, primary)}` : ""}`,
      salutation: `Dear ${spoken}`,
      verbal: spoken,
    };
  }

  switch (rank.key) {
    case "baronet": {
      const post = modern ? (gender === "f" ? "Btss" : "Bt") : (gender === "f" ? "Baronetess" : "Baronet");
      if (gender === "n") {
        return {
          envelope: `${given}${house}, Baronet`,
          salutation: `Dear ${given}${house}`,
          verbal: given,
        };
      }
      const sir = gender === "f" ? "Dame" : "Sir";
      return {
        envelope: `${sir} ${given}${house}, ${post}`,
        salutation: `Dear ${sir} ${given}`,
        verbal: `${sir} ${given}`,
      };
    }
    case "knight": {
      if (gender === "n") {
        return {
          envelope: `${given}${house}, Knight`,
          salutation: "Right Trusty and Well-Beloved",
          verbal: given,
        };
      }
      const sir = gender === "f" ? "Dame" : "Sir";
      return {
        envelope: `${sir} ${given}${house}`,
        salutation: `Dear ${sir} ${given}`,
        verbal: `${sir} ${given}`,
      };
    }
    case "laird":
      return {
        envelope: `${styleThe(rank.style, antiquity)} the ${withTerritory(rank, gender, primary)}`,
        salutation: `Dear ${short}`,
        verbal: short,
      };
    case "lord-of-the-manor":
      return {
        envelope: `${given}${house}, ${withTerritory(rank, gender, primary)}`,
        salutation: `Dear ${rankForm(rank, gender)}`,
        verbal: given,
      };
    case "esquire":
      return {
        envelope: `${given}${house}, ${modern ? "Esq." : "Esquire"}`,
        salutation: gender === "f" ? "Madam" : "Sir",
        verbal: given,
      };
  }

  if (spec.kind === "possessive") {
    const styled = styleText(styleTokens(rank.style, gender, antiquity));
    const envelope = `${styled} the ${withTerritory(rank, gender, primary)}`;
    let salutation: string;
    if (rank.style === "majesty" || rank.style === "imperial-majesty") {
      salutation = `May it please ${spec.verbal}`;
    } else if (rank.style === "excellency") {
      salutation = "Your Excellency";
    } else if (rank.style === "grace" && modern) {
      salutation = `Dear ${rankForm(rank, gender)}`;
    } else if (modern && gender === "m") {
      salutation = "Sir";
    } else if (modern && gender === "f") {
      salutation = "Madam";
    } else {
      salutation = `May it please ${spec.verbal}`;
    }
    return { envelope, salutation, verbal: spec.verbal };
  }

  if (spec.kind === "the") {
    const styled = styleThe(rank.style, antiquity);
    const envelope = `${styled} the ${withTerritory(rank, gender, primary)}`;
    if (rank.style === "right-reverend" || rank.style === "very-reverend") {
      const parent = gender === "f" ? "Mother" : "Father";
      return {
        envelope,
        salutation: gender === "n" ? "Right Reverend and Well-Beloved" : `Dear ${parent} ${rankForm(rank, gender)}`,
        verbal: rankForm(rank, gender),
      };
    }
    if (rank.style === "most-illustrious") {
      const don = gender === "m" ? `Don ${given}` : gender === "f" ? `Doña ${given}` : `${rankForm(rank, gender)} ${short}`;
      return { envelope, salutation: gender === "n" ? "Right Trusty and Well-Beloved" : `Dear ${don}`, verbal: don };
    }
    const lord = gender === "f" ? "Lady" : "Lord";
    const salutation =
      gender === "n"
        ? "Right Trusty and Well-Beloved Cousin"
        : modern
          ? `Dear ${lord} ${short}`
          : rank.key === "marquess"
            ? (gender === "f" ? "My Lady Marchioness" : "My Lord Marquess")
            : gender === "f" ? "My Lady" : "My Lord";
    const verbal = gender === "n" ? `${rankForm(rank, gender)} ${short}` : `${lord} ${short}`;
    return { envelope, salutation, verbal };
  }

  // Untitled styles that fall through: canons, patricians, nobili.
  const bare = withTerritory(rank, gender, primary);
  return {
    envelope: `${given}${house}, ${bare}`,
    salutation: `Dear ${rankForm(rank, gender)}${given ? ` ${given}` : ""}`,
    verbal: `${rankForm(rank, gender)} ${given}`,
  };
}
