import { loadFigures } from "../lib.ts";
import type { PageServerLoad } from "./$types.js";

export let prerender = true;

export let load: PageServerLoad = async () => {
	let figures = await loadFigures();
	return { figures };
};
