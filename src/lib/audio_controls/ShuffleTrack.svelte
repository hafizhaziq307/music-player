<script>
    let {shuffleTrack, isShuffling, currentColor} = $props();
    import { IconArrowsShuffle } from '@tabler/icons-svelte';
</script>

<button title="shuffle" onclick={shuffleTrack} style="background-color: {isShuffling ? currentColor.background : 'transparent'};" class="rounded-sm p-1" >
    <IconArrowsShuffle class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" style="color: {isShuffling ? currentColor.text : '#fff'};"/>
</button>

