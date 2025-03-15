<script lang="ts">
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Header from '$lib/components/custom/Header.svelte';

	let { children } = $props();
</script>

<div class="flex h-screen flex-col">
	<div class="relative z-20">
		<Header />
	</div>
	<div class="flex flex-1 overflow-hidden">
		<Sidebar.Provider>
			<Sidebar.Root>
				<Sidebar.Header />
				<Sidebar.Content>
					<Sidebar.Group />
					<Sidebar.Group />
				</Sidebar.Content>
				<Sidebar.Footer />
			</Sidebar.Root>
			<Sidebar.Inset>
				{@render children()}
				<div>Audio</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	</div>
</div>
