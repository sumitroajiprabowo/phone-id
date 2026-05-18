import { describe, expect, it } from "vitest";
import { parsePhone } from "../src/parse";

describe("parsePhone", () => {
	// ── Valid parsing ────────────────────────────────────────────────
	describe("valid parsing", () => {
		it("should parse domestic format", () => {
			const result = parsePhone("081234567890");
			expect(result.valid).toBe(true);
			if (!result.valid) return;

			expect(result.number).toBe("081234567890");
			expect(result.e164).toBe("+6281234567890");
			expect(result.international).toBe("+62 812 3456 7890");
			expect(result.domestic).toBe("0812-3456-7890");
			expect(result.compact).toBe("081234567890");
			expect(result.countryCode).toBe("62");
			expect(result.prefix).toBe("0812");
			expect(result.operator).toBe("Telkomsel");
			expect(result.brand).toBe("Telkomsel");
			expect(result.networkType).toBe("mobile");
		});

		it("should parse E.164 format", () => {
			const result = parsePhone("+6281234567890");
			expect(result.valid).toBe(true);
			if (!result.valid) return;

			expect(result.number).toBe("081234567890");
			expect(result.e164).toBe("+6281234567890");
			expect(result.prefix).toBe("0812");
			expect(result.operator).toBe("Telkomsel");
		});

		it("should parse international without plus", () => {
			const result = parsePhone("6281234567890");
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.number).toBe("081234567890");
		});

		it("should parse bare NSN", () => {
			const result = parsePhone("81234567890");
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.number).toBe("081234567890");
		});

		it("should parse with separators", () => {
			const result = parsePhone("+62 812-3456-7890");
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.number).toBe("081234567890");
			expect(result.e164).toBe("+6281234567890");
		});

		it("should identify Indosat Ooredoo Hutchison", () => {
			const result = parsePhone("08151234567");
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.operator).toBe("Indosat Ooredoo Hutchison");
			expect(result.brand).toBe("Indosat");
			expect(result.networkType).toBe("mobile");
		});

		it("should identify XLSMART", () => {
			const result = parsePhone("08171234567");
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.operator).toBe("XLSMART");
			expect(result.brand).toBe("XLSMART");
			expect(result.networkType).toBe("mobile");
		});

		it("should identify PSN satellite", () => {
			const result = parsePhone("08681234567");
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.operator).toBe("Pasifik Satelit Nusantara");
			expect(result.brand).toBe("PSN");
			expect(result.networkType).toBe("satellite");
		});

		it("should return null operator for unrecognized prefix", () => {
			// 0861 is not in the operator map but passes validation (digit 6 is valid)
			const result = parsePhone("0861234567");
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.operator).toBeNull();
			expect(result.brand).toBeNull();
			expect(result.networkType).toBeNull();
		});

		it("should parse 10-digit number (minimum)", () => {
			const result = parsePhone("0812345678");
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.number).toBe("0812345678");
			expect(result.e164).toBe("+62812345678");
			expect(result.international).toBe("+62 812 3456 78");
			expect(result.domestic).toBe("0812-3456-78");
		});

		it("should parse 13-digit number (maximum)", () => {
			const result = parsePhone("0812345678901");
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.number).toBe("0812345678901");
			expect(result.e164).toBe("+62812345678901");
			expect(result.international).toBe("+62 812 3456 7890 1");
			expect(result.domestic).toBe("0812-3456-7890-1");
		});

		it("should parse 11-digit number", () => {
			const result = parsePhone("08123456789");
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.number).toBe("08123456789");
			expect(result.e164).toBe("+628123456789");
			expect(result.international).toBe("+62 812 3456 789");
			expect(result.domestic).toBe("0812-3456-789");
		});
	});

	// ── Invalid input ───────────────────────────────────────────────
	describe("invalid input", () => {
		it("should return error for non-string", () => {
			const result = parsePhone(123 as unknown as string);
			expect(result.valid).toBe(false);
			if (result.valid) return;
			expect(result.error).toBe("Nomor telepon harus berupa string");
		});

		it("should return error for invalid number", () => {
			const result = parsePhone("bukan-nomor");
			expect(result.valid).toBe(false);
			if (result.valid) return;
			expect(result.error).toBeTruthy();
		});

		it("should return error for too short", () => {
			const result = parsePhone("08123");
			expect(result.valid).toBe(false);
		});
	});
});
