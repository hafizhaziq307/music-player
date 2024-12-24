<script>
    // @ts-nocheck
    import AddTrack from '../lib/audio_controls/AddTrack.svelte';
    import NextTrack from '../lib/audio_controls/NextTrack.svelte';
    import PlayPauseTrack from '../lib/audio_controls/PlayPauseTrack.svelte';
    import PreviousTrack from '../lib/audio_controls/PreviousTrack.svelte';
    import Repeat from '../lib/audio_controls/Repeat.svelte';
    import ShuffleTrack from '../lib/audio_controls/ShuffleTrack.svelte';
    import Volume from '../lib/audio_controls/Volume.svelte';
    import Track from '../lib/Track.svelte';

    import { convertFileSrc, invoke } from '@tauri-apps/api/core';
    import { open } from '@tauri-apps/plugin-dialog';
    import { audioDir } from '@tauri-apps/api/path';
    import { Svroller } from 'svrollbar';

    import '../assets/js/Vibrant.min.js';
    import anime from 'animejs';
    import { isTrackExist, isEmpty } from '../assets/js/utilities.js';
    import logo from '../assets/images/logo.webp';
    import {
        IconX,
        IconVolume,
        IconSettings,
        IconBrandGithub,
        IconVolume3,
    } from '@tabler/icons-svelte';
    /**
     * @type {HTMLAudioElement}
     */
    let audioElement;
    /**
     * @type {HTMLImageElement}
     */
    let thumbnailElement;
    let isPlaying = $state(false);
    let isLooping = $state(false);
    let isShuffling = $state(false);
    let volume = $state(50);
    let progress = $state(0);
    /**
     * @type {any[]}
     */
    let tracks = $state([]);
    let currentIndex = $state(undefined);
    let currentTrack = $state({
        artist: null,
        filename: null,
        path: null,
        title: null,
        image: {
            data: null,
            mime_type: null,
        },
    });
    let currentColor = $state({
        background: '#374151',
        text: 'white',
    });
    let sidebar;
    let sidebarOverlay;
    let sidebarContent;

    // sidebar init
    $effect(() => {
        sidebarContent.style.opacity = 0;
        sidebarContent.style.transform = 'translateX(-100%)';
    });

    // volume changes
    $effect(() => {
        audioElement.volume = 0.01 * volume;
    });

    // track changes
    $effect(() => {
        if (!isEmpty(currentTrack.path)) {
            progress = 0;
            audioElement.src = convertFileSrc(currentTrack.path);
            updateThumbnail(currentTrack);
            $effect(() => updateCurrentIndex());
            updateMediaSession(currentTrack, thumbnailElement.src);
            playTrack();
        }
    });

    const updateThumbnail = (currentTrack) => {
        const thumbnail = currentTrack.image.data
            ? `data:${currentTrack.image.mime_type};base64,${currentTrack.image.data}`
            : logo;

        thumbnailElement.src = thumbnail;

        thumbnailElement.onload = function () {
            if (thumbnail == logo) {
                currentColor = {
                    background: '#374151',
                    text: 'white',
                };
                return;
            }

            const swatches = new Vibrant(thumbnailElement).swatches();
            currentColor = {
                background: swatches.Vibrant.getHex(),
                text: swatches.Vibrant.getBodyTextColor(),
            };
        };
    };

    const updateMediaSession = (currentTrack, src) => {
        new MediaMetadata({
            title: currentTrack.title ?? currentTrack.filename,
            artist: currentTrack.artist ?? '',
            artwork: [
                {
                    src: src,
                    sizes: '512x512',
                    type: !currentTrack.image.data
                        ? 'image/png'
                        : currentTrack.image.mime_type,
                },
            ],
        });
    };

    const openDialog = async () => {
        const paths = await open({
            filters: [
                {
                    name: 'Mp3 file',
                    extensions: ['mp3'],
                },
            ],
            defaultPath: await audioDir(),
            multiple: true,
            directory: false,
        });

        if (isEmpty(paths)) return;

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];

            // get metadata
            let promise = await invoke('get_metadata_files', {
                filename: path.replace(/^.*[\\\/]/, '').replace('.mp3', ''),
                path: path,
            });

            if (!isTrackExist(tracks, promise)) {
                tracks = [...tracks, promise];
            }
        }
    };

    const playPauseTrack = () => {
        if (isEmpty(currentTrack.filename)) return;
        !isPlaying ? playTrack() : pauseTrack();
    };

    const playTrack = () => {
        if (isEmpty(currentTrack.filename)) return;
        navigator.mediaSession.playbackState = 'playing';
        audioElement.play();
        isPlaying = true;
    };

    const pauseTrack = () => {
        if (isEmpty(currentTrack.filename)) return;
        navigator.mediaSession.playbackState = 'paused';
        audioElement.pause();
        isPlaying = false;
    };

    const previousTrack = () => {
        if (isEmpty(currentTrack.filename) || tracks.length <= 1) return;
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = tracks.length - 1;
        }
        currentTrack = tracks[currentIndex];
    };

    const nextTrack = () => {
        if (isEmpty(currentTrack.filename) || tracks.length <= 1) return;
        currentIndex++;
        if (currentIndex > tracks.length - 1) {
            currentIndex = 0;
        }
        currentTrack = tracks[currentIndex];
    };

    const shuffleTrack = () => {
        if (isEmpty(currentTrack.filename)) return;
        isShuffling = !isShuffling;
    };

    const loopTrack = () => {
        if (isEmpty(currentTrack.filename)) return;
        isLooping = !isLooping;
        audioElement.loop = isLooping;
    };

    const updateCurrentIndex = () => {
        const res = tracks.findIndex((x) => x.path === currentTrack.path);
        if (res !== -1) currentIndex = res;
    };

    // handle after audio ended
    const handleAudioEnded = () => {
        if (isShuffling) {
            const newIndex = Math.floor(Math.random() * tracks.length + 1);
            currentTrack = tracks[newIndex];
            return;
        }
        nextTrack();
    };

    const handleInput = (/** @type {{ target: { value: any; }; }} */ event) => {
        if (isEmpty(currentTrack.filename)) return;

        const rangeValue = event.target.value;

        progress = rangeValue;
        audioElement.currentTime = (rangeValue / 100) * audioElement.duration;
    };

    const handleTimeUpdate = (/** @type {{ target: any; }} */ event) => {
        if (isEmpty(currentTrack.filename)) return;

        const audioElement = event.target;

        let updatedProgress =
            (audioElement.currentTime / audioElement.duration) * 100;
        if (isNaN(updatedProgress)) updatedProgress = 0;

        progress = updatedProgress;
    };

    const openSidebar = () => {
        anime({
            targets: sidebarContent,
            opacity: 1,
            translateX: 0,
            duration: 250,
            easing: 'easeInOutCubic',
            begin: () => sidebar.classList.remove('hidden'),
        });
    };

    const closeSidebar = () => {
        anime({
            targets: sidebarContent,
            opacity: 0,
            translateX: '-100%',
            duration: 250,
            easing: 'easeInOutCubic',
            complete: () => sidebar.classList.add('hidden'),
        });
    };

    navigator.mediaSession.setActionHandler('play', () => playPauseTrack());
    navigator.mediaSession.setActionHandler('pause', () => playPauseTrack());
    navigator.mediaSession.setActionHandler('previoustrack', () =>
        previousTrack(),
    );
    navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
