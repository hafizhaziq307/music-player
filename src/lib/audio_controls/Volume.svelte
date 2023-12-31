<script>
    import { createEventDispatcher } from 'svelte';

    export let volume;
    export let currentColor;

    const dispatch = createEventDispatcher();
</script>

<div class="flex items-center gap-3 justify-self-end">
    <i class="fa-solid fa-volume-high fa-lg text-white"></i>
    <input title={volume} min="0" max="100" type="range" on:input={(event) => dispatch('input', { volume: event.target.value })} value={volume} class="rounded-full h-1 cursor-pointer" style="accent-color: {currentColor.background};" />
</div>