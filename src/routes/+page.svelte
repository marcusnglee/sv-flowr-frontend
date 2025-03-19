<script lang='ts'>
	import type { PageProps } from "./$types";


    let {data}: PageProps = $props();
</script>

<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

{#each data.recentReleases as release}
<a 
    href={`/releases/${release.id}`} 
    class="group block overflow-hidden transition-transform hover:scale-[1.02]"
  >
    <!-- Cover Image -->
    <div class="aspect-square w-full overflow-hidden bg-gray-100">
      {#if release.coverUrl}
        <img 
          src={release.coverUrl} 
          alt={`${release.title} cover`} 
          class="h-full w-full object-cover transition-opacity group-hover:opacity-90"
          loading="lazy"
        />
      {:else}
        <div class="flex h-full items-center justify-center bg-gray-200">
          <span class="text-gray-500">No Cover</span>
        </div>
      {/if}
    </div>
    
    <!-- Release Info -->
    <div class="mt-2 space-y-1">
      <h3 class="truncate text-sm font-medium">{release.title}</h3>
      <div class="flex items-center">
        <p class="truncate text-xs text-gray-500">
          {release.artistName || 'Unknown Artist'}
        </p>
        
      </div>
      {#if release.releaseDate}
        <p class="text-xs text-gray-400">
          {new Date(release.releaseDate).getFullYear()}
        </p>
      {/if}
    </div>
  </a>
  {/each}
</div>