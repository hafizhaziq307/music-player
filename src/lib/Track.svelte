<script>
    let {setCurrentTrack, currentTrack, track, currentColor, i, isPlaying} = $props();
    import { IconMusic } from '@tabler/icons-svelte';
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article id="music-{i}" onclick={setCurrentTrack}
    style="{ currentTrack.path === track.path ? `background-color: ${currentColor.background}; color: ${currentColor.text};` : ''}"
    class="select-none grid cursor-pointer grid-cols-12 items-center gap-2 rounded-md py-3 px-4 snap-start text-xs md:text-sm lg:text-base {currentTrack.path === track.path ? '' : 'text-white hover:bg-gray-800'}">

    {#if currentTrack.path === track.path}
        <IconMusic class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 {(isPlaying) ? 'animate-pulse' : '' }"/>
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