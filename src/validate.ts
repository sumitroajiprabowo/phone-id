/**
 * Phone number validation module.
 *
 * Provides {@link validatePhone} for fail-fast validation of Indonesian
 * mobile phone numbers. Checks type, format, prefix, and length.
 *
 * @module validate
 *
 * @example
 * ```typescript
 * import { validatePhone } from 'phone-id/validate';
 *
 * validatePhone("081234567890");  // { valid: true }
 * validatePhone("not-a-number");  // { valid: false, error: "..." }
 * ```
 */

import type { ValidationResult } from "./types";
import { normalize, sanitize } from "./utils";

/** Digit-only pattern for post-sanitization check. */
const DIGITS_ONLY_RE = /^\d+$/;

/**
 * Valid second digit after `08` — must be 1,2,3,5,6,7,8,9 (not 0 or 4).
 * Based on Google libphonenumber Indonesia mobile pattern: `8[1-35-9]\d{7,10}`
 */
const VALID_MOBILE_SECOND_DIGIT = /^[1-35-9]$/;

/** Minimum total digits for domestic format (0 + 9-digit NSN). */
const MIN_DIGITS = 10;

/** Maximum total digits for domestic format (0 + 12-digit NSN). */
const MAX_DIGITS = 13;

/**
 * Validate an Indonesian mobile phone number.
 *
 * Performs fail-fast validation in this order:
 * 1. Input must be a string
 * 2. Input must not be empty
 * 3. After sanitization (strip separators) and normalization (to 0-prefix),
 *    must contain only digits
 * 4. Must start with `08`
 * 5. Third digit must be valid mobile digit (1,2,3,5,6,7,8,9)
 * 6. Length must be 10-13 digits
 *
 * @param phone - Phone number to validate (accepts various formats)
 * @returns Discriminated union: `{ valid: true }` or `{ valid: false, error: string }`
 *
 * @example
 * ```typescript
 * validatePhone("081234567890");      // { valid: true }
 * validatePhone("+62 812 3456 7890"); // { valid: true }
 * validatePhone("812-3456-7890");     // { valid: true }
 * validatePhone("123");               // { valid: false, error: "..." }
 * ```
 *
 * @since 1.0.0
 */
export function validatePhone(phone: string): ValidationResult {
	// 1. Type check
	if (typeof phone !== "string") {
		return { valid: false, error: "Nomor telepon harus berupa string" };
	}

	// 2. Empty check
	if (phone.trim().length === 0) {
		return { valid: false, error: "Nomor telepon tidak boleh kosong" };
	}

	// 3. Sanitize and normalize
	const sanitized = sanitize(phone);

	// Allow leading + for international format
	const toCheck = sanitized.startsWith("+") ? sanitized.slice(1) : sanitized;
	if (!DIGITS_ONLY_RE.test(toCheck)) {
		return { valid: false, error: "Nomor telepon hanya boleh berisi angka" };
	}

	const normalized = normalize(sanitized);

	// 4. Must start with 08
	if (!normalized.startsWith("08")) {
		return { valid: false, error: "Nomor telepon harus diawali 08" };
	}

	// 5. Third digit must be valid (not 0 or 4)
	const thirdDigit = normalized[2];
	if (thirdDigit === undefined || !VALID_MOBILE_SECOND_DIGIT.test(thirdDigit)) {
		return { valid: false, error: "Prefix nomor telepon tidak valid" };
	}

	// 6. Length check (10-13 digits in domestic format)
	if (normalized.length < MIN_DIGITS || normalized.length > MAX_DIGITS) {
		return { valid: false, error: "Panjang nomor telepon tidak valid (harus 10-13 digit)" };
	}

	return { valid: true };
}
