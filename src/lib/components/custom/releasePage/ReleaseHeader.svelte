<script lang='ts'>
    import { audioPlayerQueue } from '$lib/state/audio-player-queue.svelte';
    let {data} = $props();
</script>

<div class='flex w-full bg-sunglow/20 h-1/3'>
    <img src={data.release.coverUrl} alt={data.release.title} class=" aspect-square object-cover p-6"/>
    <div class='py-6 flex flex-col h-full justify-between'>
        <div>
            <p class='lowercase text-sm'>{data.release.type}</p>
        </div>
        <!--bottom-->
        <div class='text-sm'>
            <p class='pb-8 font-bold text-6xl'>{data.release.title}</p>

            <p>by
                <a href="/artist/{data.release.Artist.id}" class='font-bold'>{data.release.artist.username}</a>
            </p>
            <div class='flex items-center justify-between mt-2'>
                <div class="flex-shrink-0">{data.release.genre} • {(data.release.releaseDate).getFullYear()}</div>
                                    
                <!-- Option 2: Use fixed margin -->
                <div class='flex gap-2 ml-10'>
                    <button onclick={audioPlayerQueue.playNext} class='px-4 py-1 bg-sunglow hover:bg-yellow-400 transition-colors'>Play</button>
                    <button class='bg-sunglow px-4 py-1 hover:bg-yellow-400 transition-colors'>Add to Queue</button>
                </div>
            </div>
        </div>
    </div>
</div>