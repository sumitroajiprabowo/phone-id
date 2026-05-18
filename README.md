# phone-id

[![npm version](https://img.shields.io/npm/v/phone-id.svg)](https://www.npmjs.com/package/phone-id)
[![CI](https://github.com/sumitroajiprabowo/phone-id/actions/workflows/ci.yml/badge.svg)](https://github.com/sumitroajiprabowo/phone-id/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![codecov](https://codecov.io/gh/sumitroajiprabowo/phone-id/graph/badge.svg?token=PLACEHOLDER)](https://codecov.io/gh/sumitroajiprabowo/phone-id)

Parser, validator, formatter, dan generator **nomor telepon Indonesia**.

TypeScript-first, zero dependencies, 100% test coverage, dual ESM+CJS, tree-shakeable.

```bash
npm install phone-id
```

Tidak perlu database, API call, atau file eksternal. Cukup install dan langsung pakai.

## Fitur

- **Validasi format** — cek apakah nomor telepon valid (prefix, panjang, digit)
- **Parse komponen** — ekstrak operator, prefix, dan semua format dari nomor telepon
- **Format nomor** — konversi ke E.164, international, domestic, atau compact
- **Generate nomor** — buat nomor telepon valid untuk testing, seeding, atau demo
- **Database operator** — 42 prefix aktif dari 3 MNO + 1 operator satelit
- **Discriminated union** — return type aman di-narrow pakai `result.valid`
- **Error bahasa Indonesia** — semua pesan error dalam bahasa Indonesia
- **Tree-shakeable** — import hanya fungsi yang dibutuhkan
- **TypeScript-first** — strict types, auto-complete di IDE
- **Dual ESM + CJS** — support semua environment
- **Zero dependencies** — tidak ada dependency runtime
- **100% coverage** — statements, branches, functions, lines

## Struktur Nomor Telepon

Nomor telepon Indonesia mengikuti format: `08XX-XXXX-XXXX`

```
0812 3456 7890
│    └── Nomor pelanggan (6-9 digit)
└── Prefix operator (4 digit: 0 + 8 + digit valid + digit)
```

| Komponen | Keterangan |
|----------|------------|
| Country code | `+62` |
| Trunk prefix | `0` |
| Mobile indicator | `8` (setelah trunk prefix) |
| Digit ke-3 | `1,2,3,5,6,7,8,9` (bukan 0 atau 4) |
| Total digit (domestik) | 10-13 digit |

## Quick Start

```typescript
import { validatePhone, parsePhone, formatPhone, generatePhone } from 'phone-id';

// Validasi — cek apakah nomor valid
const valid = validatePhone("081234567890");
console.log(valid); // { valid: true }

// Parse — ekstrak semua komponen
const parsed = parsePhone("081234567890");
if (parsed.valid) {
  console.log(parsed.operator); // "Telkomsel"
  console.log(parsed.e164);     // "+6281234567890"
  console.log(parsed.domestic); // "0812-3456-7890"
}

// Format — konversi ke format tertentu
const e164 = formatPhone("0812-3456-7890", "e164");
console.log(e164); // "+6281234567890"

// Generate — buat nomor untuk testing
const phone = generatePhone({ operator: "Telkomsel" });
console.log(phone); // "0812xxxxxxxx"
```

## API Reference

### `validatePhone(phone: string): ValidationResult`

Validasi format nomor telepon secara bertahap (fail-fast).

```typescript
import { validatePhone } from 'phone-id';
// atau: import { validatePhone } from 'phone-id/validate';

validatePhone("081234567890");       // { valid: true }
validatePhone("+62 812-3456-7890");  // { valid: true }
validatePhone("812-3456-7890");      // { valid: true }
validatePhone("bukan-nomor");        // { valid: false, error: "..." }
```

### `parsePhone(phone: string): PhoneResult`

Parse nomor telepon menjadi komponen-komponennya.

```typescript
import { parsePhone } from 'phone-id';
// atau: import { parsePhone } from 'phone-id/parse';

const result = parsePhone("+62 812-3456-7890");
if (result.valid) {
  console.log(result.number);      // "081234567890"
  console.log(result.e164);        // "+6281234567890"
  console.log(result.international); // "+62 812 3456 7890"
  console.log(result.domestic);    // "0812-3456-7890"
  console.log(result.compact);     // "081234567890"
  console.log(result.countryCode); // "62"
  console.log(result.prefix);      // "0812"
  console.log(result.operator);    // "Telkomsel"
  console.log(result.brand);       // "Telkomsel"
  console.log(result.networkType); // "mobile"
}
```

### `formatPhone(phone: string, format: PhoneFormat): string`

Format nomor telepon ke format tertentu. Throws jika nomor tidak valid.

```typescript
import { formatPhone } from 'phone-id';
// atau: import { formatPhone } from 'phone-id/format';

formatPhone("081234567890", "e164");          // "+6281234567890"
formatPhone("081234567890", "international"); // "+62 812 3456 7890"
formatPhone("081234567890", "domestic");      // "0812-3456-7890"
formatPhone("081234567890", "compact");       // "081234567890"
```

| Format | Output |
|--------|--------|
| `e164` | `+6281234567890` |
| `international` | `+62 812 3456 7890` |
| `domestic` | `0812-3456-7890` |
| `compact` | `081234567890` |

### `generatePhone(options?: GenerateOptions): string`

Generate nomor telepon valid untuk testing.

```typescript
import { generatePhone } from 'phone-id';
// atau: import { generatePhone } from 'phone-id/generate';

// Full random
generatePhone();

// Operator spesifik
generatePhone({ operator: "Telkomsel" });
generatePhone({ operator: "Indosat" });
generatePhone({ operator: "XLSMART" });

// Prefix spesifik
generatePhone({ prefix: "0812" });

// Format output
generatePhone({ format: "e164" });          // "+62812xxxxxxx"
generatePhone({ format: "international" }); // "+62 812 xxxx xxxx"
generatePhone({ format: "domestic" });      // "0812-xxxx-xxxx"

// Kombinasi
generatePhone({ operator: "Telkomsel", format: "e164" });
```

### Operator Database

```typescript
import { getOperator, getOperators, getPrefixesByOperator, OPERATOR_MAP } from 'phone-id';
// atau: import { ... } from 'phone-id/operators';

// Lookup prefix
getOperator("0812");
// { name: "Telkomsel", brand: "Telkomsel", type: "mobile" }

// Semua prefix operator
getPrefixesByOperator("Telkomsel");
// ["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"]

// Semua prefix
getOperators(); // [["0811", {...}], ["0812", {...}], ...]
```

## Operator & Prefix

Data prefix per Mei 2025 (post merger XL Axiata + Smartfren → XLSMART).

| Operator | Prefix | Jumlah |
|----------|--------|--------|
| **Telkomsel** | 0811, 0812, 0813, 0821, 0822, 0823, 0851, 0852, 0853 | 9 |
| **Indosat Ooredoo Hutchison** | 0814, 0815, 0816, 0855, 0856, 0857, 0858, 0895, 0896, 0897, 0898, 0899 | 12 |
| **XLSMART** | 0817, 0818, 0819, 0831, 0832, 0833, 0838, 0859, 0877, 0878, 0879, 0881, 0882, 0883, 0884, 0885, 0886, 0887, 0888, 0889 | 20 |
| **PSN** (satelit) | 0868 | 1 |
| **Total** | | **42** |

## Input yang Diterima

`validatePhone`, `parsePhone`, dan `formatPhone` menerima berbagai format input:

| Format | Contoh |
|--------|--------|
| Domestik | `081234567890` |
| Dengan separator | `0812-3456-7890`, `0812 3456 7890`, `0812.3456.7890` |
| E.164 | `+6281234567890` |
| Internasional tanpa + | `6281234567890` |
| Bare NSN | `81234567890` |

## Validasi yang Dilakukan

| # | Pengecekan | Error |
|---|-----------|-------|
| 1 | Input harus string | `Nomor telepon harus berupa string` |
| 2 | Tidak boleh kosong | `Nomor telepon tidak boleh kosong` |
| 3 | Hanya digit (setelah sanitize) | `Nomor telepon hanya boleh berisi angka` |
| 4 | Harus diawali 08 | `Nomor telepon harus diawali 08` |
| 5 | Digit ke-3 valid (bukan 0/4) | `Prefix nomor telepon tidak valid` |
| 6 | Panjang 10-13 digit | `Panjang nomor telepon tidak valid (harus 10-13 digit)` |

## Tree-shaking / Sub-path Imports

```typescript
import { validatePhone } from 'phone-id/validate';
import { parsePhone } from 'phone-id/parse';
import { formatPhone } from 'phone-id/format';
import { generatePhone } from 'phone-id/generate';
import { getOperator, getPrefixesByOperator } from 'phone-id/operators';
import type { PhoneResult, ValidationResult } from 'phone-id/types';
```

## Types

```typescript
import type {
  PhoneValid,
  PhoneInvalid,
  PhoneResult,
  ValidationValid,
  ValidationInvalid,
  ValidationResult,
  PhoneFormat,
  GenerateOptions,
  Operator,
} from 'phone-id/types';
```

## Contributing

```bash
git clone https://github.com/sumitroajiprabowo/phone-id.git
cd phone-id
npm install
npm run lint          # Lint check (Biome)
npm run format:check  # Format check
npm run typecheck     # TypeScript check
npm run test:coverage # Test dengan coverage (harus 100%)
npm run build         # Build ESM + CJS
```

## Changelog

Lihat [CHANGELOG.md](CHANGELOG.md) untuk riwayat perubahan.

## Lisensi

[MIT](LICENSE) (c) [Sumitro Aji Prabowo](https://github.com/sumitroajiprabowo)
