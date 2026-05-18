/**
 * Contoh penggunaan phone-id di React.
 *
 * Form validasi nomor telepon Indonesia dengan feedback real-time.
 *
 * Untuk development:
 *   npm install phone-id
 *   # Gunakan di project React/Vite/Next.js yang sudah ada
 */

import { useState } from "react";
import { formatPhone, parsePhone, validatePhone } from "phone-id";
import type { PhoneResult, ValidationResult } from "phone-id/types";

export default function PhoneValidator() {
	const [input, setInput] = useState("");
	const [validation, setValidation] = useState<ValidationResult | null>(null);
	const [parsed, setParsed] = useState<PhoneResult | null>(null);

	const handleChange = (value: string) => {
		setInput(value);
		if (value.trim().length === 0) {
			setValidation(null);
			setParsed(null);
			return;
		}
		setValidation(validatePhone(value));
		setParsed(parsePhone(value));
	};

	return (
		<div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" }}>
			<h1>Validasi Nomor Telepon Indonesia</h1>

			<input
				type="text"
				value={input}
				onChange={(e) => handleChange(e.target.value)}
				placeholder="Masukkan nomor telepon (cth: 081234567890)"
				style={{ width: "100%", padding: "0.75rem", fontSize: "1rem" }}
			/>

			{validation && (
				<div
					style={{
						marginTop: "1rem",
						padding: "1rem",
						borderRadius: 8,
						backgroundColor: validation.valid ? "#d4edda" : "#f8d7da",
						color: validation.valid ? "#155724" : "#721c24",
					}}
				>
					{validation.valid ? "✅ Nomor telepon valid" : `❌ ${validation.error}`}
				</div>
			)}

			{parsed?.valid && (
				<div style={{ marginTop: "1rem" }}>
					<h3>Hasil Parse</h3>
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<tbody>
							<Row label="Operator" value={parsed.operator ?? "Tidak diketahui"} />
							<Row label="Brand" value={parsed.brand ?? "-"} />
							<Row label="Network" value={parsed.networkType ?? "-"} />
							<Row label="Prefix" value={parsed.prefix} />
							<Row label="E.164" value={parsed.e164} />
							<Row label="International" value={parsed.international} />
							<Row label="Domestic" value={parsed.domestic} />
							<Row label="Compact" value={parsed.compact} />
						</tbody>
					</table>

					<h3>Format Lain</h3>
					<ul>
						<li>E.164: <code>{formatPhone(input, "e164")}</code></li>
						<li>International: <code>{formatPhone(input, "international")}</code></li>
						<li>Domestic: <code>{formatPhone(input, "domestic")}</code></li>
						<li>Compact: <code>{formatPhone(input, "compact")}</code></li>
					</ul>
				</div>
			)}
		</div>
	);
}

function Row({ label, value }: { label: string; value: string }) {
	return (
		<tr>
			<td style={{ padding: "0.5rem", fontWeight: "bold", borderBottom: "1px solid #ddd" }}>
				{label}
			</td>
			<td style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>{value}</td>
		</tr>
	);
}
