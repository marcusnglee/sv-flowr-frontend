<script lang="ts">
	import { EnokiFlow } from '@mysten/enoki';
	import { onMount } from 'svelte';
	onMount(async () => {
		const enokiFlow = new EnokiFlow({
			apiKey: 'enoki_public_6646caa1f30298432565ccca00c4b9a2'
		});
		window.location.href = await enokiFlow.createAuthorizationURL({
			provider: 'google',
			network: 'testnet',
			clientId: '5051871575-ovnbit78c9dhj6n8q89vfh2e7jrre9p5.apps.googleusercontent.com',
			redirectUrl: 'http://localhost:5173/login/google/callback',
			extraParams: {
				scope: ['openid', 'email', 'profile']
			}
		});
	});
</script>
