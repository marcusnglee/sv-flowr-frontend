<script lang="ts">
	//TODO: implement adding multiple tracks
	import { cn } from '$lib/components/utils';
	import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
  } from "@internationalized/date";
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { Calendar } from '$lib/components/ui/calendar';
	import { CalendarIcon } from 'lucide-svelte';
	import { formSchema } from './schema';
	import type { TrackData } from './+page.server';
	let uploading = $state(false);
	let releaseTitle = $state();
	let releaseImage: FileList | undefined = $state();
	let releaseType: string | undefined = $state();
	let releaseGenre = $state();
	let releaseDescription = $state();
	let uploadTrackAudio: FileList | undefined = $state();
	let uploadTrackTitle: string | undefined = $state();
	let releaseDate: DateValue | undefined = $state();
	const df = new DateFormatter("en-US", {
    	dateStyle: "long",
  	});
	const handleUpload = async () => {
		try {
			//TODO: authentication
			uploading = true;
			// create form
			const jsDate = releaseDate ? 
  				releaseDate.toDate(getLocalTimeZone()) : null;
			console.log('isoDate: ', jsDate);
			const formData = {
				releaseTitle,
				releaseImage: releaseImage?.[0],
				releaseDate: jsDate,
				releaseType,
				releaseGenre,
				releaseDescription,
				uploadTrackAudio: uploadTrackAudio?.[0],
				uploadTrackTitle
			};
			
			// validate data using zod
			const validatedData = formSchema.parse(formData);
			console.log('Validation passed:', validatedData);
			//TODO: change this for multiple files
			// Prepare tracks data for server
			const tracks: TrackData[] = [
				{
					title: uploadTrackTitle as string,
					number: 1,
					fileName: uploadTrackAudio?.[0]?.name || '',
					mimeType: uploadTrackAudio?.[0]?.type || ''
				}
			];
			
			// send to server
			const uploadResponse = await fetch('api/releaseUpload', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					releaseTitle,
					releaseType,
					releaseDate: jsDate,
					releaseGenre,
					releaseDescription,
					tracks
				})
			});

			if (!uploadResponse.ok) {
				throw new Error('Failed to get upload URLs');
			}
			console.log('UPLOAD RESPONSE:', uploadResponse);
			const { tracks: tracksWithUrls } = await uploadResponse.json();

			// Upload files using SAS URLs
			for (const track of tracksWithUrls) {
				if (!track.uploadUrl || !uploadTrackAudio?.[0]) {
					throw new Error('Missing upload URL or file');
				}

				// Upload the file using the SAS URL
				await fetch(track.uploadUrl, {
					method: 'PUT',
					body: uploadTrackAudio[0],
					headers: {
						'Content-Type': uploadTrackAudio[0].type,
						'x-ms-blob-type': 'BlockBlob'
					}
				});
			}

			console.log('Upload completed successfully');
		} catch (error) {
			console.error('Upload failed:', error);
		} finally {
			uploading = false;
		}
	};
</script>

<div class="grid w-full max-w-sm items-center gap-1.5">
	<Label for="release-image">Release Image</Label>
	<Input id="release-image" type="file" accept="image/*" bind:files={releaseImage} />

	<Popover.Root>
		<Popover.Trigger>
		  {#snippet child({ props })}
			<Button
			  variant="outline"
			  class={cn(
				"w-[280px] justify-start text-left font-normal",
				!releaseDate && "text-muted-foreground"
			  )}
			  {...props}
			>
			  <CalendarIcon class="mr-2 size-4" />
			  {releaseDate ? df.format(releaseDate.toDate(getLocalTimeZone())) : "Select a date"}
			</Button>
		  {/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
		  <Calendar bind:value={releaseDate} type="single" initialFocus />
		</Popover.Content>
	  </Popover.Root>
</div>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="title">Release Type</Label>
	<Select.Root type="single" bind:value={releaseType}>
		<Select.Trigger class="w-[180px]"
			>{releaseType ? releaseType : 'Select Release Type'}</Select.Trigger
		>
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
	<Input
		type="text"
		id="description"
		placeholder="Optional description for your release"
		bind:value={releaseDescription}
	/>
</div>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="track title">Track title</Label>
	<Input
		type="text"
		id="track title"
		placeholder="title of your track"
		bind:value={uploadTrackTitle}
	/>
</div>

<div class="grid w-full max-w-sm items-center gap-1.5">
	<Label for="release-image">Track Audio</Label>
	<Input id="release-image" type="file" accept="audio/*" bind:files={uploadTrackAudio} />
</div>

<Button onclick={handleUpload}>Submit</Button>
