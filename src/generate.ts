/**
 * Phone number generator module.
 *
 * Provides {@link generatePhone} to create valid Indonesian phone numbers
 * for testing, seeding, or demo purposes.
 *
 * Generated numbers are structurally valid but are NOT real phone numbers.
 *
 * @module generate
 *
 * @example
 * ```typescript
 * import { generatePhone } from 'phone-id/generate';
 *
 * generatePhone();                              // "081234567890" (random)
 * generatePhone({ operator: "Telkomsel" });     // "0812xxxxxxxx"
 * generatePhone({ prefix: "0812", format: "e164" }); // "+6281234567890"
 * ```
 */

import { getPrefixesByOperator, OPERATOR_MAP } from "./operators";
import type { GenerateOptions, PhoneFormat } from "./types";

/**
 * All registered prefixes, cached as array for random selection.
 */
const ALL_PREFIXES: string[] = [...OPERATOR_MAP.keys()];

/** Minimum subscriber number digits (after 4-digit prefix). */
const MIN_SUBSCRIBER_DIGITS = 6;

/** Maximum subscriber number digits (after 4-digit prefix). */
const MAX_SUBSCRIBER_DIGITS = 9;

/**
 * Generate a random integer in the inclusive range [min, max].
 */
function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random element from a non-empty array.
 * Caller must ensure the array is non-empty.
 */
function pickRandom(arr: string[]): string {
	return arr[randomInt(0, arr.length - 1)] as string;
}

/**
 * Format a domestic phone number into the requested output format.
 */
function applyFormat(domestic: string, format: PhoneFormat): string {
	const nsn = domestic.slice(1);
	switch (format) {
		case "e164":
			return `+62${nsn}`;
		case "international": {
			const prefix3 = nsn.slice(0, 3);
			const rest = nsn.slice(3);
			const chunks: string[] = [];
			for (let i = 0; i < rest.length; i += 4) {
				chunks.push(rest.slice(i, i + 4));
			}
			return `+62 ${prefix3} ${chunks.join(" ")}`;
		}
		case "domestic": {
			const prefix = domestic.slice(0, 4);
			const rest = domestic.slice(4);
			const chunks: string[] = [];
			for (let i = 0; i < rest.length; i += 4) {
				chunks.push(rest.slice(i, i + 4));
			}
			return `${prefix}-${chunks.join("-")}`;
		}
		case "compact":
			return domestic;
	}
}

/**
 * Generate a valid Indonesian phone number for testing purposes.
 *
 * All parameters are optional — unspecified values are randomized:
 * - Prefix: random from all registered prefixes
 * - Subscriber digits: random 6-9 digits (total 10-13 digits)
 * - Format: `"compact"` by default
 *
 * @param options - Generation options
 * @returns Phone number string in the requested format
 * @throws {Error} If `operator` is not recognized
 * @throws {Error} If `prefix` is not in the operator database
 * @throws {Error} If `prefix` conflicts with `operator`
 *
 * @example
 * ```typescript
 * // Full random
 * generatePhone();
 * // "081234567890"
 *
 * // Specific operator
 * generatePhone({ operator: "Telkomsel" });
 * // "0812xxxxxxxx"
 *
 * // Specific prefix and format
 * generatePhone({ prefix: "0812", format: "e164" });
 * // "+62812xxxxxxx"
 *
 * // Operator + format
 * generatePhone({ operator: "Indosat", format: "international" });
 * // "+62 815 xxxx xxxx"
 * ```
 *
 * @since 1.0.0
 */
export function generatePhone(options: GenerateOptions = {}): string {
	const { operator, prefix: prefixOpt, format = "compact" } = options;

	let selectedPrefix: string;

	if (prefixOpt !== undefined) {
		// Validate prefix exists in database
		if (!OPERATOR_MAP.has(prefixOpt)) {
			throw new Error(`Prefix "${prefixOpt}" tidak terdaftar`);
		}

		// If operator is also specified, verify consistency
		if (operator !== undefined) {
			const opPrefixes = getPrefixesByOperator(operator);
			if (opPrefixes.length === 0) {
				throw new Error(`Operator "${operator}" tidak ditemukan`);
			}
			if (!opPrefixes.includes(prefixOpt)) {
				throw new Error(`Prefix "${prefixOpt}" tidak sesuai dengan operator "${operator}"`);
			}
		}

		selectedPrefix = prefixOpt;
	} else if (operator !== undefined) {
		// Pick random prefix from operator
		const opPrefixes = getPrefixesByOperator(operator);
		if (opPrefixes.length === 0) {
			throw new Error(`Operator "${operator}" tidak ditemukan`);
		}
		selectedPrefix = pickRandom(opPrefixes);
	} else {
		// Full random
		selectedPrefix = pickRandom(ALL_PREFIXES);
	}

	// Generate random subscriber digits (6-9 digits after prefix)
	const subLength = randomInt(MIN_SUBSCRIBER_DIGITS, MAX_SUBSCRIBER_DIGITS);
	let subscriber = "";
	for (let i = 0; i < subLength; i++) {
		subscriber += String(randomInt(0, 9));
	}

	const domestic = selectedPrefix + subscriber;

	return applyFormat(domestic, format);
}
