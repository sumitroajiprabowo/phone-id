import { describe, expect, it } from "vitest";
import { normalize, sanitize } from "../src/utils";

describe("sanitize", () => {
	it("should remove spaces", () => {
		expect(sanitize("+62 812 3456 7890")).toBe("+6281234567890");
	});

	it("should remove dashes", () => {
		expect(sanitize("0812-3456-7890")).toBe("081234567890");
	});

	it("should remove dots", () => {
		expect(sanitize("0812.3456.7890")).toBe("081234567890");
	});

	it("should remove parentheses", () => {
		expect(sanitize("(0812) 3456 7890")).toBe("081234567890");
	});

	it("should remove slashes", () => {
		expect(sanitize("0812/3456/7890")).toBe("081234567890");
	});

	it("should remove mixed separators", () => {
		expect(sanitize("+62 (812) 3456-7890")).toBe("+6281234567890");
	});

	it("should handle no separators", () => {
		expect(sanitize("081234567890")).toBe("081234567890");
	});

	it("should handle empty string", () => {
		expect(sanitize("")).toBe("");
	});

	it("should remove tabs and newlines", () => {
		expect(sanitize("0812\t3456\n7890")).toBe("081234567890");
	});
});

describe("normalize", () => {
	it("should convert +62 prefix to 0", () => {
		expect(normalize("+6281234567890")).toBe("081234567890");
	});

	it("should convert 62 prefix to 0 when followed by 8", () => {
		expect(normalize("6281234567890")).toBe("081234567890");
	});

	it("should not convert 62 prefix when not followed by 8", () => {
		expect(normalize("6221234567")).toBe("6221234567");
	});

	it("should prepend 0 to bare NSN starting with 8", () => {
		expect(normalize("81234567890")).toBe("081234567890");
	});

	it("should pass through already-domestic format", () => {
		expect(normalize("081234567890")).toBe("081234567890");
	});

	it("should pass through other formats unchanged", () => {
		expect(normalize("12345")).toBe("12345");
	});

	it("should handle +62 with short number", () => {
		expect(normalize("+628")).toBe("08");
	});

	it("should handle bare 8", () => {
		expect(normalize("8")).toBe("08");
	});
});
