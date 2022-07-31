import { writable, derived } from "svelte/store";

export const search = writable("");
export const musics = writable([]);
export const filteredMusics = derived(
  [search, musics],
  ([$search, $musics]) => {
    // if search is empty
    if ($search === undefined) {
      return $musics;
    }

    return $musics.filter((x) => {
      return x.path.toLowerCase().includes($search.toLowerCase());
    });
  }
);

export const currentTrack = writable({});
