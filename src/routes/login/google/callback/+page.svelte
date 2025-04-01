<script lang="ts">
	import { page } from '$app/state';
	import { EnokiFlow } from '@mysten/enoki';
	import { onMount } from 'svelte';
	onMount(async () => {
		const enokiFlow = new EnokiFlow({
			apiKey: 'enoki_public_6646caa1f30298432565ccca00c4b9a2'
		});
		enokiFlow.handleAuthCallback();
		console.log(enokiFlow.getSession());
	});
</script>
