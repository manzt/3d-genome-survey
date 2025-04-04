<script lang="ts">
import type { PageData } from "./$types.ts";

import ImageGallery from "../components/ImageGallery.svelte";

let { data }: { data: PageData } = $props();
let { figures } = data;

let codes = $state(
	Array.from(new Set(figures.flatMap((d) => d.codes)))
		.toSorted()
		.map((name) => ({ name, selected: false })),
);

let selected = $derived(
	new Set(codes.filter((code) => code.selected).map((e) => e.name)),
);

let filteredFigures = $derived(
	selected.size === 0
		? data.figures
		: data.figures.filter((figure) =>
				[...selected].every((code) => figure.codes.includes(code)),
			),
);

let paperCount = $derived(
	new Set(filteredFigures.map((d) => d.source.title)).size,
);

let available = $derived.by(() => {
	if (selected.size === 0) {
		return new Set(codes.map((code) => code.name));
	}

	// all figures that match current selection
	let matching = data.figures.filter((figure) =>
		[...selected].every((code) => figure.codes.includes(code)),
	);

	// all codes that appear in these matching figures
	return new Set(matching.flatMap((figure) => figure.codes));
});

function reset() {
	for (let code of codes) {
		code.selected = false;
	}
}
</script>

<div class="flex flex-col h-screen">
	<div class="px-4 py-4">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">
			3D Genome Visualization Survey
		</h1>
		<div class="flex items-center gap-6 text-sm text-gray-600">
			<div class="flex items-center gap-1">
				<span class="font-medium">{paperCount}</span>
				<span>papers</span>
			</div>
			<div class="flex items-center gap-1">
				<span class="font-medium"
					>{selected.size === 0 ? codes.length : selected.size}
					<span>code{selected.size === 1 ? "" : "s"}</span>
				</span>
			</div>
			<div class="flex items-center gap-1">
				<span class="font-medium">{filteredFigures.length}</span>
				<span>figure{filteredFigures.length === 1 ? "" : "s"}</span>
			</div>
		</div>
	</div>
	<div class="flex-1 min-h-0 flex">
		<div class="w-64 overflow-y-auto px-4">
			<div class="flex items-center justify-between mb-3">
				<h2 class="text-lg font-semibold text-gray-900">Filters</h2>
				{#if selected.size > 0}
					<button
						class="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-150"
						onclick={reset}
					>
						Reset
					</button>
				{/if}
			</div>
			<div class="space-y-4">
				{#each Object.entries(Object.groupBy(codes, (code) => code.name.split(":")[0])) as [group, groupCodes]}
					<div>
						<h3
							class="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider"
						>
							{group}
						</h3>
						<div class="flex flex-wrap gap-1.5">
							{#each groupCodes ?? [] as code}
								<button
									class={[
										"px-2.5 py-1 text-xs rounded-full transition-colors duration-150",
										code.selected
											? "bg-blue-100 text-blue-800 hover:bg-blue-200"
											: available.has(code.name)
												? "bg-gray-100 text-gray-600 hover:bg-gray-200"
												: "bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed",
									]}
									onclick={() =>
										available.has(code.name) &&
										(code.selected = !code.selected)}
									disabled={!available.has(code.name) &&
										!code.selected}
								>
									{code.name.split(":")[1]}
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex-1 overflow-auto">
			<ImageGallery figures={filteredFigures} usePlaceholder={false} />
		</div>
	</div>
</div>
