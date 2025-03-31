<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { audioPlayerQueue } from '$lib/state/audio-player-queue.svelte';
	import { formatTime } from '$lib/utils';
	import Play from 'lucide-svelte/icons/play';
	import Pause from 'lucide-svelte/icons/pause';
	import { SkipBack, SkipForward } from 'lucide-svelte';
	import StreamSuiInfo from './StreamSuiInfo.svelte';

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

<div class='flex items-center justify-between w-full py-2 px-4'>
	<div class='w-1/4'>
		<!-- Optional left-side content -->
	</div>
	<!--Play controls-->
	<div class='flex items-center justify-center gap-0.5'>
		<Button variant='ghost' class='text-gray-500 hover:text-gray-700 hover:bg-transparent'>
			<SkipBack onclick={audioPlayerQueue.playPrevious} />
		</Button>
		<Button class='bg-sunglow hover:bg-yellow-300 rounded-full'>
			{#if isPlaying}
				<Pause onclick={pause} />
			{:else}
				<Play onclick={play}/>

			{/if}
		</Button>
		<Button variant='ghost' class='text-gray-500 hover:text-gray-700 hover:bg-transparent'>
			<SkipForward onclick={audioPlayerQueue.playNext} />
		</Button>
	</div>
	<!--Right section-->
	<div class='w-1/4 flex justify-end items-center'>
		<StreamSuiInfo/>
	</div>
</div>
<div class=''>

</div>

<audio
	src={audioPlayerQueue.currentTrack?.src ?? ''}
	bind:this={audioElement}
	bind:currentTime
	bind:volume
	onloadedmetadata={() => (duration = audioElement.duration)}
	onended={audioPlayerQueue.playNext}
></audio>
