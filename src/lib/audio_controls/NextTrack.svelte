<script>
    export let nextTrack;

    import { IconPlayerSkipForwardFilled } from '@tabler/icons-svelte';
</script>

<button title="Next" on:click={nextTrack}>
    <IconPlayerSkipForwardFilled class="h-6 w-6 text-white"/>
</button>