<script>
    let {previousTrack} = $props();
    import { IconPlayerSkipBackFilled } from '@tabler/icons-svelte';
</script>

<button title="Previous Track" onclick={previousTrack}>
    <IconPlayerSkipBackFilled class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white"/>
</button>

