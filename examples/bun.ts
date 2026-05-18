/**
 * Contoh penggunaan phone-id di Bun native HTTP server.
 *
 * Jalankan:
 *   bun run examples/bun.ts
 *
 * Test:
 *   curl http://localhost:3000/validate?phone=081234567890
 *   curl http://localhost:3000/parse?phone=081234567890
 */

import { formatPhone, generatePhone, parsePhone, validatePhone } from "../src";

const server = Bun.serve({
	port: 3000,
	fetch(req) {
		const url = new URL(req.url);
		const phone = url.searchParams.get("phone");

		if (url.pathname === "/validate") {
			if (!phone) return Response.json({ error: "Parameter 'phone' wajib diisi" }, { status: 400 });
			return Response.json(validatePhone(phone));
		}

		if (url.pathname === "/parse") {
			if (!phone) return Response.json({ error: "Parameter 'phone' wajib diisi" }, { status: 400 });
			const result = parsePhone(phone);
			if (!result.valid) return Response.json(result, { status: 400 });
			return Response.json(result);
		}

		if (url.pathname === "/format") {
			if (!phone) return Response.json({ error: "Parameter 'phone' wajib diisi" }, { status: 400 });
			const fmt = url.searchParams.get("format") || "e164";
			try {
				const formatted = formatPhone(phone, fmt as "e164" | "international" | "domestic" | "compact");
				return Response.json({ formatted });
			} catch (err) {
				return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 });
			}
		}

		if (url.pathname === "/generate") {
			try {
				const result = generatePhone({
					operator: url.searchParams.get("operator") || undefined,
					prefix: url.searchParams.get("prefix") || undefined,
					format: (url.searchParams.get("format") as "e164" | "international" | "domestic" | "compact") || undefined,
				});
				return Response.json({ phone: result });
			} catch (err) {
				return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 });
			}
		}

		return Response.json({ error: "Not found" }, { status: 404 });
	},
});

console.log(`phone-id Bun server running at http://localhost:${server.port}`);
