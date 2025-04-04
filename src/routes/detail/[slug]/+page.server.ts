import * as kit from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.ts";

import { loadFigures } from "../../../lib.ts";

export const prerender = true;

export const entries = async () => {
	let figures = await loadFigures();
	return figures.map((figure) => ({
		slug: figure.imagePath[1],
	}));
};

export const load: PageServerLoad = async ({ params }) => {
	let figures = await loadFigures();
	let figure = figures.find((f) => params.slug === f.imagePath[1]);
	if (!figure) {
		kit.error(404, "Not found");
	}
	return figure;
};
