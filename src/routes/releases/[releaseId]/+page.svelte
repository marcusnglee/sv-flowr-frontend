<script lang='ts'>
	import ReleaseHeader from '$lib/components/custom/releasePage/ReleaseHeader.svelte';
	import TrackList from '$lib/components/custom/releasePage/TrackList.svelte';
    import type {PageProps} from './$types';

    let {data}: PageProps = $props();
    let tracks = data.tracks;
    
</script>
<ReleaseHeader {data} />
<TrackList {tracks}/>
