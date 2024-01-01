<script>
    export let isPlaying;
    export let playPauseTrack;

    import { IconPlayerPlayFilled, IconPlayerPauseFilled } from '@tabler/icons-svelte';
</script>

<button title={isPlaying ? "Pause" : "Play"} on:click={playPauseTrack}>
    {#if isPlaying}
    <IconPlayerPauseFilled class="h-8 w-8 text-white" />

    {:else}
    <IconPlayerPlayFilled class="h-8 w-8 text-white" />
    {/if}
</button>