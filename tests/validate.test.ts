import { describe, expect, it } from "vitest";
import { validatePhone } from "../src/validate";

describe("validatePhone", () => {
	// ── Valid numbers ───────────────────────────────────────────────
	describe("valid numbers", () => {
		it("should accept domestic format 0812", () => {
			expect(validatePhone("081234567890")).toEqual({ valid: true });
		});

		it("should accept E.164 format +62", () => {
			expect(validatePhone("+6281234567890")).toEqual({ valid: true });
		});

		it("should accept international without plus", () => {
			expect(validatePhone("6281234567890")).toEqual({ valid: true });
		});

		it("should accept bare NSN", () => {
			expect(validatePhone("81234567890")).toEqual({ valid: true });
		});

		it("should accept with spaces", () => {
			expect(validatePhone("0812 3456 7890")).toEqual({ valid: true });
		});

		it("should accept with dashes", () => {
			expect(validatePhone("0812-3456-7890")).toEqual({ valid: true });
		});

		it("should accept with dots", () => {
			expect(validatePhone("0812.3456.7890")).toEqual({ valid: true });
		});

		it("should accept with parentheses", () => {
			expect(validatePhone("(0812) 34567890")).toEqual({ valid: true });
		});

		it("should accept 10-digit number (minimum)", () => {
			expect(validatePhone("0812345678")).toEqual({ valid: true });
		});

		it("should accept 13-digit number (maximum)", () => {
			expect(validatePhone("0812345678901")).toEqual({ valid: true });
		});

		it("should accept all valid second digits", () => {
			for (const d of ["1", "2", "3", "5", "6", "7", "8", "9"]) {
				expect(validatePhone(`08${d}1234567`)).toEqual({ valid: true });
			}
		});

		it("should accept Telkomsel prefix 0811", () => {
			expect(validatePhone("08111234567")).toEqual({ valid: true });
		});

		it("should accept IOH prefix 0895", () => {
			expect(validatePhone("08951234567")).toEqual({ valid: true });
		});

		it("should accept XLSMART prefix 0881", () => {
			expect(validatePhone("08811234567")).toEqual({ valid: true });
		});

		it("should accept PSN satellite prefix 0868", () => {
			expect(validatePhone("08681234567")).toEqual({ valid: true });
		});

		it("should accept +62 with spaces", () => {
			expect(validatePhone("+62 812 3456 7890")).toEqual({ valid: true });
		});
	});

	// ── Type errors ─────────────────────────────────────────────────
	describe("type errors", () => {
		it("should reject non-string input", () => {
			const result = validatePhone(12345 as unknown as string);
			expect(result).toEqual({
				valid: false,
				error: "Nomor telepon harus berupa string",
			});
		});

		it("should reject null", () => {
			const result = validatePhone(null as unknown as string);
			expect(result).toEqual({
				valid: false,
				error: "Nomor telepon harus berupa string",
			});
		});

		it("should reject undefined", () => {
			const result = validatePhone(undefined as unknown as string);
			expect(result).toEqual({
				valid: false,
				error: "Nomor telepon harus berupa string",
			});
		});
	});

	// ── Empty / whitespace ──────────────────────────────────────────
	describe("empty input", () => {
		it("should reject empty string", () => {
			expect(validatePhone("")).toEqual({
				valid: false,
				error: "Nomor telepon tidak boleh kosong",
			});
		});

		it("should reject whitespace-only string", () => {
			expect(validatePhone("   ")).toEqual({
				valid: false,
				error: "Nomor telepon tidak boleh kosong",
			});
		});

		it("should reject tab-only string", () => {
			expect(validatePhone("\t")).toEqual({
				valid: false,
				error: "Nomor telepon tidak boleh kosong",
			});
		});
	});

	// ── Non-digit characters ────────────────────────────────────────
	describe("non-digit characters", () => {
		it("should reject letters", () => {
			expect(validatePhone("0812ABCD5678")).toEqual({
				valid: false,
				error: "Nomor telepon hanya boleh berisi angka",
			});
		});

		it("should reject special characters", () => {
			expect(validatePhone("0812@3456#7890")).toEqual({
				valid: false,
				error: "Nomor telepon hanya boleh berisi angka",
			});
		});
	});

	// ── Prefix errors ───────────────────────────────────────────────
	describe("prefix errors", () => {
		it("should reject number not starting with 08", () => {
			expect(validatePhone("0712345678")).toEqual({
				valid: false,
				error: "Nomor telepon harus diawali 08",
			});
		});

		it("should reject landline number", () => {
			expect(validatePhone("02112345678")).toEqual({
				valid: false,
				error: "Nomor telepon harus diawali 08",
			});
		});

		it("should reject 080x (digit 0 after 08)", () => {
			expect(validatePhone("0801234567")).toEqual({
				valid: false,
				error: "Prefix nomor telepon tidak valid",
			});
		});

		it("should reject 084x (digit 4 after 08)", () => {
			expect(validatePhone("0841234567")).toEqual({
				valid: false,
				error: "Prefix nomor telepon tidak valid",
			});
		});
	});

	// ── Length errors ────────────────────────────────────────────────
	describe("length errors", () => {
		it("should reject too short (9 digits)", () => {
			expect(validatePhone("081234567")).toEqual({
				valid: false,
				error: "Panjang nomor telepon tidak valid (harus 10-13 digit)",
			});
		});

		it("should reject too long (14 digits)", () => {
			expect(validatePhone("08123456789012")).toEqual({
				valid: false,
				error: "Panjang nomor telepon tidak valid (harus 10-13 digit)",
			});
		});
	});
});
