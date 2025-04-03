<script lang="ts">
import ImageGallery from "../components/ImageGallery.svelte";
import type { PageData } from "./$types.ts";

let { data }: { data: PageData } = $props();
let { figures } = data;

let sources = new Set(figures.map((d) => d.source.title));
let codes = $state(
	Array.from(new Set(figures.flatMap((d) => d.codes)))
		.toSorted()
		.map((code) => ({ name: code, selected: false })),
);
let selected = $derived(
	new Set(codes.filter((codes) => codes.selected).map((e) => e.name)),
);
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
					>{selected.size === 0 ? codes.length : selected.size}
					<span>codes</span>
				</span>
			</div>
			<div class="flex items-center gap-1">
				<span class="font-medium">{data.figures.length}</span>
				<span>quotations</span>
			</div>
		</div>
	</div>

	<div class="flex-1 min-h-0">
		<div class="flex flex-col h-full">
			<div class="p-4 border-b">
				<div class="flex flex-wrap gap-2">
					{#each codes as code}
						<label class="inline-flex items-center">
							<input
								type="checkbox"
								class="form-checkbox h-4 w-4 text-blue-600"
								bind:checked={code.selected}
							/>
							<span class="ml-2 text-sm text-gray-700"
								>{code.name}</span
							>
						</label>
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
</div>
