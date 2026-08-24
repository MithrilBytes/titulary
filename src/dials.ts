/**
 * Dial handling: clamping, defaults, and the tier mixture that turns the
 * ridiculous dial into vocabulary choices.
 */
import type { Rng } from "./rng.js";
import type { Dials, TitularyOptions } from "./types.js";

export const DIAL_NAMES = ["ridiculous", "length", "antiquity", "pretension"] as const;

export function clamp01(x: number | undefined, fallback = 0.5): number {
  if (x === undefined || Number.isNaN(x)) return fallback;
  return Math.min(1, Math.max(0, x));
}

export function resolveDials(opts: TitularyOptions): Dials {
  return {
    ridiculous: clamp01(opts.ridiculous),
    length: clamp01(opts.length),
    antiquity: clamp01(opts.antiquity),
    pretension: clamp01(opts.pretension),
  };
}

export type Tier = 0 | 1 | 2;

/**
 * Mixture weights for the three vocabulary tiers at ridiculousness r.
 * Tier 2 gains weight quadratically, so mid-dial output stays mostly
 * plausible with one or two things wrong, and the sweep is smooth:
 * (1 - r) + (r - r^2) + r^2 = 1.
 */
export function tierWeights(r: number): [number, number, number] {
  const t0 = 1 - r;
  const t2 = r * r;
  return [t0, Math.max(0, 1 - t0 - t2), t2];
}

/** One draw, whatever the dial, so streams stay aligned across sweeps. */
export function pickTier(rng: Rng, r: number): Tier {
  const [w0, w1, w2] = tierWeights(r);
  return rng.weighted([[0, w0], [1, w1], [2, w2]] as const) as Tier;
}

/** Pick from one of three tiered lists according to the mixture. */
export function pickTiered<T>(
  rng: Rng,
  r: number,
  lists: { t0: readonly T[]; t1: readonly T[]; t2: readonly T[] },
): { value: T; tier: Tier } {
  const tier = pickTier(rng, r);
  const list = tier === 0 ? lists.t0 : tier === 1 ? lists.t1 : lists.t2;
  return { value: rng.pick(list), tier };
}
