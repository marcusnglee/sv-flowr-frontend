<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#each data.tracks as track}
	<div>
		{track}
	</div>
{/each}
