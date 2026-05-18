import { describe, expect, it } from "vitest";
import { getOperator, getOperators, getPrefixesByOperator, OPERATOR_MAP } from "../src/operators";

describe("OPERATOR_MAP", () => {
	it("should contain 42 prefixes", () => {
		expect(OPERATOR_MAP.size).toBe(42);
	});

	it("should have all Telkomsel prefixes", () => {
		const telkomselPrefixes = [
			"0811",
			"0812",
			"0813",
			"0821",
			"0822",
			"0823",
			"0851",
			"0852",
			"0853",
		];
		for (const prefix of telkomselPrefixes) {
			const op = OPERATOR_MAP.get(prefix);
			expect(op).toBeDefined();
			expect(op?.name).toBe("Telkomsel");
			expect(op?.brand).toBe("Telkomsel");
			expect(op?.type).toBe("mobile");
		}
	});

	it("should have all Indosat Ooredoo Hutchison prefixes", () => {
		const iohPrefixes = [
			"0814",
			"0815",
			"0816",
			"0855",
			"0856",
			"0857",
			"0858",
			"0895",
			"0896",
			"0897",
			"0898",
			"0899",
		];
		for (const prefix of iohPrefixes) {
			const op = OPERATOR_MAP.get(prefix);
			expect(op).toBeDefined();
			expect(op?.name).toBe("Indosat Ooredoo Hutchison");
			expect(op?.brand).toBe("Indosat");
			expect(op?.type).toBe("mobile");
		}
	});

	it("should have all XLSMART prefixes", () => {
		const xlsmartPrefixes = [
			"0817",
			"0818",
			"0819",
			"0831",
			"0832",
			"0833",
			"0838",
			"0859",
			"0877",
			"0878",
			"0879",
			"0881",
			"0882",
			"0883",
			"0884",
			"0885",
			"0886",
			"0887",
			"0888",
			"0889",
		];
		for (const prefix of xlsmartPrefixes) {
			const op = OPERATOR_MAP.get(prefix);
			expect(op).toBeDefined();
			expect(op?.name).toBe("XLSMART");
			expect(op?.brand).toBe("XLSMART");
			expect(op?.type).toBe("mobile");
		}
	});

	it("should have PSN satellite prefix", () => {
		const op = OPERATOR_MAP.get("0868");
		expect(op).toBeDefined();
		expect(op?.name).toBe("Pasifik Satelit Nusantara");
		expect(op?.brand).toBe("PSN");
		expect(op?.type).toBe("satellite");
	});
});

describe("getOperator", () => {
	it("should return operator for known prefix", () => {
		const op = getOperator("0812");
		expect(op).toEqual({
			name: "Telkomsel",
			brand: "Telkomsel",
			type: "mobile",
		});
	});

	it("should return undefined for unknown prefix", () => {
		expect(getOperator("0999")).toBeUndefined();
		expect(getOperator("0800")).toBeUndefined();
		expect(getOperator("")).toBeUndefined();
	});
});

describe("getOperators", () => {
	it("should return all entries", () => {
		const entries = getOperators();
		expect(entries.length).toBe(42);
	});

	it("should return [prefix, operator] tuples", () => {
		const entries = getOperators();
		for (const [prefix, op] of entries) {
			expect(prefix).toMatch(/^08\d{2}$/);
			expect(op.name).toBeTruthy();
			expect(op.brand).toBeTruthy();
			expect(["mobile", "satellite"]).toContain(op.type);
		}
	});
});

describe("getPrefixesByOperator", () => {
	it("should return Telkomsel prefixes by name", () => {
		const prefixes = getPrefixesByOperator("Telkomsel");
		expect(prefixes).toEqual([
			"0811",
			"0812",
			"0813",
			"0821",
			"0822",
			"0823",
			"0851",
			"0852",
			"0853",
		]);
	});

	it("should return IOH prefixes by name", () => {
		const prefixes = getPrefixesByOperator("Indosat Ooredoo Hutchison");
		expect(prefixes).toHaveLength(12);
	});

	it("should return IOH prefixes by brand", () => {
		const prefixes = getPrefixesByOperator("Indosat");
		expect(prefixes).toHaveLength(12);
	});

	it("should return XLSMART prefixes", () => {
		const prefixes = getPrefixesByOperator("XLSMART");
		expect(prefixes).toHaveLength(20);
	});

	it("should be case-insensitive", () => {
		expect(getPrefixesByOperator("telkomsel")).toHaveLength(9);
		expect(getPrefixesByOperator("TELKOMSEL")).toHaveLength(9);
		expect(getPrefixesByOperator("indosat")).toHaveLength(12);
		expect(getPrefixesByOperator("xlsmart")).toHaveLength(20);
	});

	it("should return empty array for unknown operator", () => {
		expect(getPrefixesByOperator("Unknown")).toEqual([]);
		expect(getPrefixesByOperator("")).toEqual([]);
	});

	it("should return PSN prefix", () => {
		const prefixes = getPrefixesByOperator("PSN");
		expect(prefixes).toEqual(["0868"]);
	});
});
