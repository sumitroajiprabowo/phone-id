/**
 * phone-id — Parser, validator, formatter, dan generator nomor telepon Indonesia.
 *
 * TypeScript-first, zero dependencies, 100% test coverage, dual ESM+CJS, tree-shakeable.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { validatePhone, parsePhone, formatPhone, generatePhone } from 'phone-id';
 *
 * validatePhone("081234567890");              // { valid: true }
 * parsePhone("081234567890");                 // { valid: true, operator: "Telkomsel", ... }
 * formatPhone("081234567890", "e164");        // "+6281234567890"
 * generatePhone({ operator: "Telkomsel" });   // "0812xxxxxxxx"
 * ```
 */

export { formatPhone } from "./format";
export { generatePhone } from "./generate";
export { getOperator, getOperators, getPrefixesByOperator, OPERATOR_MAP } from "./operators";
export { parsePhone } from "./parse";
export type {
	GenerateOptions,
	Operator,
	PhoneFormat,
	PhoneInvalid,
	PhoneResult,
	PhoneValid,
	ValidationInvalid,
	ValidationResult,
	ValidationValid,
} from "./types";
export { validatePhone } from "./validate";
