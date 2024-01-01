<script>
    export let loopTrack;
    export let isLooping;
    export let currentColor;

    import { IconRepeat } from '@tabler/icons-svelte';
</script>

<button title="Repeat" on:click={loopTrack} style="background-color: {isLooping ? currentColor.background : 'transparent'};" class="rounded-sm p-1">
    <IconRepeat class="h-6 w-6" style="color: {isLooping ? currentColor.text : '#fff'};"/>
</button>
