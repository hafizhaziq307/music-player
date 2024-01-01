<script>
    export let previousTrack;
    
    import { IconPlayerSkipBackFilled } from '@tabler/icons-svelte';
</script>

<button title="Previous" on:click={previousTrack}>
    <IconPlayerSkipBackFilled class="h-6 w-6 text-white"/>
</button>

