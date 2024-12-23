<script>
    let {isPlaying, playPauseTrack} = $props();

    import { IconPlayerPlayFilled, IconPlayerPauseFilled } from '@tabler/icons-svelte';
</script>

<button title={isPlaying ? "Pause" : "Play"} onclick={playPauseTrack}>
    {#if isPlaying}
    <IconPlayerPauseFilled class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />

    {:else}
    <IconPlayerPlayFilled class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
    {/if}
</button>