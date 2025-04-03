import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	integrations: [svelte()],

	vite: {
		plugins: [tailwindcss()],
	},
});
