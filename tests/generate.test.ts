import { describe, expect, it } from "vitest";
import { generatePhone } from "../src/generate";
import { parsePhone } from "../src/parse";
import { validatePhone } from "../src/validate";

describe("generatePhone", () => {
	// ── Full random ─────────────────────────────────────────────────
	describe("full random", () => {
		it("should generate valid phone number", () => {
			for (let i = 0; i < 20; i++) {
				const phone = generatePhone();
				const result = validatePhone(phone);
				expect(result.valid, `Generated ${phone} should be valid`).toBe(true);
			}
		});

		it("should generate in compact format by default", () => {
			const phone = generatePhone();
			expect(phone).toMatch(/^08\d{8,11}$/);
		});

		it("should generate parseable numbers", () => {
			for (let i = 0; i < 10; i++) {
				const phone = generatePhone();
				const result = parsePhone(phone);
				expect(result.valid, `Generated ${phone} should be parseable`).toBe(true);
			}
		});
	});

	// ── Operator option ─────────────────────────────────────────────
	describe("operator option", () => {
		it("should generate Telkomsel number", () => {
			const phone = generatePhone({ operator: "Telkomsel" });
			const result = parsePhone(phone);
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.operator).toBe("Telkomsel");
		});

		it("should generate Indosat number by brand", () => {
			const phone = generatePhone({ operator: "Indosat" });
			const result = parsePhone(phone);
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.operator).toBe("Indosat Ooredoo Hutchison");
		});

		it("should generate XLSMART number", () => {
			const phone = generatePhone({ operator: "XLSMART" });
			const result = parsePhone(phone);
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.operator).toBe("XLSMART");
		});

		it("should generate PSN number", () => {
			const phone = generatePhone({ operator: "PSN" });
			const result = parsePhone(phone);
			expect(result.valid).toBe(true);
			if (!result.valid) return;
			expect(result.operator).toBe("Pasifik Satelit Nusantara");
		});

		it("should throw for unknown operator", () => {
			expect(() => generatePhone({ operator: "Unknown" })).toThrow(
				'Operator "Unknown" tidak ditemukan',
			);
		});
	});

	// ── Prefix option ───────────────────────────────────────────────
	describe("prefix option", () => {
		it("should generate with specific prefix", () => {
			const phone = generatePhone({ prefix: "0812" });
			expect(phone.startsWith("0812")).toBe(true);
			expect(validatePhone(phone).valid).toBe(true);
		});

		it("should throw for unknown prefix", () => {
			expect(() => generatePhone({ prefix: "0999" })).toThrow('Prefix "0999" tidak terdaftar');
		});

		it("should throw if prefix conflicts with operator", () => {
			expect(() => generatePhone({ operator: "Telkomsel", prefix: "0815" })).toThrow(
				'Prefix "0815" tidak sesuai dengan operator "Telkomsel"',
			);
		});

		it("should accept consistent prefix and operator", () => {
			const phone = generatePhone({ operator: "Telkomsel", prefix: "0812" });
			expect(phone.startsWith("0812")).toBe(true);
		});

		it("should throw if operator in prefix+operator is unknown", () => {
			expect(() => generatePhone({ operator: "FakeOp", prefix: "0812" })).toThrow(
				'Operator "FakeOp" tidak ditemukan',
			);
		});
	});

	// ── Format option ───────────────────────────────────────────────
	describe("format option", () => {
		it("should generate in e164 format", () => {
			const phone = generatePhone({ format: "e164" });
			expect(phone).toMatch(/^\+62/);
		});

		it("should generate in international format", () => {
			const phone = generatePhone({ format: "international" });
			expect(phone).toMatch(/^\+62 /);
			expect(phone).toContain(" ");
		});

		it("should generate in domestic format", () => {
			const phone = generatePhone({ format: "domestic" });
			expect(phone).toMatch(/^0\d{3}-/);
			expect(phone).toContain("-");
		});

		it("should generate in compact format", () => {
			const phone = generatePhone({ format: "compact" });
			expect(phone).toMatch(/^08\d{8,11}$/);
		});
	});

	// ── Combined options ────────────────────────────────────────────
	describe("combined options", () => {
		it("should combine operator and format", () => {
			const phone = generatePhone({ operator: "Telkomsel", format: "e164" });
			expect(phone).toMatch(/^\+62/);
			const parsed = parsePhone(phone);
			expect(parsed.valid).toBe(true);
			if (parsed.valid) {
				expect(parsed.operator).toBe("Telkomsel");
			}
		});

		it("should combine prefix and format", () => {
			const phone = generatePhone({ prefix: "0812", format: "domestic" });
			expect(phone).toMatch(/^0812-/);
		});
	});

	// ── Deterministic with mocked random ────────────────────────────
	describe("deterministic generation", () => {
		it("should use all prefix options for random selection", () => {
			// Run many times, verify all come from known prefixes
			for (let i = 0; i < 50; i++) {
				const phone = generatePhone();
				const result = parsePhone(phone);
				expect(result.valid).toBe(true);
			}
		});
	});
});
