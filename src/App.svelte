<script lang="ts">
  import Icon from "./lib/icons/Icon.svelte";
  import { dialog, invoke, window } from "@tauri-apps/api";
  import { appWindow } from "@tauri-apps/api/window";
  import { audioDir } from "@tauri-apps/api/path";
  import { convertFileSrc } from "@tauri-apps/api/tauri";
  import {
    musics,
    currentTrack,
    search,
    filteredMusics,
  } from "./lib/stores/music.js";

  // init variables
  let isPlaying: bool = false,
    isLoop: bool = false,
    isShow: bool = true,
    isPin: bool = false,
    val: string,
    currentIndex: number = 0,
    progress: number = 0,
    audioTag,
    currentTimeTag;

  $: search.set(val);

  // play & pause track
  function playPauseTrack(): void {
    if (Object.entries($currentTrack).length === 0) return;

    !isPlaying ? playTrack() : pauseTrack();
  }

  // play track
  function playTrack(): void {
    if (Object.entries($currentTrack).length === 0) return;

    audioTag.play();
    isPlaying = true;
  }

  // pause track
  function pauseTrack(): void {
    if (Object.entries($currentTrack).length === 0) return;

    audioTag.pause();
    isPlaying = false;
  }

  // loop track
  function loopTrack() {
    if (Object.entries($currentTrack).length === 0) return;

    isLoop = !isLoop;
    audioTag.loop = isLoop;
  }

  // next track
  function nextTrack() {
    if (Object.entries($currentTrack).length === 0) return;

    currentIndex++;

    if (currentIndex > $musics.length - 1) {
      currentIndex = 0;
    }

    setCurrentTrack($musics[currentIndex]);
  }

  // prev track
  function previousTrack() {
    if (Object.entries($currentTrack).length === 0) return;

    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = $musics.length - 1;
    }

    setCurrentTrack($musics[currentIndex]);
  }

  // set current track
  function setCurrentTrack(music) {
    progress = 0;
    currentTrack.set(music);
    audioTag.src = convertFileSrc(music.path);
    playTrack();
    setCurrentIndex();
  }

  // open dialog
  async function openDialog(): void {
    const paths = await dialog.open({
      filters: [
        {
          name: "Mp3 file",
          extensions: ["mp3"],
          defaultPath: await audioDir(),
        },
      ],
      multiple: true,
      directory: false,
    });

    if (paths === null) return;

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      // get metadata
      let promise = await invoke("get_metadata_files", {
        filename: path.replace(/^.*[\\\/]/, "").replace(".mp3", ""),
        path: path,
      });

      // check track exist & add track
      const isExist: bool = $musics.find((item) => {
        return item.path === promise.path;
      });
      if (!isExist) $musics = [...$musics, promise];
    }

    // set currentTrack immediately, if first time upload it
    if (Object.entries($currentTrack).length === 0) {
      setCurrentTrack($musics[0]);
    }

    setCurrentIndex();
  }

  // set always-on-top
  async function setPin(): void {
    isPin = !isPin;
    await appWindow.setAlwaysOnTop(isPin);
  }

  // toggle playlist
  async function togglePlaylist(): void {
    isShow = !isShow;

    if (isShow) {
      await appWindow.setPosition(new window.LogicalPosition(1125, 130));
      await appWindow.setSize(new window.LogicalSize(400, 655));
    } else {
      await appWindow.setPosition(new window.LogicalPosition(1125, 640));
      await appWindow.setSize(new window.LogicalSize(400, 150));
    }
  }

  // set progressbar position
  function seekTo(e): void {
    if (Object.entries($currentTrack).length === 0) return;

    let seekPosition = e.clientX / currentTimeTag.clientWidth;
    audioTag.currentTime = audioTag.duration * seekPosition;

    seekUpdate();
  }

  // update progressbar
  function seekUpdate(): void {
    if (Object.entries($currentTrack).length === 0) return;

    progress = (audioTag.currentTime / audioTag.duration) * 100;
  }

  // set index of current track
  function setCurrentIndex() {
    let res = $musics.findIndex((element) => {
      if (element.path === $currentTrack.path) return true;
    });

    if (res !== -1) currentIndex = res;
  }
</script>

<audio
  on:ended={() => nextTrack()}
  on:timeupdate={() => seekUpdate()}
  :paused={isPlaying}
  :loop={isLoop}
  bind:this={audioTag} />

