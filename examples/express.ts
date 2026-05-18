/**
 * Contoh penggunaan phone-id di Express.js.
 *
 * REST API endpoints untuk validasi, parse, dan format nomor telepon Indonesia.
 *
 * Jalankan:
 *   npm install express
 *   npx tsx examples/express.ts
 *
 * Test:
 *   curl http://localhost:3000/validate?phone=081234567890
 *   curl http://localhost:3000/parse?phone=081234567890
 *   curl http://localhost:3000/format?phone=081234567890&format=e164
 *   curl http://localhost:3000/generate
 *   curl http://localhost:3000/generate?operator=Telkomsel&format=e164
 */

import express from "express";
import { formatPhone, generatePhone, parsePhone, validatePhone } from "../src";

const app = express();
const PORT = 3000;

// GET /validate?phone=081234567890
app.get("/validate", (req, res) => {
	const phone = req.query.phone as string | undefined;
	if (!phone) {
		res.status(400).json({ error: "Parameter 'phone' wajib diisi" });
		return;
	}
	res.json(validatePhone(phone));
});

// GET /parse?phone=081234567890
app.get("/parse", (req, res) => {
	const phone = req.query.phone as string | undefined;
	if (!phone) {
		res.status(400).json({ error: "Parameter 'phone' wajib diisi" });
		return;
	}

	const result = parsePhone(phone);
	if (!result.valid) {
		res.status(400).json(result);
		return;
	}
	res.json(result);
});

// GET /format?phone=081234567890&format=e164
app.get("/format", (req, res) => {
	const phone = req.query.phone as string | undefined;
	const fmt = (req.query.format as string) || "e164";
	if (!phone) {
		res.status(400).json({ error: "Parameter 'phone' wajib diisi" });
		return;
	}
	try {
		const formatted = formatPhone(
			phone,
			fmt as "e164" | "international" | "domestic" | "compact",
		);
		res.json({ formatted });
	} catch (err) {
		res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
	}
});

// GET /generate?operator=Telkomsel&format=e164
app.get("/generate", (req, res) => {
	try {
		const phone = generatePhone({
			operator: req.query.operator as string | undefined,
			prefix: req.query.prefix as string | undefined,
			format: (req.query.format as "e164" | "international" | "domestic" | "compact") || undefined,
		});
		res.json({ phone });
	} catch (err) {
		res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
	}
});

app.listen(PORT, () => {
	console.log(`phone-id Express server running at http://localhost:${PORT}`);
	console.log("\nEndpoints:");
	console.log("  GET /validate?phone=081234567890");
	console.log("  GET /parse?phone=081234567890");
	console.log("  GET /format?phone=081234567890&format=e164");
	console.log("  GET /generate?operator=Telkomsel&format=e164");
});
