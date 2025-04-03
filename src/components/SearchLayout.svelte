<script lang="ts">
  import { onMount } from "svelte";
  import { load } from "../loader.ts";

  export let figures;

  let codes = new Set<string>();
  let selectedCodes = new Set<string>();
</script>

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
          <span class="ml-2 text-sm text-gray-700">{code}</span>
        </label>
      {/each}
    </div>
  </div>
  <div class="flex-1 overflow-auto">
    {children}
  </div>
</div>
