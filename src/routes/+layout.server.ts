import { loadFigures } from "../lib.ts";
import type { LayoutServerLoad } from "./$types.ts";

export let load: LayoutServerLoad = async () => {
	let figures = await loadFigures();
	return { figures };
};
