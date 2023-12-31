<script>
    export let currentColor;
    export let openDialog;
</script>

<button title="Add Mp3" on:click={openDialog} class="rounded-sm py-0.5 px-2" style="background-color: {currentColor.background};">
    <i class="fa-solid fa-plus fa-lg" style="color: {currentColor.text};"></i>
</button>
