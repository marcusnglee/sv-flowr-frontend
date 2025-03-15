<script lang="ts">
	import type { PageData } from './$types';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	let releaseTitle = $state();
	let releaseImage: FileList | undefined = $state();

	const handle = () => {
		console.log(releaseTitle, releaseImage);
		// TODO validate data using zod
		// TODO get presigned urls
		// TODO upload data to presigned urls
		// TODO submit everything to an endpoint
	};
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="title">Release Title</Label>
	<Input type="text" id="title" placeholder="Title" bind:value={releaseTitle} />
	<p class="text-sm text-muted-foreground">Enter your release title name.</p>
</div>

<div class="grid w-full max-w-sm items-center gap-1.5">
	<Label for="release-image">Release Image</Label>
	<Input id="release-image" type="file" bind:files={releaseImage} />
</div>

<Button onclick={handle}>Submit</Button>
