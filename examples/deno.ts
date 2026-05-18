/**
 * Contoh penggunaan phone-id di Deno native HTTP server.
 *
 * Jalankan:
 *   deno run --allow-net examples/deno.ts
 *
 * Test:
 *   curl http://localhost:3000/validate?phone=081234567890
 *   curl http://localhost:3000/parse?phone=081234567890
 */

import { formatPhone, generatePhone, parsePhone, validatePhone } from "../src/index.ts";

const PORT = 3000;

Deno.serve({ port: PORT }, (req: Request): Response => {
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
});

console.log(`phone-id Deno server running at http://localhost:${PORT}`);
