/**
 * JSON: the intermediate representation itself, pretty-printed.
 */
import type { Titulary } from "../types.js";

export function renderJson(t: Titulary): string {
  return JSON.stringify(t, null, 2);
}
