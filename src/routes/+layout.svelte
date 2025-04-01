<script lang="ts">
	import '../app.css';
	import FlowrSidebar from '$lib/components/custom/FlowrSidebar.svelte';
	import Header from '$lib/components/custom/Header.svelte';
	import AudioPlayer from '$lib/components/custom/AudioPlayer.svelte';
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";

	let { children } = $props();
</script>

<div class="flex h-screen flex-col">
	<div class="relative z-50">
		<Header />
	</div>
	<div class="flex flex-1 overflow-auto z-1">
		<Sidebar.Provider class='flex flex-1 overflow-hidden'>
			<div class='flex h-full'>
			<FlowrSidebar />
		</div>
		<main class="flex-1 overflow-auto px-1 bg-slate-100">
			  {@render children?.()}
			</main>
		  </Sidebar.Provider>
	</div>
	<div class="flex items-center w-full bg-base-300 border-t z-10">
	<AudioPlayer />
	</div>
</div>
