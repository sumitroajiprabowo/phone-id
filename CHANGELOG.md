# Changelog

Semua perubahan penting pada project ini didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
dan project ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-05-19

### Fixed

- Corrected XLSMART prefix count in comments (18 → 20)
- Restored missing JSDoc for `applyFormat` internal function

## [1.0.0] - 2026-05-19

### Added

- `validatePhone()` — validasi format nomor telepon Indonesia
- `parsePhone()` — parse nomor telepon ke komponen (operator, prefix, format)
- `formatPhone()` — format nomor telepon ke E.164, international, domestic, atau compact
- `generatePhone()` — generate nomor telepon untuk testing
- `getOperator()` — lookup operator berdasarkan prefix
- `getOperators()` — daftar semua prefix dan operator
- `getPrefixesByOperator()` — cari semua prefix milik operator tertentu
- `OPERATOR_MAP` — database 42 prefix aktif (9 Telkomsel + 12 IOH + 20 XLSMART + 1 PSN)
- Dual ESM + CJS build
- Sub-path imports untuk tree-shaking
- 100% test coverage
- CI/CD dengan GitHub Actions