</script>

<audio
    controls
    bind:this={audioElement}
    onended={handleAudioEnded}
    ontimeupdate={handleTimeUpdate}
    crossOrigin="anonymous"
    hidden
    tabindex="-1"
></audio>

<main class="flex min-h-screen w-screen flex-col justify-between bg-[#141C24]">
    <div class="grid flex-grow grid-cols-3 gap-2">
        <div class="mx-auto content-center pl-2">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img
                bind:this={thumbnailElement}
                src={logo}
                alt="img"
                class="aspect-square w-[15rem] cursor-pointer select-none rounded-lg object-cover object-center lg:w-[20rem]"
                onclick={() => {
                    if (currentIndex !== undefined) {
                        document
                            .querySelector(`#music-${currentIndex}`)
                            .scrollIntoView();
                    }
                }}
            />

            <!-- Sidebar -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div bind:this={sidebar} class="hidden">
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    bind:this={sidebarOverlay}
                    class="fixed inset-0 z-10 bg-black/60"
                    onclick={closeSidebar}
                ></div>
                <!-- sidebar overlay -->
                <div
                    bind:this={sidebarContent}
                    class="fixed left-0 top-0 z-20 h-full w-60 bg-[#141820]"
                >
                    <!-- sidebar content -->
                    <header class="flex justify-between gap-2 p-2">
                        <a
                            title="Github"
                            href="https://github.com/hafizhaziq307/music-player"
                            target="_blank"
                        >
                            <IconBrandGithub
                                class="w-7 text-white md:h-7 lg:h-8 lg:w-8"
                            />
                        </a>

                        <button title="Close" onclick={closeSidebar}>
                            <IconX
                                class="w-7 text-white md:h-7 lg:h-8 lg:w-8"
                            />
                        </button>
                    </header>
                    <div class="p-6">
                        <div class="flex items-center gap-2">
                            {#if volume == 0}
                                <IconVolume3
                                    class="h-6 w-6 text-white md:h-7 md:w-7 lg:h-8 lg:w-8"
                                />
                            {:else}
                                <IconVolume
                                    class="h-6 w-6 text-white md:h-7 md:w-7 lg:h-8 lg:w-8"
                                />
                            {/if}
                            <input
                                min="0"
                                max="100"
                                type="range"
                                value={volume}
                                oninput={(event) => {
                                    volume = event.target.value;
                                }}
                                class="h-1 w-full cursor-pointer rounded-full"
                                style="accent-color: {currentColor.background};"
                            />
                            <!-- volume = event.detail.volume -->
                        </div>
                    </div>
                </div>
            </div>
            <!-- End Sidebar -->
        </div>

        <div
            class="col-span-2"
            style="--svrollbar-thumb-width: 0.4rem; --svrollbar-thumb-background: {currentColor.background}; --svrollbar-thumb-opacity: 1;"
        >
            <Svroller
                alwaysVisible={true}
                width="1"
                height="85vh"
                margin={{ right: 4 }}
            >
                <div
                    class="snap-y snap-mandatory scroll-py-4 space-y-4 py-4 pr-4"
                >
                    {#each tracks as track, i}
                        <Track
                            setCurrentTrack={() => (currentTrack = track)}
                            {currentTrack}
                            {track}
                            {currentColor}
                            {i}
                            {isPlaying}
                        />
                    {/each}
                </div>
            </Svroller>
        </div>
    </div>

    <footer>
        <input
            type="range"
            step="0.00001"
            min="0"
            max="100"
            value={progress}
            oninput={handleInput}
            class="h-1.5 w-full cursor-pointer rounded-full outline-none"
            style="accent-color: {currentColor.background};"
            tabindex="-1"
        />

        <section
            class="grid h-full grid-cols-4 items-center gap-4 bg-[#141820] px-3 py-2 lg:px-12"
        >
            <div>
                <div class="truncate text-lg font-light text-white">
                    {!currentTrack.title
                        ? currentTrack.filename
                        : currentTrack.title}
                </div>
                <div class="h-5 truncate text-xs font-medium text-white">
                    {!currentTrack.artist ? '-' : currentTrack.artist}
                </div>
            </div>

            <div
                class="col-span-2 flex items-center justify-center gap-6 lg:gap-10"
            >
                <Repeat {isLooping} {loopTrack} {currentColor} />
                <PreviousTrack {previousTrack} />
                <PlayPauseTrack {playPauseTrack} {isPlaying} />
                <NextTrack {nextTrack} />
                <ShuffleTrack {shuffleTrack} {isShuffling} {currentColor} />
            </div>

            <div class="flex justify-end gap-6 lg:gap-10">
                <AddTrack {openDialog} {currentColor} />

                <button title="Settings" onclick={openSidebar}>
                    <IconSettings
                        class="h-6 w-6 text-white md:h-7 md:w-7 lg:h-8 lg:w-8"
                    />
                </button>
            </div>
        </section>
    </footer>
</main>
