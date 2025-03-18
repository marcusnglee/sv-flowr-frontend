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
	import { CalendarIcon, Upload, Music, Image as ImageIcon } from 'lucide-svelte';
	import { formSchema } from './schema';
	import type { TrackData } from './+page.server';
	let uploading = $state(false);
	let releaseTitle = $state();
	let releaseImage: FileList | undefined = $state();
	let releaseType: string | undefined = $state();
	let releaseGenre = $state('');
	let releaseDescription = $state('');
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
			const coverMimeType = releaseImage?.[0].type || '';
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
					tracks,
					coverMimeType,
				})
			});

			if (!uploadResponse.ok) {
				throw new Error('Failed to get upload URLs');
			}
			console.log('UPLOAD RESPONSE:', uploadResponse);
			const { tracks: tracksWithUrls, coverUploadUrl } = await uploadResponse.json();
			if (!coverUploadUrl.coverUploadUrl || !releaseImage?.[0]) {
					throw new Error('Missing image cover upload URL or file');
			}
			await fetch(coverUploadUrl.coverUploadUrl, {
				method: 'PUT',
				body: releaseImage[0],
				headers: {
						'Content-Type': releaseImage[0].type,
						'x-ms-blob-type': 'BlockBlob'
					}
			})

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

<div class="container mx-auto px-4 py-8 max-w-3xl h-full overflow-y-auto">
	<div class="mb-8">
	  <h1 class="text-3xl font-bold mb-2">flowr upload portal!</h1>
	  <p class="text-muted-foreground">Fill out the details below, and release your art to the world.</p>
	</div>
  
	<div class="space-y-8 pb-16">
	  <!-- Release Info Section -->
	  <div class="bg-card rounded-lg p-6 shadow-sm border">
		<h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
		  <span class="bg-primary/10 p-2 rounded-full"><ImageIcon size={18} /></span>
		  Release Information
		</h2>
		
		<div class="grid gap-6 sm:grid-cols-2">
		  <div class="space-y-2">
			<Label for="release-title" class="text-sm font-medium">Release Title</Label>
			<Input 
			  id="release-title" 
			  type="text" 
			  placeholder="Title of your release" 
			  bind:value={releaseTitle} 
			/>
		  </div>
		  
		  <div class="space-y-2">
			<Label for="release-type" class="text-sm font-medium">Release Type</Label>
			<Select.Root type="single" bind:value={releaseType}>
			  <Select.Trigger id="release-type" class="w-full">
				{releaseType ? releaseType : 'Select Release Type'}
			  </Select.Trigger>
			  <Select.Content>
				<Select.Item value="SINGLE">Single</Select.Item>
				<Select.Item value="EP">EP</Select.Item>
				<Select.Item value="LP">LP</Select.Item>
				<Select.Item value="MIXTAPE">Mixtape</Select.Item>
				<Select.Item value="COMPILATION">Compilation</Select.Item>
			  </Select.Content>
			</Select.Root>
		  </div>
		  
		  <div class="space-y-2">
			<Label for="release-genre" class="text-sm font-medium">Genre</Label>
			<Input 
			  id="release-genre" 
			  type="text" 
			  placeholder="e.g., Ambient, Industrial Rock, Pop" 
			  bind:value={releaseGenre} 
			/>
		  </div>
		  
		  <div class="space-y-2">
			<Label for="release-date" class="text-sm font-medium">Release Date</Label>
			<Popover.Root>
			  <Popover.Trigger>
				{#snippet child({ props })}
				  <Button
					variant="outline"
					class={cn(
					  "w-full justify-start text-left font-normal",
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
		  
		  <div class="space-y-2 sm:col-span-2">
			<Label for="release-description" class="text-sm font-medium">Description</Label>
			<Input
			  id="release-description"
			  type="text"
			  placeholder="a description of your work, only if you wish to provide :)"
			  bind:value={releaseDescription}
			/>
		  </div>
		  
		  <div class="space-y-2 sm:col-span-2">
			<Label for="release-image" class="text-sm font-medium">Cover Artwork</Label>
			<div class="flex items-center gap-4">
			  <div class="bg-muted relative h-24 w-24 rounded-md border overflow-hidden flex items-center justify-center">
				{#if releaseImage && releaseImage[0]}
				  <img 
					src={URL.createObjectURL(releaseImage[0])} 
					alt="Cover preview" 
					class="h-full w-full object-cover"
				  />
				{:else}
				  <ImageIcon class="text-muted-foreground h-8 w-8" />
				{/if}
			  </div>
			  <div class="flex-1">
				<Input 
				  id="release-image" 
				  type="file" 
				  accept="image/*" 
				  bind:files={releaseImage} 
				/>
				<p class="text-xs text-muted-foreground mt-1">Recommended: 1400×1400 pixels, JPG or PNG</p>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	  
	  <!-- Track Info Section -->
	  <div class="bg-card rounded-lg p-6 shadow-sm border">
		<h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
		  <span class="bg-primary/10 p-2 rounded-full"><Music size={18} /></span>
		  Track Information
		</h2>
		
		<div class="grid gap-6 sm:grid-cols-2">
		  <div class="space-y-2 sm:col-span-2">
			<Label for="track-title" class="text-sm font-medium">Track Title</Label>
			<Input
			  id="track-title"
			  type="text"
			  placeholder="Title of your track"
			  bind:value={uploadTrackTitle}
			/>
		  </div>
		  
		  <div class="space-y-2 sm:col-span-2">
			<Label for="track-audio" class="text-sm font-medium">Audio File</Label>
			<div class="flex flex-col gap-2">
			  <Input 
				id="track-audio" 
				type="file" 
				accept="audio/*" 
				bind:files={uploadTrackAudio} 
			  />
			  <p class="text-xs text-muted-foreground">
				Accepted formats: MP3, WAV, FLAC (max 50MB)
			  </p>
			  
			  {#if uploadTrackAudio && uploadTrackAudio[0]}
				<div class="flex items-center p-2 bg-accent/50 rounded text-sm mt-1">
				  <Music class="mr-2 size-4 text-accent-foreground/70" />
				  <span class="truncate">{uploadTrackAudio[0].name}</span>
				  <span class="ml-auto text-xs text-muted-foreground">
					{(uploadTrackAudio[0].size / (1024 * 1024)).toFixed(2)} MB
				  </span>
				</div>
			  {/if}
			</div>
		  </div>
		</div>
	  </div>
	  
	  <div class="flex justify-end pt-4">
		<Button 
		  onclick={handleUpload} 
		  disabled={uploading} 
		  class="w-full sm:w-auto flex gap-2 items-center" 
		  size="lg"
		>
		  {#if uploading}
			<span class="animate-spin">↻</span>
			Uploading...
		  {:else}
			<Upload size={18} />
			Upload Release
		  {/if}
		</Button>
	  </div>
	</div>
  </div>