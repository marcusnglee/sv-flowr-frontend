<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { audioPlayerQueue } from '$lib/state/audio-player-queue.svelte';
	import { formatTime } from '$lib/utils';
	import Play from 'lucide-svelte/icons/play';
	import Pause from 'lucide-svelte/icons/pause';

	let audioElement: HTMLAudioElement;

	let duration = $state(0);
	let currentTime = $state(0);
	let volume = $state(1);
	let isPlaying = $state(false);

	const play = () => {
		isPlaying = true;
		audioElement.play();
	};
	const pause = () => {
		isPlaying = false;
		audioElement.pause();
	};
</script>

<div>
	<Button>
		{#if isPlaying}
			<Play onclick={play} />
		{:else}
			<Pause onclick={pause} />
		{/if}
	</Button>
	{formatTime(duration)}
</div>

<audio
	src={audioPlayerQueue.currentTrack?.src ?? ''}
	bind:this={audioElement}
	bind:currentTime
	bind:volume
	onloadedmetadata={() => (duration = audioElement.duration)}
	onended={audioPlayerQueue.next}
></audio>
