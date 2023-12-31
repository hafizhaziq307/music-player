<script>
    export let isPlaying;
    export let playPauseTrack;
</script>

<button title={isPlaying ? "Pause" : "Play"} on:click={playPauseTrack}>
    {#if isPlaying}
    <i class="fa-solid fa-pause fa-xl text-white"></i>
    {:else}
    <i class="fa-solid fa-play fa-xl text-white"></i>
    {/if}
</button>