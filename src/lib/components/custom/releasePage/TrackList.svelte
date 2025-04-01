<script lang='ts'>
    import { Clock } from 'lucide-svelte';
    import {Play} from 'lucide-svelte';
    function formatDuration(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    let {tracks} = $props();
</script>

<!-- Track list header -->
<div class="w-full mx-auto px-4">
    <div class="flex items-center py-3 border-b text-gray-500 text-sm font-medium">
        <div class="w-12 text-center">#</div>
        <div class="flex-grow">Title</div>
        <div class="w-20 flex justify-center items-center"><Clock size={16}/></div>
    </div>
    
    <!-- Track list -->
    {#each tracks as track, i}
        <div class="flex items-center py-3 hover:bg-gray-100 rounded-md group">
            <div class="w-12 text-center relative">
                <!-- Track number (visible when not hovered) -->
                <span class="text-gray-400 group-hover:hidden">{track.trackNumber}</span>
                
                <!-- Play button (visible on hover) -->
                <button onclick={console.log('hi')} class="absolute inset-0 hidden group-hover:flex items-center justify-center text-gray-700 hover:text-black">
                    <Play size={16}/>
                </button>
            </div>            <div class="flex-grow">
                <div class="font-medium">{track.title}</div>
            </div>
            <div class="flex items-center gap-4">
                
                <div class="w-16 text-center text-gray-500">{formatDuration(track.duration)}</div>
            </div>
        </div>
    {/each}
</div>