<script lang="ts">
	import type { PageData } from "./$types.ts";
	import ImageGallery from "../components/ImageGallery.svelte";

	let { data }: { data: PageData } = $props();
	const sources = new Set(data.figures.map((d) => d.source.title));
	const codes = new Set(data.figures.flatMap((d) => d.codes));

	let sourcesCount = sources.size;
	let quotationsCount = data.figures.length;
	let selectedCodes = new Set();
</script>

<div class="flex flex-col h-screen">
	<div class="px-4 sm:px-6 lg:px-8 py-4">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">
			3D Genome Visualization Survey
		</h1>
		<div class="flex items-center gap-6 text-sm text-gray-600">
			<div class="flex items-center gap-1">
				<span class="font-medium">{sourcesCount}</span>
				<span>papers</span>
			</div>
			<div class="flex items-center gap-1">
				<span class="font-medium">{codes.size}</span>
				<span>codes</span>
			</div>
			<div class="flex items-center gap-1">
				<span class="font-medium">{quotationsCount}</span>
				<span>quotations</span>
			</div>
		</div>
	</div>

	<div class="flex-1 min-h-0">
		<div class="flex flex-col h-full">
			<div class="p-4 border-b">
				<div class="flex flex-wrap gap-2">
					{#each Array.from(codes) as code}
						<label class="inline-flex items-center">
							<input
								type="checkbox"
								class="form-checkbox h-4 w-4 text-blue-600"
								data-code={code}
								checked={selectedCodes.has(code)}
							/>
							<span class="ml-2 text-sm text-gray-700"
								>{code}</span
							>
						</label>
					{/each}
				</div>
			</div>
			<div class="flex-1 overflow-auto">
				<ImageGallery figures={data.figures} />
			</div>
		</div>
	</div>
</div>
