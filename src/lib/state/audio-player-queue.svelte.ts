interface Track {
	id: number;
	src: string;
}

class AudioPlayerQueue {
	// The main queue of tracks
	queue: Track[] = $state([]);

	// History of played tracks
	history: Track[] = $state([]);

	// Current track being played
	currentTrack: Track | null = $state(null);

	// Add a track or tracks to the queue
	addLast(tracks: Track[]) {
		this.queue.push(...tracks);
	}

	// Add a track to play next (at the beginning of the queue)
	addNext(tracks: Track[]) {
		this.queue.unshift(...tracks);
	}

	// Remove a track from the queue
	removeTrack(index: number) {
		if (index < 0 || index >= this.queue.length) {
			return;
		}
		this.queue.splice(index, 1);
	}

	// Clear the queue
	clearQueue() {
		this.queue = [];
	}

	// Play the next track in the queue
	playNext() {
		if (this.queue.length === 0) {
			return;
		}

		// If there's a current track, add it to history
		if (this.currentTrack) {
			this.history.push(this.currentTrack);
		}

		// Get the next track from the queue and remove it
		const nextTrack = this.queue.shift();
		this.currentTrack = nextTrack || null;
	}

	// Play the previous track from history
	playPrevious() {
		if (this.history.length === 0) {
			return;
		}

		// If there's a current track, add it back to the start of the queue
		if (this.currentTrack) {
			this.queue.unshift(this.currentTrack);
		}

		// Get the last track from history
		const previousTrack = this.history.pop();
		this.currentTrack = previousTrack || null;
	}

	// Play a specific track immediately
	playTrack(track: Track) {
		// If there's a current track, add it to history
		if (this.currentTrack) {
			this.history.push(this.currentTrack);
		}

		this.currentTrack = track;
	}

	// Get the current queue length
	get queueLength() {
		return this.queue.length;
	}

	// Get the history length
	get historyLength() {
		return this.history.length;
	}
}

export const audioPlayerQueue = new AudioPlayerQueue();
