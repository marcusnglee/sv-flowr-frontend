<script lang="ts">
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar';

	let { children } = $props();
</script>

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
