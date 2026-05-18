/**
 * Contoh penggunaan phone-id di Hono.
 *
 * REST API endpoints untuk validasi, parse, dan format nomor telepon Indonesia.
 *
 * Jalankan:
 *   npm install hono @hono/node-server
 *   npx tsx examples/hono.ts
 *
 * Test:
 *   curl http://localhost:3000/validate?phone=081234567890
 *   curl http://localhost:3000/parse?phone=081234567890
 *   curl http://localhost:3000/format?phone=081234567890&format=e164
 *   curl http://localhost:3000/generate
 */

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { formatPhone, generatePhone, parsePhone, validatePhone } from "../src";

const app = new Hono();

// GET /validate?phone=081234567890
app.get("/validate", (c) => {
	const phone = c.req.query("phone");
	if (!phone) {
		return c.json({ error: "Parameter 'phone' wajib diisi" }, 400);
	}
	return c.json(validatePhone(phone));
});

// GET /parse?phone=081234567890
app.get("/parse", (c) => {
	const phone = c.req.query("phone");
	if (!phone) {
		return c.json({ error: "Parameter 'phone' wajib diisi" }, 400);
	}
	const result = parsePhone(phone);
	if (!result.valid) {
		return c.json(result, 400);
	}
	return c.json(result);
});

// GET /format?phone=081234567890&format=e164
app.get("/format", (c) => {
	const phone = c.req.query("phone");
	const fmt = c.req.query("format") || "e164";
	if (!phone) {
		return c.json({ error: "Parameter 'phone' wajib diisi" }, 400);
	}
	try {
		const formatted = formatPhone(
			phone,
			fmt as "e164" | "international" | "domestic" | "compact",
		);
		return c.json({ formatted });
	} catch (err) {
		return c.json({ error: err instanceof Error ? err.message : String(err) }, 400);
	}
});

// GET /generate?operator=Telkomsel&format=e164
app.get("/generate", (c) => {
	try {
		const phone = generatePhone({
			operator: c.req.query("operator") || undefined,
			prefix: c.req.query("prefix") || undefined,
			format:
				(c.req.query("format") as "e164" | "international" | "domestic" | "compact") ||
				undefined,
		});
		return c.json({ phone });
	} catch (err) {
		return c.json({ error: err instanceof Error ? err.message : String(err) }, 400);
	}
});

const port = 3000;
console.log(`phone-id Hono server running at http://localhost:${port}`);
serve({ fetch: app.fetch, port });
