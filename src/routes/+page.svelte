<script lang="ts">
import ImageGallery from "../components/ImageGallery.svelte";
import type { PageData } from "./$types.ts";

let { data }: { data: PageData } = $props();
let { figures } = data;

let sources = new Set(figures.map((d) => d.source.title));

// Parse codes into groups
let codeGroups = $state(
	Array.from(new Set(figures.flatMap((d) => d.codes)))
		.toSorted()
		.reduce(
			(acc, code) => {
				const [group, name] = code.split(":");
				if (!acc[group]) {
					acc[group] = [];
				}
				acc[group].push({ name: code, selected: false });
				return acc;
			},
			{} as Record<string, Array<{ name: string; selected: boolean }>>,
		),
);

let selected = $derived(
	new Set(
		Object.values(codeGroups)
			.flat()
			.filter((code) => code.selected)
			.map((e) => e.name),
	),
);

function resetFilters() {
	codeGroups = Object.fromEntries(
		Object.entries(codeGroups).map(([group, codes]) => [
			group,
			codes.map((code) => ({ ...code, selected: false })),
		]),
	);
}
</script>

<div class="flex flex-col h-screen">
	<div class="px-4 sm:px-6 lg:px-8 py-4">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">
			3D Genome Visualization Survey
		</h1>
		<div class="flex items-center gap-6 text-sm text-gray-600">
			<div class="flex items-center gap-1">
				<span class="font-medium">{sources.size}</span>
				<span>papers</span>
			</div>
			<div class="flex items-center gap-1">
				<span class="font-medium"
					>{selected.size === 0
						? Object.values(codeGroups).flat().length
						: selected.size}
					<span>codes</span>
				</span>
			</div>
			<div class="flex items-center gap-1">
				<span class="font-medium">{data.figures.length}</span>
				<span>quotations</span>
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
						on:click={resetFilters}
					>
						Reset
					</button>
				{/if}
			</div>
			<div class="space-y-4">
				{#each Object.entries(codeGroups) as [group, codes]}
					<div>
						<h3 class="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">{group}</h3>
						<div class="flex flex-wrap gap-1.5">
							{#each codes as code}
								<button
									class="px-2.5 py-1 text-xs rounded-full transition-colors duration-150 {code.selected
										? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
										: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
									on:click={() => (code.selected = !code.selected)}
								>
									{code.name.split(':')[1]}
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex-1 overflow-auto">
			<ImageGallery
				figures={selected.size === 0
					? data.figures
					: data.figures.filter((figure) =>
							[...selected].every((code) =>
								figure.codes.includes(code),
							),
						)}
			/>
		</div>
	</div>
</div>
