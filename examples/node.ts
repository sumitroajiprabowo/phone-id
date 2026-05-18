/**
 * Contoh penggunaan phone-id di Node.js / TypeScript.
 *
 * Mendemonstrasikan semua fitur utama:
 * - validatePhone() — validasi format nomor telepon
 * - parsePhone() — parse nomor telepon ke komponen
 * - formatPhone() — format nomor ke berbagai format
 * - generatePhone() — generate nomor untuk testing
 * - getOperator() / getPrefixesByOperator() — lookup operator
 *
 * Jalankan:
 *   npx tsx examples/node.ts
 */

import {
	formatPhone,
	generatePhone,
	getOperator,
	getPrefixesByOperator,
	parsePhone,
	validatePhone,
} from "../src";

// ============================================================
// 1. Validasi Nomor Telepon
// ============================================================
console.log("=== Validasi Nomor Telepon ===\n");

// Nomor valid
console.log("Valid (domestik):", validatePhone("081234567890"));
console.log("Valid (E.164):  ", validatePhone("+6281234567890"));
console.log("Valid (spasi):  ", validatePhone("0812 3456 7890"));
console.log("Valid (dash):   ", validatePhone("0812-3456-7890"));

// Berbagai error
const errors = [
	{ input: 12345 as unknown as string, desc: "Bukan string" },
	{ input: "", desc: "String kosong" },
	{ input: "0812ABCD5678", desc: "Mengandung huruf" },
	{ input: "0712345678", desc: "Bukan prefix 08" },
	{ input: "0801234567", desc: "Digit 080 (tidak valid)" },
	{ input: "081234567", desc: "Terlalu pendek" },
];

for (const { input, desc } of errors) {
	const result = validatePhone(input);
	if (!result.valid) {
		console.log(`${desc}: "${result.error}"`);
	}
}

// ============================================================
// 2. Parse Nomor Telepon
// ============================================================
console.log("\n=== Parse Nomor Telepon ===\n");

const parsed = parsePhone("081234567890");
if (parsed.valid) {
	console.log("Nomor:       ", parsed.number);
	console.log("E.164:       ", parsed.e164);
	console.log("International:", parsed.international);
	console.log("Domestic:    ", parsed.domestic);
	console.log("Compact:     ", parsed.compact);
	console.log("Country code:", parsed.countryCode);
	console.log("Prefix:      ", parsed.prefix);
	console.log("Operator:    ", parsed.operator);
	console.log("Brand:       ", parsed.brand);
	console.log("Network:     ", parsed.networkType);
}

// Parse dari E.164
const parsedE164 = parsePhone("+6285712345678");
if (parsedE164.valid) {
	console.log("\nDari E.164:");
	console.log("  Operator:", parsedE164.operator);
	console.log("  Domestic:", parsedE164.domestic);
}

// Parse invalid
const invalidParsed = parsePhone("bukan-nomor");
if (!invalidParsed.valid) {
	console.log("\nParse invalid:", invalidParsed.error);
}

// ============================================================
// 3. Format Nomor Telepon
// ============================================================
console.log("\n=== Format Nomor Telepon ===\n");

const nomor = "081234567890";
console.log("Input:        ", nomor);
console.log("E.164:        ", formatPhone(nomor, "e164"));
console.log("International:", formatPhone(nomor, "international"));
console.log("Domestic:     ", formatPhone(nomor, "domestic"));
console.log("Compact:      ", formatPhone(nomor, "compact"));

// Format dari input yang sudah ber-separator
console.log("\nDari input ber-separator:");
console.log("  Input:  +62 812-3456-7890");
console.log("  E.164: ", formatPhone("+62 812-3456-7890", "e164"));

// ============================================================
// 4. Generate Nomor Telepon
// ============================================================
console.log("\n=== Generate Nomor Telepon ===\n");

console.log("Random:      ", generatePhone());
console.log("Telkomsel:   ", generatePhone({ operator: "Telkomsel" }));
console.log("Indosat:     ", generatePhone({ operator: "Indosat" }));
console.log("XLSMART:     ", generatePhone({ operator: "XLSMART" }));
console.log("Prefix 0812: ", generatePhone({ prefix: "0812" }));
console.log("E.164:       ", generatePhone({ format: "e164" }));
console.log("International:", generatePhone({ format: "international" }));
console.log("Domestic:    ", generatePhone({ format: "domestic" }));

// ============================================================
// 5. Operator Database
// ============================================================
console.log("\n=== Operator Database ===\n");

const op = getOperator("0812");
if (op) {
	console.log("0812 →", op.name, `(${op.brand}, ${op.type})`);
}

console.log("\nTelkomsel prefixes:", getPrefixesByOperator("Telkomsel").join(", "));
console.log("Indosat prefixes:  ", getPrefixesByOperator("Indosat").join(", "));
console.log("XLSMART prefixes:  ", getPrefixesByOperator("XLSMART").join(", "));
console.log("PSN prefixes:      ", getPrefixesByOperator("PSN").join(", "));

// ============================================================
// 6. Roundtrip: Generate → Parse → Validate
// ============================================================
console.log("\n=== Roundtrip Test ===\n");

for (let i = 0; i < 5; i++) {
	const phone = generatePhone();
	const parseResult = parsePhone(phone);
	const validateResult = validatePhone(phone);

	if (parseResult.valid && validateResult.valid) {
		const op = parseResult.operator ?? "Unknown";
		console.log(`  ${phone} → ${op} (${parseResult.prefix})`);
	}
}

// ============================================================
// 7. Batch Validation
// ============================================================
console.log("\n=== Batch Validation ===\n");

const phoneList = [
	"081234567890",
	"+6281234567890",
	"0812 3456 7890",
	"bukan-nomor",
	"0801234567",
	"081234567",
];

let validCount = 0;
let invalidCount = 0;

for (const phone of phoneList) {
	const result = validatePhone(phone);
	if (result.valid) {
		validCount++;
	} else {
		invalidCount++;
		console.log(`  ❌ ${phone}: ${result.error}`);
	}
}

console.log(`\nTotal: ${validCount} valid, ${invalidCount} invalid dari ${phoneList.length} nomor`);
