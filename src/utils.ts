/**
 * Internal utility functions for phone number sanitization and normalization.
 *
 * These are not part of the public API — used internally by validate, parse,
 * format, and generate modules.
 *
 * @module utils
 * @internal
 */

/**
 * Characters treated as visual separators in phone number input.
 * Matches: space, dash, dot, open paren, close paren.
 */
const SEPARATOR_RE = /[\s\-.()/]/g;

/**
 * Strip all visual separators from a phone number string.
 *
 * Removes spaces, dashes, dots, and parentheses — characters commonly
 * used for visual formatting in phone number display.
 *
 * @param input - Raw phone number string
 * @returns Phone number with separators removed
 *
 * @example
 * ```typescript
 * sanitize("+62 812-3456-7890"); // "+6281234567890"
 * sanitize("0812.3456.7890");    // "081234567890"
 * sanitize("(0812) 3456 7890");  // "081234567890"
 * ```
 */
export function sanitize(input: string): string {
	return input.replace(SEPARATOR_RE, "");
}

/**
 * Normalize a sanitized phone number to domestic format (0-prefixed).
 *
 * Handles these input formats:
 * - `+62xxx` → `0xxx` (E.164 / international with plus)
 * - `62xxx`  → `0xxx` (international without plus, only when followed by 8)
 * - `8xxx`   → `08xxx` (bare NSN without trunk prefix)
 * - `08xxx`  → `08xxx` (already domestic, pass through)
 *
 * @param sanitized - Phone number with separators already removed
 * @returns Normalized domestic format string, or the original if no pattern matches
 *
 * @example
 * ```typescript
 * normalize("+6281234567890"); // "081234567890"
 * normalize("6281234567890");  // "081234567890"
 * normalize("81234567890");    // "081234567890"
 * normalize("081234567890");   // "081234567890"
 * ```
 */
export function normalize(sanitized: string): string {
	// +62xxx → 0xxx
	if (sanitized.startsWith("+62")) {
		return `0${sanitized.slice(3)}`;
	}

	// 62xxx → 0xxx (only when next digit is 8, to avoid false positives)
	if (sanitized.startsWith("62") && sanitized[2] === "8") {
		return `0${sanitized.slice(2)}`;
	}

	// 8xxx → 08xxx (bare NSN)
	if (sanitized.startsWith("8")) {
		return `0${sanitized}`;
	}

	// Already 0-prefixed or unknown format — return as-is
	return sanitized;
}
