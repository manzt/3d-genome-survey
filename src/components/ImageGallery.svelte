<script lang="ts">
import { base } from "$app/paths";

type Figure = {
	source: { title: string; year: number; authors: string };
	imagePath: Array<string>;
	codes: Array<string>;
};

let {
	figures,
	usePlaceholder = false,
}: { figures: Array<Figure>; usePlaceholder?: boolean } = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
  {#each figures as figure}
    {@const { title, authors, year } = figure.source}
    <div
      class="gallery-item border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 p-2"
    >
      <div class="h-full flex flex-col">
        <div
          class="aspect-square bg-gray-100 rounded flex items-center justify-center mb-2"
        >
          {#if usePlaceholder}
            <svg
              class="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          {:else}
            <img
              src={`${base}/images/${figure.imagePath[0]}/${figure.imagePath[1]}.webp`}
              alt={title}
              class="w-full h-full object-cover"
              loading="lazy"
            />
          {/if}
        </div>
        <div
          class="flex items-center justify-between text-xs text-gray-500 mb-1"
        >
          <span class="italic">{authors}</span>
          <span>{year}</span>
        </div>
        <h3 class="text-xs text-gray-500 mb-2">{title}</h3>
        <ul class="flex flex-wrap gap-0.5 mt-auto">
          {#each figure.codes as code}
            <li
              class="code-pill bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-[10px]"
            >
              {code}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/each}
</div>
