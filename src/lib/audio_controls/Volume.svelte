<script>
    let {volume, currentColor, oninput} = $props();
    import { IconVolume } from '@tabler/icons-svelte';
</script>

<div class="flex items-center gap-3 justify-self-end">
    <IconVolume class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
    <input title={volume} min="0" max="100" type="range" value={volume} oninput={oninput} class="h-1 cursor-pointer rounded-full w-10 md:w-5" style="accent-color: {currentColor.background};" />
</div>