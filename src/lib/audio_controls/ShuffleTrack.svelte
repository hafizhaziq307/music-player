<script>
    export let shuffleTrack;
    export let isShuffling;
    export let currentColor;
    
    import { IconArrowsShuffle } from '@tabler/icons-svelte';
</script>

<button title="shuffle" on:click={shuffleTrack} style="background-color: {isShuffling ? currentColor.background : 'transparent'};" class="rounded-sm p-1" >
    <IconArrowsShuffle class="h-6 w-6" style="color: {isShuffling ? currentColor.text : '#fff'};"/>
</button>