<main class="mx-auto w-[25rem]">
  <header class="relative">
    <!-- cover art -->
    {#if Object.entries($currentTrack).length !== 0 && $currentTrack.image.data !== ""}
      <img
        src={`data:${$currentTrack.image.mime_type};base64,${$currentTrack.image.data}`}
        alt=""
        class="h-36 w-full object-cover object-center brightness-50" />
    {:else}
      <img
        src="./assets/default.jpg"
        alt=""
        class="h-36 w-full object-cover object-center brightness-50" />
    {/if}

    <!-- music control -->
    <div class="absolute top-0 left-0 h-full w-full">
      <!-- pin -->
      <button on:click={() => setPin()} class="absolute top-2 right-2">
        <Icon
          name="thumbtack"
          class="h-4 w-4 {isPin
            ? 'text-[#ffcc22]'
            : 'text-white hover:text-stone-100'} " />
      </button>

      <!-- title and artist -->
      <div class=" pt-3 text-center">
        <div class="truncate text-xl font-light text-white">
          <p>{$currentTrack.title ?? $currentTrack.filename ?? "-"}</p>
        </div>
        <div class="truncate text-xs font-bold text-white">
          <p>{$currentTrack.artist ?? "-"}</p>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 w-full">
        <!-- music controls -->
        <div class="flex items-center justify-between bg-black/40 p-2">
          <div class="flex items-center">
            <button on:click={() => loopTrack()}>
              <Icon
                name="rotate-right"
                class="h-5 w-5 {isLoop
                  ? 'text-[#ffcc22]'
                  : 'text-white hover:text-stone-100'}" />
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <button on:click={() => previousTrack()}>
              <Icon
                name="backward-step"
                class="h-6 w-6 text-white hover:text-stone-100" />
            </button>

            <!-- play & pause track -->
            <button on:click={() => playPauseTrack()}>
              {#if isPlaying}
                <Icon
                  name="circle-play"
                  class="h-8 w-8 text-white hover:text-stone-100" />
              {:else}
                <Icon
                  name="circle-pause"
                  class="h-8 w-8 text-white hover:text-stone-100" />
              {/if}
            </button>

            <button on:click={() => nextTrack()}>
              <Icon
                name="forward-step"
                class="h-6 w-6 text-white hover:text-stone-100" />
            </button>
          </div>

          <div class="flex items-center">
            <!-- bar -->
            <button on:click={() => togglePlaylist()}>
              <Icon
                name="bars"
                class="h-5 w-5  {isShow
                  ? 'text-[#ffcc22]'
                  : 'text-white hover:text-stone-100'}" />
            </button>
          </div>
        </div>

        <!-- progressbar -->
        <div
          class="h-1 w-full cursor-pointer bg-[#784c1d]/50"
          bind:this={currentTimeTag}
          on:click={(e) => seekTo(e)}>
          <div
            class="h-1 cursor-pointer bg-[#ffcc22]"
            style="width:{progress}%" />
        </div>
      </div>
    </div>
  </header>

  <!-- playlist -->
  {#if isShow}
    <div class="mt-3 w-full space-y-1 bg-[#333333] p-2">
      <!-- search -->
      <div
        class="flex items-center justify-between space-x-2 rounded-md bg-[#1f1f1f] py-1.5 px-2 focus-within:ring-1 focus-within:ring-[#ffcc22]">
        <input
          bind:value={val}
          type="text"
          placeholder="type to search"
          class="w-full border-none bg-transparent text-stone-300 focus:outline-none" />

        <Icon name="search" class="h-5 w-5 text-stone-300" />
      </div>

      <div class="flex justify-end">
        <!-- add -->
        <button
          on:click={() => openDialog()}
          class="px-1 text-xs font-bold text-stone-300 hover:text-[#ffcc22]"
          >Add</button>
      </div>

      <!-- line -->
      <div class="h-0.5 w-full bg-[#ffcc22]" />

      <!-- list -->
      <div
        class="h-[26rem] overflow-y-auto pl-2 scrollbar-thin scrollbar-thumb-stone-400">
        {#each $filteredMusics as music}
          <article
            class="flex cursor-pointer items-baseline space-x-2"
            on:click={() => setCurrentTrack(music)}>
            <div
              class="truncate text-sm {$currentTrack.path === music.path
                ? 'text-[#ffcc22]'
                : 'text-stone-300'} ">
              {music.title ?? music.filename}
            </div>
            <div class="truncate text-xs font-bold text-stone-400">
              {music.artist ?? ""}
            </div>
          </article>
        {/each}
      </div>
    </div>
  {/if}
</main>
