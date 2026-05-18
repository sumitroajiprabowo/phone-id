/**
 * Phone number formatting module.
 *
 * Provides {@link formatPhone} to convert an Indonesian phone number
 * into a specific display format (E.164, international, domestic, compact).
 *
 * @module format
 *
 * @example
 * ```typescript
 * import { formatPhone } from 'phone-id/format';
 *
 * formatPhone("081234567890", "e164");          // "+6281234567890"
 * formatPhone("+62 812-3456-7890", "domestic"); // "0812-3456-7890"
 * ```
 */

import { parsePhone } from "./parse";
import type { PhoneFormat } from "./types";

/**
 * Format an Indonesian phone number into the specified display format.
 *
 * Accepts any valid input format (E.164, international, domestic, bare NSN).
 * Validates the input first — throws on invalid numbers.
 *
 * @param phone - Phone number to format (accepts various input formats)
 * @param format - Target format: `"e164"`, `"international"`, `"domestic"`, or `"compact"`
 * @returns Formatted phone number string
 * @throws {Error} If the phone number is invalid
 *
 * @example
 * ```typescript
 * formatPhone("081234567890", "e164");          // "+6281234567890"
 * formatPhone("081234567890", "international"); // "+62 812 3456 7890"
 * formatPhone("081234567890", "domestic");      // "0812-3456-7890"
 * formatPhone("081234567890", "compact");       // "081234567890"
 * formatPhone("+6281234567890", "domestic");     // "0812-3456-7890"
 * ```
 *
 * @since 1.0.0
 */
export function formatPhone(phone: string, format: PhoneFormat): string {
	const result = parsePhone(phone);
	if (!result.valid) {
		throw new Error(result.error);
	}

	switch (format) {
		case "e164":
			return result.e164;
		case "international":
			return result.international;
		case "domestic":
			return result.domestic;
		case "compact":
			return result.compact;
	}
}
