/**
 * Contoh penggunaan phone-id di Next.js.
 *
 * API Route + Server Component.
 *
 * Setup:
 *   npm install phone-id
 *   # Simpan file ini sesuai struktur Next.js App Router
 */

// ============================================================
// API Route: app/api/phone/route.ts
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { formatPhone, generatePhone, parsePhone, validatePhone } from "phone-id";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const action = searchParams.get("action");
	const phone = searchParams.get("phone");

	switch (action) {
		case "validate": {
			if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });
			return NextResponse.json(validatePhone(phone));
		}
		case "parse": {
			if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });
			return NextResponse.json(parsePhone(phone));
		}
		case "format": {
			if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });
			const fmt = searchParams.get("format") || "e164";
			try {
				const formatted = formatPhone(
					phone,
					fmt as "e164" | "international" | "domestic" | "compact",
				);
				return NextResponse.json({ formatted });
			} catch (err) {
				return NextResponse.json(
					{ error: err instanceof Error ? err.message : String(err) },
					{ status: 400 },
				);
			}
		}
		case "generate": {
			const generated = generatePhone({
				operator: searchParams.get("operator") || undefined,
				format:
					(searchParams.get("format") as
						| "e164"
						| "international"
						| "domestic"
						| "compact") || undefined,
			});
			return NextResponse.json({ phone: generated });
		}
		default:
			return NextResponse.json({ error: "Unknown action" }, { status: 400 });
	}
}

// ============================================================
// Server Component: app/phone/page.tsx
// ============================================================
// import { parsePhone } from 'phone-id';
//
// export default function PhonePage() {
//   const result = parsePhone("081234567890");
//
//   if (!result.valid) {
//     return <p>Error: {result.error}</p>;
//   }
//
//   return (
//     <div>
//       <h1>Phone Info</h1>
//       <p>Operator: {result.operator}</p>
//       <p>E.164: {result.e164}</p>
//       <p>Domestic: {result.domestic}</p>
//     </div>
//   );
// }
