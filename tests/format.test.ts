import { describe, expect, it } from "vitest";
import { formatPhone } from "../src/format";

describe("formatPhone", () => {
	// ── E.164 format ────────────────────────────────────────────────
	describe("e164", () => {
		it("should format domestic to E.164", () => {
			expect(formatPhone("081234567890", "e164")).toBe("+6281234567890");
		});

		it("should format E.164 input to E.164", () => {
			expect(formatPhone("+6281234567890", "e164")).toBe("+6281234567890");
		});

		it("should format with separators to E.164", () => {
			expect(formatPhone("0812-3456-7890", "e164")).toBe("+6281234567890");
		});
	});

	// ── International format ────────────────────────────────────────
	describe("international", () => {
		it("should format to international", () => {
			expect(formatPhone("081234567890", "international")).toBe("+62 812 3456 7890");
		});

		it("should format 10-digit to international", () => {
			expect(formatPhone("0812345678", "international")).toBe("+62 812 3456 78");
		});

		it("should format 13-digit to international", () => {
			expect(formatPhone("0812345678901", "international")).toBe("+62 812 3456 7890 1");
		});
	});

	// ── Domestic format ─────────────────────────────────────────────
	describe("domestic", () => {
		it("should format to domestic", () => {
			expect(formatPhone("081234567890", "domestic")).toBe("0812-3456-7890");
		});

		it("should format E.164 to domestic", () => {
			expect(formatPhone("+6281234567890", "domestic")).toBe("0812-3456-7890");
		});

		it("should format 10-digit to domestic", () => {
			expect(formatPhone("0812345678", "domestic")).toBe("0812-3456-78");
		});
	});

	// ── Compact format ──────────────────────────────────────────────
	describe("compact", () => {
		it("should format to compact", () => {
			expect(formatPhone("081234567890", "compact")).toBe("081234567890");
		});

		it("should strip separators for compact", () => {
			expect(formatPhone("0812-3456-7890", "compact")).toBe("081234567890");
		});

		it("should normalize E.164 to compact", () => {
			expect(formatPhone("+6281234567890", "compact")).toBe("081234567890");
		});
	});

	// ── Error handling ──────────────────────────────────────────────
	describe("error handling", () => {
		it("should throw on invalid number", () => {
			expect(() => formatPhone("bukan-nomor", "e164")).toThrow();
		});

		it("should throw on too short", () => {
			expect(() => formatPhone("08123", "e164")).toThrow(
				"Panjang nomor telepon tidak valid (harus 10-13 digit)",
			);
		});

		it("should throw on non-string", () => {
			expect(() => formatPhone(123 as unknown as string, "e164")).toThrow(
				"Nomor telepon harus berupa string",
			);
		});
	});
});
