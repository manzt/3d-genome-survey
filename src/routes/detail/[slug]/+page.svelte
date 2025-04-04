<script lang="ts">
import { goto } from "$app/navigation";
import { base } from "$app/paths";
import type { PageData } from "./$types.ts";
let { data: figure }: { data: PageData } = $props();
</script>

<div class="flex flex-col h-screen">
	<div
		class="sticky top-0 z-10 bg-white px-3 py-2 border-b border-gray-200 flex items-center shadow-sm"
	>
		<button
			aria-label="go back"
			class="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-150"
			onclick={() => goto(`${base}/`, { noScroll: true })}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="w-5 h-5"
			>
				<path d="M19 12H5M12 19l-7-7 7-7"></path>
			</svg>
		</button>
		<h1 class="text-lg font-semibold text-gray-900 ml-1">details</h1>
	</div>

	<div class="flex-1 overflow-auto">
		<div class="mx-auto max-w-xl">
			<div class="bg-white">
				<div class="relative">
					<img
						src={`${base}/images/${figure.imagePath[0]}/${figure.imagePath[1]}.webp`}
						alt={"Figure"}
						class="w-full h-auto"
					/>
				</div>
			</div>

			<div class="p-4">
				<h2 class="text-base font-semibold text-gray-900 mb-2">
					{figure.source.title}
				</h2>

				<div class="mb-3">
					<div class="flex flex-wrap gap-1">
						{#each figure.codes || [] as code}
							<span
								class="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800"
							>
								{code}
							</span>
						{/each}
					</div>
				</div>

				<div class="pt-2 border-t border-gray-200">
					<div class="text-xs text-gray-600">
						<p class="mb-0.5">
							<span class="font-medium">Authors:</span>
							{figure.source.authors}
						</p>
						<p>
							<span class="font-medium">Year:</span>
							{figure.source.year}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
