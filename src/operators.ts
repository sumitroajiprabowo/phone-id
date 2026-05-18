/**
 * Indonesian mobile operator prefix database.
 *
 * Maps 4-digit prefixes (e.g. `"0812"`) to operator information.
 * Data compiled from Kemkominfo regulations and operator announcements
 * as of May 2025 (post XL-Smartfren merger into XLSMART).
 *
 * Active MNOs in Indonesia:
 * - **Telkomsel** — 9 prefixes
 * - **Indosat Ooredoo Hutchison** — 12 prefixes (post Indosat-Tri merger Jan 2022)
 * - **XLSMART** — 18 prefixes (post XL Axiata-Smartfren merger Apr 2025)
 * - **PSN (Pasifik Satelit Nusantara)** — 1 satellite prefix
 *
 * @module operators
 */

import type { Operator } from "./types";

/**
 * Complete map of active Indonesian mobile prefixes to their operators.
 *
 * Key: 4-digit prefix with leading zero (e.g. `"0812"`)
 * Value: {@link Operator} with name, brand, and type
 *
 * @since 1.0.0
 */
export const OPERATOR_MAP: ReadonlyMap<string, Operator> = new Map<string, Operator>([
	// ── Telkomsel (9 prefixes) ──────────────────────────────────────────
	["0811", { name: "Telkomsel", brand: "Telkomsel", type: "mobile" }],
	["0812", { name: "Telkomsel", brand: "Telkomsel", type: "mobile" }],
	["0813", { name: "Telkomsel", brand: "Telkomsel", type: "mobile" }],
	["0821", { name: "Telkomsel", brand: "Telkomsel", type: "mobile" }],
	["0822", { name: "Telkomsel", brand: "Telkomsel", type: "mobile" }],
	["0823", { name: "Telkomsel", brand: "Telkomsel", type: "mobile" }],
	["0851", { name: "Telkomsel", brand: "Telkomsel", type: "mobile" }],
	["0852", { name: "Telkomsel", brand: "Telkomsel", type: "mobile" }],
	["0853", { name: "Telkomsel", brand: "Telkomsel", type: "mobile" }],

	// ── Indosat Ooredoo Hutchison (12 prefixes) ─────────────────────────
	["0814", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],
	["0815", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],
	["0816", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],
	["0855", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],
	["0856", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],
	["0857", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],
	["0858", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],
	["0895", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],
	["0896", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],
	["0897", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],
	["0898", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],
	["0899", { name: "Indosat Ooredoo Hutchison", brand: "Indosat", type: "mobile" }],

	// ── XLSMART (18 prefixes) ───────────────────────────────────────────
	["0817", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0818", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0819", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0831", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0832", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0833", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0838", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0859", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0877", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0878", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0879", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0881", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0882", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0883", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0884", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0885", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0886", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0887", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0888", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],
	["0889", { name: "XLSMART", brand: "XLSMART", type: "mobile" }],

	// ── PSN / Pasifik Satelit Nusantara (1 prefix) ──────────────────────
	["0868", { name: "Pasifik Satelit Nusantara", brand: "PSN", type: "satellite" }],
]);

/**
 * Look up operator information by 4-digit prefix.
 *
 * @param prefix - 4-digit prefix with leading zero (e.g. `"0812"`)
 * @returns Operator info or `undefined` if prefix is not recognized
 *
 * @example
 * ```typescript
 * getOperator("0812"); // { name: "Telkomsel", brand: "Telkomsel", type: "mobile" }
 * getOperator("0999"); // undefined
 * ```
 *
 * @since 1.0.0
 */
export function getOperator(prefix: string): Operator | undefined {
	return OPERATOR_MAP.get(prefix);
}

/**
 * Get all registered prefixes and their operators.
 *
 * @returns Array of `[prefix, operator]` tuples
 *
 * @example
 * ```typescript
 * const all = getOperators();
 * // [["0811", { name: "Telkomsel", ... }], ["0812", ...], ...]
 * ```
 *
 * @since 1.0.0
 */
export function getOperators(): ReadonlyArray<readonly [string, Operator]> {
	return [...OPERATOR_MAP.entries()];
}

/**
 * Get all prefixes belonging to a specific operator.
 *
 * @param operatorName - Operator name (case-insensitive)
 * @returns Array of 4-digit prefixes
 *
 * @example
 * ```typescript
 * getPrefixesByOperator("Telkomsel");
 * // ["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"]
 * ```
 *
 * @since 1.0.0
 */
export function getPrefixesByOperator(operatorName: string): string[] {
	const lower = operatorName.toLowerCase();
	const prefixes: string[] = [];
	for (const [prefix, op] of OPERATOR_MAP) {
		if (op.name.toLowerCase() === lower || op.brand.toLowerCase() === lower) {
			prefixes.push(prefix);
		}
	}
	return prefixes;
}
