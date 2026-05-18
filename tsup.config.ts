import { defineConfig } from "tsup";

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/types.ts",
		"src/validate.ts",
		"src/parse.ts",
		"src/format.ts",
		"src/generate.ts",
		"src/operators.ts",
	],
	format: ["esm", "cjs"],
	dts: true,
	splitting: false,
	sourcemap: false,
	clean: true,
});
