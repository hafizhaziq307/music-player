<script>
    import { createEventDispatcher } from 'svelte';

    export let volume;
    export let currentColor;

    const dispatch = createEventDispatcher();
</script>

<div class="flex items-center gap-3 justify-self-end">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-volume h-7 w-7 text-white" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M15 8a5 5 0 0 1 0 8"  />
        <path d="M17.7 5a9 9 0 0 1 0 14"  />
        <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" fill="currentColor" />
    </svg>
    <input title={volume} min="0" max="100" type="range" on:input={(event) => dispatch('input', { volume: event.target.value })} value={volume} class="rounded-full h-1 cursor-pointer" style="accent-color: {currentColor.background};" />
</div>