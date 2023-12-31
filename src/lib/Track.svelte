<script>
    import { createEventDispatcher } from 'svelte';

    export let currentTrack;
    export let track;
    export let currentColor;
    export let i;

    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->

<article id ="music-{i}"
    style="{ currentTrack.path === track.path ? `background-color: ${currentColor.background}; color: ${currentColor.text};` : ''}"
    class="grid cursor-pointer grid-cols-12 items-center gap-2 rounded py-3 px-4 snap-center {currentTrack.path === track.path ? '' : 'text-white hover:bg-gray-800'}"
    on:click={() => dispatch('click')} >

    {#if currentTrack.path === track.path}
    <div>
        <i class="fa-solid fa-compact-disc fa-lg text-white animate-spin"></i>
    </div>
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

<style>
    /* .fa-compact-disc {
        animation: .8s ease-in-out infinite spinner;
    }

    @keyframes spinner {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(1turn);
        }
    } */
</style>