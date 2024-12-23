<script>
    let {loopTrack, isLooping, currentColor} = $props();
    import { IconRepeat } from '@tabler/icons-svelte';
</script>

<button title="Repeat" onclick={loopTrack} style="background-color: {isLooping ? currentColor.background : 'transparent'};" class="rounded-sm p-1">
    <IconRepeat class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" style="color: {isLooping ? currentColor.text : '#fff'};"/>
</button>
