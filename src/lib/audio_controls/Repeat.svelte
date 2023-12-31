<script>
    export let loopTrack;
    export let isLooping;
    export let currentColor;
</script>

<button title="Repeat" on:click={loopTrack} style="background-color: {isLooping ? currentColor.background : 'transparent'};" class="rounded-sm p-1">
    <i class="fa-solid fa-repeat fa-lg" style="color: {isLooping ? currentColor.text : '#fff'};"></i>
</button>
