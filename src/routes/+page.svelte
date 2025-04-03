<script lang="ts">
import ImageGallery from "../components/ImageGallery.svelte";
import type { PageData } from "./$types.ts";

let { data }: { data: PageData } = $props();
let { figures } = data;

let groups = $state(
	Array.from(new Set(figures.flatMap((d) => d.codes)))
		.toSorted()
		.reduce(
			(acc, code) => {
				let [grp, _] = code.split(":");
				if (!acc[grp]) acc[grp] = [];
				acc[grp].push({ name: code, selected: false });
				return acc;
			},
			{} as Record<string, Array<{ name: string; selected: boolean }>>,
		),
);

let selected = $derived(
	new Set(
		Object.values(groups)
			.flat()
			.filter((code) => code.selected)
			.map((e) => e.name),
	),
);

let filteredFigures = $derived.by(() =>
	selected.size === 0
		? data.figures
		: data.figures.filter((figure) =>
				[...selected].every((code) => figure.codes.includes(code)),
			),
);

function reset() {
	for (const group of Object.values(groups)) {
		for (const item of group) {
			item.selected = false;
		}
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
				<span class="font-medium"
					>{new Set(filteredFigures.map((d) => d.source.title))
						.size}</span
				>
				<span>papers</span>
			</div>
			<div class="flex items-center gap-1">
				<span class="font-medium"
					>{selected.size === 0
						? Object.values(groups).flat().length
						: selected.size}
					<span>code{selected.size === 1 ? "" : "s"}</span>
				</span>
			</div>
			<div class="flex items-center gap-1">
				<span class="font-medium">{filteredFigures.length}</span>
				<span>quotation{filteredFigures.length === 1 ? "" : "s"}</span>
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
				{#each Object.entries(groups) as [group, codes]}
					<div>
						<h3
							class="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider"
						>
							{group}
						</h3>
						<div class="flex flex-wrap gap-1.5">
							{#each codes as code}
								<button
									class="px-2.5 py-1 text-xs rounded-full transition-colors duration-150 {code.selected
										? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
										: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
									onclick={() =>
										(code.selected = !code.selected)}
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
