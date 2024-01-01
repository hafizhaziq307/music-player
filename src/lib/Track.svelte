<script>
    import { createEventDispatcher } from 'svelte';
    import { IconMusic } from '@tabler/icons-svelte';
    
    export let currentTrack;
    export let track;
    export let currentColor;
    export let i;
    export let isPlaying;

    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->

<article id ="music-{i}"
    style="{ currentTrack.path === track.path ? `background-color: ${currentColor.background}; color: ${currentColor.text};` : ''}"
    class="grid cursor-pointer grid-cols-12 items-center gap-2 rounded py-3 px-4 snap-center {currentTrack.path === track.path ? '' : 'text-white hover:bg-gray-800'}"
    on:click={() => dispatch('click')}>

    {#if currentTrack.path === track.path}
        <IconMusic class="h-6 w-6 {(isPlaying) ? 'animate-pulse' : '' }"/>
    {/if}

    <div class="{currentTrack.path === track.path ? '' : 'font-light'}">
        {(i + 1).toString().padStart(2, "0")}
    </div>

    <div class="truncate {currentTrack.path === track.path ? 'col-span-7' : 'col-span-8 font-light'}">
        {!track.title ? track.filename : track.title}
    </div>

    <div class="col-span-3 self-center truncate text-right text-xs {currentTrack.path === track.path ? '' : 'font-light'}">
        {track.artist ?? ''}
    </div>
</article>