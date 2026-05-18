/**
 * Phone number parsing module.
 *
 * Provides {@link parsePhone} to extract all components from an Indonesian
 * phone number: normalized forms, operator info, prefix, and formatting variants.
 *
 * @module parse
 *
 * @example
 * ```typescript
 * import { parsePhone } from 'phone-id/parse';
 *
 * const result = parsePhone("081234567890");
 * if (result.valid) {
 *   console.log(result.operator); // "Telkomsel"
 *   console.log(result.e164);     // "+6281234567890"
 * }
 * ```
 */

import { getOperator } from "./operators";
import type { PhoneResult } from "./types";
import { normalize, sanitize } from "./utils";
import { validatePhone } from "./validate";

/**
 * Format a domestic phone number into international format with spaces.
 *
 * Groups digits as: +62 XXX XXXX XXXX (for 12 digits)
 * Adapts grouping based on subscriber number length.
 *
 * @param domestic - Normalized domestic number (e.g. `"081234567890"`)
 * @returns International format string
 */
function toInternational(domestic: string): string {
	const nsn = domestic.slice(1); // remove leading 0
	const prefix3 = nsn.slice(0, 3); // e.g. "812"
	const rest = nsn.slice(3);

	// Group rest into chunks of 4
	const chunks: string[] = [];
	for (let i = 0; i < rest.length; i += 4) {
		chunks.push(rest.slice(i, i + 4));
	}

	return `+62 ${prefix3} ${chunks.join(" ")}`;
}

/**
 * Format a domestic phone number with dashes.
 *
 * Groups as: 0XXX-XXXX-XXXX (for 12 digits)
 *
 * @param domestic - Normalized domestic number (e.g. `"081234567890"`)
 * @returns Domestic format with dashes
 */
function toDomestic(domestic: string): string {
	const prefix = domestic.slice(0, 4); // e.g. "0812"
	const rest = domestic.slice(4);

	const chunks: string[] = [];
	for (let i = 0; i < rest.length; i += 4) {
		chunks.push(rest.slice(i, i + 4));
	}

	return `${prefix}-${chunks.join("-")}`;
}

/**
 * Parse an Indonesian phone number into its components.
 *
 * Validates the input first — if invalid, returns error immediately.
 * On success, returns all formatting variants and operator information.
 *
 * @param phone - Phone number to parse (accepts various formats)
 * @returns Discriminated union: {@link PhoneValid} or {@link PhoneInvalid}
 *
 * @example
 * ```typescript
 * const result = parsePhone("+62 812-3456-7890");
 * if (result.valid) {
 *   console.log(result.number);      // "081234567890"
 *   console.log(result.e164);        // "+6281234567890"
 *   console.log(result.international); // "+62 812 3456 7890"
 *   console.log(result.domestic);    // "0812-3456-7890"
 *   console.log(result.compact);     // "081234567890"
 *   console.log(result.countryCode); // "62"
 *   console.log(result.prefix);      // "0812"
 *   console.log(result.operator);    // "Telkomsel"
 *   console.log(result.brand);       // "Telkomsel"
 *   console.log(result.networkType); // "mobile"
 * }
 * ```
 *
 * @since 1.0.0
 */
export function parsePhone(phone: string): PhoneResult {
	const validation = validatePhone(phone);
	if (!validation.valid) {
		return { valid: false, error: validation.error };
	}

	const sanitized = sanitize(phone);
	const domestic = normalize(sanitized);

	// Extract 4-digit prefix (e.g. "0812")
	const prefix = domestic.slice(0, 4);

	// Look up operator
	const op = getOperator(prefix);

	// NSN (without trunk prefix 0)
	const nsn = domestic.slice(1);

	return {
		valid: true,
		number: domestic,
		e164: `+62${nsn}`,
		international: toInternational(domestic),
		domestic: toDomestic(domestic),
		compact: domestic,
		countryCode: "62",
		prefix,
		operator: op?.name ?? null,
		brand: op?.brand ?? null,
		networkType: op?.type ?? null,
	};
}
