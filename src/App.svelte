<script>
    import AddTrack from './lib/audio_controls/AddTrack.svelte';
    import NextTrack from './lib/audio_controls/NextTrack.svelte';
    import PlayPauseTrack from './lib/audio_controls/PlayPauseTrack.svelte';
    import PreviousTrack from './lib/audio_controls/PreviousTrack.svelte';
    import Repeat from './lib/audio_controls/Repeat.svelte';
    import ShuffleTrack from './lib/audio_controls/ShuffleTrack.svelte';
    import Volume from './lib/audio_controls/Volume.svelte';
    import Track from './lib/Track.svelte';

    import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
    import { open } from "@tauri-apps/api/dialog";
    import { audioDir } from "@tauri-apps/api/path";
    import { Svroller } from 'svrollbar'

    import logo from "./assets/img/logo.png";

    let audioElement;
    let thumbnailElement;
    
    let isPlaying = false;
    let isLooping = false;
    let isShuffling = false;
    let volume = 50;
    let progress = 0;
    let tracks = [];
    let currentIndex = 0;
    let currentTrack = {
        artist: "",
        filename: "",
        path: "",
        title: "",
        image: {
            data: "",
            mime_type: "",
        }, 
    };
    let currentColor = {
        background: "#374151",
        text: "white",
    };

    // track changes
    $: if (!isEmpty(currentTrack.path)) {
        progress = 0;
        audioElement.src = convertFileSrc(currentTrack.path);
        thumbnailElement.src = !currentTrack.image.data ? logo : `data:${currentTrack.image.mime_type};base64,${currentTrack.image.data}`

        playTrack();
        updateCurrentIndex();

        thumbnailElement.onload = function() {
            const vibrant = new Vibrant(thumbnailElement);
            const swatches = vibrant.swatches();

            const vibrantColor = swatches.Vibrant.getHex();
            const textColor = swatches.Vibrant.getBodyTextColor();

            currentColor = {
                background: vibrantColor,
                text: textColor,
            };
        };
    }

    // volume changes
    $: if (!isEmpty(audioElement)) {
        audioElement.volume = 0.01 * volume;
    }

    const openDialog = async () => {
        const paths = await open({
            filters: [
                {
                    name: "Mp3 file",
                    extensions: ["mp3"],
                },
            ],
            defaultPath: await audioDir(),
            multiple: true,
            directory: false,
        });

        if (isEmpty(paths)) {
            return;
        }

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];

            // get metadata
            let promise = await invoke("get_metadata_files", {
                filename: path.replace(/^.*[\\\/]/, "").replace(".mp3", ""),
                path: path,
            });

            if (!isExist(tracks, promise)) {
                tracks = [...tracks, promise];
            }
        }
    };

    // check is track is exists in tracks
    const isExist = (array, objectToSearch) => {
        return array.find(x => x.path === objectToSearch.path);
    };

    const playPauseTrack = () => {
        if (isEmpty(currentTrack.filename)) {
            return;
        }

        !isPlaying ? playTrack() : pauseTrack();
    };

    // play track
    const playTrack = () => {
        if (isEmpty(currentTrack.filename)) {
            return;
        }

        audioElement.play();
        isPlaying = true;
    };

    // prev track
    const previousTrack = () => {
        if (isEmpty(currentTrack.filename)) {
            return;
        }

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = tracks.length - 1;
        }

        currentTrack = tracks[currentIndex];
    };

    // loop track
    const loopTrack = () => {
        if (isEmpty(currentTrack.filename)) {
            return;
        }

        isLooping = !isLooping;
        audioElement.loop = isLooping;
    };

    const shuffleTrack = () => {
        if (isEmpty(currentTrack.filename)) {
            return;
        }

        isShuffling = !isShuffling;
    };

    // pause track
    const pauseTrack = () => {
        if (isEmpty(currentTrack.filename)) {
            return;
        }

        audioElement.pause();
        isPlaying = false;
    };

    // next track
    const nextTrack = () => {
        if (isEmpty(currentTrack.filename)) {
            return;
        }

        currentIndex++;
        
        if (currentIndex > tracks.length - 1) {
            currentIndex = 0;
        }

        currentTrack = tracks[currentIndex]; 
    };

    const updateCurrentIndex = () => {
        let res = tracks.findIndex((element) => {
            if (element.path === currentTrack.path) return true;
        });

        if (res !== -1) {
            currentIndex = res;
        }
    };

    // handle after audio ended
    const handleAudioEnded = () => {
        if (isShuffling) {
            const newIndex = Math.floor(Math.random() * tracks.length + 1);
            currentTrack = tracks[newIndex];
        } else {
            nextTrack();
        }
    };

    const handleInput = (event) => {
        if (isEmpty(currentTrack.filename)) {
            return;
        }

        const rangeValue = event.target.value;

        progress = rangeValue;
        audioElement.currentTime = (rangeValue / 100) * audioElement.duration;
    }

    const handleTimeUpdate = (event) => {
        if (isEmpty(currentTrack.filename)) {
            return;
        }

        const audioElement = event.target;

        let updatedProgress = (audioElement.currentTime / audioElement.duration) * 100;
        if (isNaN(updatedProgress)) {
            updatedProgress = 0;
        }

        progress = updatedProgress;
    }

    const isEmpty = (x) => {
        return [Object, Array].includes((x || {}).constructor) && !Object.entries((x || {})).length;
    }
