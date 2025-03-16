<script lang="ts">
	//TODO: implement adding multiple tracks
	import type { PageData } from './$types';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button';
	import * as Select from "$lib/components/ui/select/index.js";
	import { enhance } from '$app/forms';
	import { formSchema } from './schema';
	
	let uploading = $state(false);
	let releaseTitle = $state();
	let releaseImage: FileList | undefined = $state();
	let releaseType: string | undefined = $state();
	let releaseGenre = $state();
	let releaseDescription = $state();
	let uploadTrackAudio: FileList | undefined = $state();
	let uploadTrackTitle: string | undefined = $state();

	const handleUpload = () => {
		try {
		// create form
		const formData = {
			releaseTitle,
			releaseImage: releaseImage?.[0],
			releaseType,
			releaseGenre,
			releaseDescription,
			uploadTrackAudio: uploadTrackAudio?.[0],
			uploadTrackTitle
		}
		// TODO validate data using zod
		const validatedData = formSchema.parse(formData);
		console.log('Validation passed:', validatedData);

		// TODO get presigned urls
		// TODO upload data to presigned urls
		// TODO submit everything to an endpoint
		} catch (error){
			console.log(error);
		}
	};
</script>

<div class="grid w-full max-w-sm items-center gap-1.5">
	<Label for="release-image">Release Image</Label>
	<Input id="release-image" type="file" accept='image/*' bind:files={releaseImage} />
</div>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="title">Release Type</Label>
	<Select.Root type="single" bind:value={releaseType}>
		<Select.Trigger class="w-[180px]">{releaseType ? releaseType : 'Select Release Type'}</Select.Trigger>
		<Select.Content>
		  <Select.Item value="SINGLE">Single</Select.Item>
		  <Select.Item value="EP">EP</Select.Item>
		  <Select.Item value="LP">LP</Select.Item>
		  <Select.Item value="MIXTAPE">Mixtape</Select.Item>
		  <Select.Item value="COMPILATION">Compilation</Select.Item>
		</Select.Content>
	  </Select.Root>
</div>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="title">Release Title</Label>
	<Input type="text" id="title" placeholder="Title" bind:value={releaseTitle} />
</div>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="genre">Genre</Label>
	<Input type="text" id="genre" placeholder="" bind:value={releaseGenre} />
</div>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="description">Description</Label>
	<Input type="text" id="description" placeholder="Optional description for your release" bind:value={releaseDescription} />
</div>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="track title">Track title</Label>
	<Input type="text" id="track title" placeholder="title of your track" bind:value={uploadTrackTitle} />
</div>

<div class="grid w-full max-w-sm items-center gap-1.5">
	<Label for="release-image">Track Audio</Label>
	<Input id="release-image" type="file" accept='audio/*' bind:files={uploadTrackAudio} />
</div>

<Button onclick={handleUpload}>Submit</Button>
