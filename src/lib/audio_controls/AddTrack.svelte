<script>
    export let currentColor;
    export let openDialog;

    import { IconPlus } from '@tabler/icons-svelte';
</script>

<button title="Add Mp3" on:click={openDialog} class="rounded-sm py-0.5 px-1.5" style="background-color: {currentColor.background};">
    <IconPlus class="h-5 w-5" style="color: {currentColor.text};" />
</button>
