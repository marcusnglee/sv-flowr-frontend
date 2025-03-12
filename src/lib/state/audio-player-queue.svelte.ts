import { positiveMod } from '$lib/utils';

interface Track {
	id: number;
	src: string;
}

class AudioPlayerQueue {
	queue: Track[] = $state([]);
	queueIndex: number | null = $state(null);
	currentTrack = $derived(
		this.queue.length > 0 && this.queueIndex ? this.queue[this.queueIndex] : null
	);

	previous = () => {
		if (!this.queueIndex) {
			throw new Error();
		}
		this.queueIndex = positiveMod(this.queueIndex - 1, this.queue.length);
	};

	next = () => {
		if (!this.queueIndex) {
			throw new Error();
		}
		this.queueIndex = (this.queueIndex - 1) % this.queue.length;
	};
}

export const audioPlayerQueue = new AudioPlayerQueue();
