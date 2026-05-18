/**
 * Type definitions for Indonesian phone number parsing, validation, formatting, and generation.
 *
 * Indonesian mobile numbers follow the pattern: 08XX-XXXX-XXXX
 * - Country code: +62
 * - Trunk prefix: 0
 * - Mobile prefix: 8 followed by 1,2,3,5,6,7,8,9 (not 0 or 4)
 * - NSN (National Significant Number): 9-12 digits (after trunk prefix)
 * - Total digits with trunk prefix: 10-13
 *
 * @module types
 */

/**
 * Mobile network operator information.
 *
 * @example
 * ```typescript
 * const op: Operator = {
 *   name: "Telkomsel",
 *   brand: "Telkomsel",
 *   type: "mobile",
 * };
 * ```
 *
 * @since 1.0.0
 */
export interface Operator {
	/** Official company name */
	name: string;
	/** Consumer-facing brand name */
	brand: string;
	/** Network type: regular mobile or satellite */
	type: "mobile" | "satellite";
}

/**
 * Phone format options for formatting output.
 *
 * | Format          | Example            |
 * |-----------------|--------------------|
 * | `e164`          | `+6281234567890`   |
 * | `international` | `+62 812 3456 7890`|
 * | `domestic`      | `0812-3456-7890`   |
 * | `compact`       | `081234567890`     |
 *
 * @since 1.0.0
 */
export type PhoneFormat = "e164" | "international" | "domestic" | "compact";

/**
 * Successfully parsed phone number with all extracted components.
 *
 * @example
 * ```typescript
 * const result = parsePhone("081234567890");
 * if (result.valid) {
 *   console.log(result.e164);     // "+6281234567890"
 *   console.log(result.operator); // "Telkomsel"
 * }
 * ```
 *
 * @since 1.0.0
 */
export interface PhoneValid {
	/** Always `true` — use for narrowing discriminated union */
	valid: true;
	/** Normalized domestic number (e.g. `"081234567890"`) */
	number: string;
	/** E.164 format (e.g. `"+6281234567890"`) */
	e164: string;
	/** International format with spaces (e.g. `"+62 812 3456 7890"`) */
	international: string;
	/** Domestic format with dashes (e.g. `"0812-3456-7890"`) */
	domestic: string;
	/** Compact format without separators (e.g. `"081234567890"`) */
	compact: string;
	/** Country calling code `"62"` */
	countryCode: string;
	/** 4-digit prefix (e.g. `"0812"`) */
	prefix: string;
	/** Operator company name (e.g. `"Telkomsel"`) or `null` if prefix not recognized */
	operator: string | null;
	/** Operator brand name (e.g. `"Telkomsel"`) or `null` if prefix not recognized */
	brand: string | null;
	/** Network type or `null` if prefix not recognized */
	networkType: "mobile" | "satellite" | null;
}

/**
 * Failed phone number parsing result with error message.
 *
 * @since 1.0.0
 */
export interface PhoneInvalid {
	/** Always `false` — use for narrowing discriminated union */
	valid: false;
	/** Error message in Indonesian describing why the phone number is invalid */
	error: string;
}

/**
 * Discriminated union of phone parsing results.
 *
 * @example
 * ```typescript
 * const result = parsePhone(input);
 * if (result.valid) {
 *   console.log(result.operator); // string | null
 * } else {
 *   console.log(result.error);    // string
 * }
 * ```
 *
 * @since 1.0.0
 */
export type PhoneResult = PhoneValid | PhoneInvalid;

/**
 * Successful validation result.
 *
 * @since 1.0.0
 */
export interface ValidationValid {
	/** Always `true` */
	valid: true;
}

/**
 * Failed validation result with error message.
 *
 * @since 1.0.0
 */
export interface ValidationInvalid {
	/** Always `false` */
	valid: false;
	/** Error message in Indonesian */
	error: string;
}

/**
 * Discriminated union of phone validation results.
 *
 * @since 1.0.0
 */
export type ValidationResult = ValidationValid | ValidationInvalid;

/**
 * Options for generating Indonesian phone numbers.
 *
 * All fields are optional — unspecified values are randomized.
 *
 * @example
 * ```typescript
 * generatePhone({ operator: "Telkomsel" });
 * generatePhone({ prefix: "0812", format: "e164" });
 * ```
 *
 * @since 1.0.0
 */
export interface GenerateOptions {
	/** Operator name to pick prefix from (e.g. `"Telkomsel"`) */
	operator?: string;
	/** Specific 4-digit prefix (e.g. `"0812"`) */
	prefix?: string;
	/** Output format (default: `"compact"`) */
	format?: PhoneFormat;
}