</script>

<main class="flex min-h-screen flex-col justify-between overflow-hidden bg-[#141C24]">
    <audio controls bind:this={audioElement} on:ended={handleAudioEnded} on:timeupdate={handleTimeUpdate} crossOrigin="anonymous" hidden />

    <div class="grid grid-cols-3 gap-3 py-3 px-1 grow">
        <section class="grid place-content-center">
            <img bind:this={thumbnailElement} src="{logo}" alt="img" class="aspect-square w-[15rem] rounded-lg object-cover object-center lg:w-[20rem]" />
        </section>

        <section class="col-span-2 flex flex-col gap-4">
            <header class="flex justify-between">
                <div class="text-xl text-white">Playlist</div>
                <AddTrack {openDialog} {currentColor} />
            </header>

            <div class="grow track-list" style="--svrollbar-thumb-width: 10px; --svrollbar-thumb-background: {currentColor.background}; --svrollbar-thumb-opacity: 1;">
                <Svroller alwaysVisible={true} class="p-4" width="1" height="77vh" margin={{ right: 4 }}>
                <div class="pr-6 space-y-2">
                    {#each tracks as track, i}
                        <Track on:click={() => currentTrack = track} {currentTrack} {track} {currentColor} {i} />
                    {/each}
                </div>
                </Svroller>
            </div>
        </section>
    </div>

    <footer class="h-[5rem] w-full bg-[#141820]">
        <input type="range" title={progress} step={0.00001} min="0" max="100" value={progress} on:input={handleInput} class="rounded-full h-1.5 outline-none cursor-pointer w-full block" style="accent-color: {currentColor.background};" />

        <section class="grid h-full grid-cols-3 items-center gap-4 px-3">
            <div>
                <div class="truncate text-lg font-light text-white">
                    {!currentTrack.title ? currentTrack.filename : currentTrack.title}
                </div>
                <div class="h-5 truncate text-xs font-medium text-white">
                    {!currentTrack.artist ? "-" : currentTrack.artist}
                </div>
            </div>

            <div class="flex items-center justify-center gap-x-10">
                <Repeat {isLooping} {loopTrack} {currentColor} />

                <PreviousTrack {previousTrack} />

                <PlayPauseTrack {playPauseTrack} {isPlaying} />

                <NextTrack {nextTrack} />

                <ShuffleTrack {shuffleTrack} {isShuffling} {currentColor} />
            </div>

            <Volume on:input="{(event) => volume = event.detail.volume }" {volume} {currentColor} />
        </section>
    </footer>
</main>