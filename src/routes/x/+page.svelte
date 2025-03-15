<script lang="ts">
	import type { PageData } from './$types';
	import { EnokiFlow } from '@mysten/enoki';
	const enokiFlow = new EnokiFlow({
		apiKey: '<YOUR_API_KEY>'
	});
	const googleSignInUrl = enokiFlow.createAuthorizationURL({
		provider: 'google',
		clientId: 'your-client-id',
		redirectUrl: 'your-redirect-url'
	});
	enokiFlow.enokiClient.
	/* 
		 async handleAuthCallback(hash = window.location.hash) {
    const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
    const zkp = await this.getSession();
    if (!zkp || !zkp.ephemeralKeyPair || !zkp.maxEpoch || !zkp.randomness) {
      throw new Error(
        "Start of sign-in flow could not be found. Ensure you have started the sign-in flow before calling this."
      );
    }
    const jwt = params.get("id_token");
    if (!jwt) {
      throw new Error("Missing ID Token");
    }
    (0, import_zklogin.decodeJwt)(jwt);
    const { address, salt } = await __privateGet(this, _enokiClient).getZkLogin({ jwt });
    this.$zkLoginState.set({
      ...this.$zkLoginState.get(),
      salt,
      address
    });
    await __privateMethod(this, _EnokiFlow_instances, setSession_fn).call(this, {
      ...zkp,
      jwt
    });
    return params.get("state");
	*/

	let { data }: { data: PageData } = $props();
</script>
