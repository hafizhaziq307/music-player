<script>
    export let shuffleTrack;
    export let isShuffling;
    export let currentColor;
</script>

<button title="shuffle" on:click={shuffleTrack} style="background-color: {isShuffling ? currentColor.background : 'transparent'};" class="rounded-sm p-1" >
    <i class="fa-solid fa-shuffle fa-lg" style="color: {isShuffling ? currentColor.text : '#fff'};"></i>
</button>

