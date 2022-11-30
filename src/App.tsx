import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import { dialog } from "@tauri-apps/api";
import { audioDir } from "@tauri-apps/api/path";
import { useEffect, useRef, useState } from "react";
import { FastAverageColor } from "fast-average-color";

import { isEmpty } from "./helpers";
import default_thumbnail from "./assets/img/default_thumbnail.png";
import { WindowBar } from "./components/WindowBar";
import { Track } from "./components/Track";
import { Volume } from "./components/audio_controls/Volume";
import { ShuffleTrack } from "./components/audio_controls/ShuffleTrack";
import { NextTrack } from "./components/audio_controls/NextTrack";
import { PreviousTrack } from "./components/audio_controls/PreviousTrack";
import { Repeat } from "./components/audio_controls/Repeat";
import { AddTrack } from "./components/audio_controls/AddTrack";
import { PlayPauseTrack } from "./components/audio_controls/PlayPauseTrack";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [volume, setVolume] = useState(40);
  const [progress, setProgress] = useState(0);
  const [tracks, setTracks] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState<any>(0);
  const [currentTrack, setCurrentTrack] = useState<any>({
    artist: "",
    filename: "",
    path: "",
    title: "",
    image: {
      data: "",
      mime_type: "",
    },
  });
  const [currentColor, setCurrentColor] = useState({
    background: "",
    text: "",
  });

  const audioRef: any = useRef();
  const currentTimeRef: any = useRef();
  const thumbnailRef: any = useRef();

  useEffect(() => {
    audioRef.current.volume = 0.01 * volume;
  }, [volume]);

  useEffect(() => {
    setProgress(0);
    audioRef.current.src = convertFileSrc(currentTrack.path);
    playTrack();
    updateCurrentIndex();

    getDominantColor(thumbnailRef.current);
  }, [currentTrack]); // setCurrentTrack

  const getDominantColor = (imgElement: any) => {
    const fac = new FastAverageColor();

    fac
      .getColorAsync(imgElement, { algorithm: "simple", mode: "precision" })
      .then((color) => {
        let textcolor = color.isDark ? "#fff" : "#000";
        setCurrentColor({
          background: color.hex,
          text: textcolor,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openDialog = async () => {
    const paths = await dialog.open({
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

    if (paths === null) return;

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      // get metadata
      let promise: any = await invoke("get_metadata_files", {
        filename: path.replace(/^.*[\\\/]/, "").replace(".mp3", ""),
        path: path,
      });

      if (!isExist(tracks, promise))
        setTracks((prevTracks: any) => [...prevTracks, promise]);
    }
  };

  // check is track is exists in tracks
  const isExist = (arr: any, objectToSearch: any) => {
    return arr.find((item: any) => {
      return item.path === objectToSearch.path;
    });
  };

  const playPauseTrack = () => {
    if (currentTrack.filename === "") return;

    !isPlaying ? playTrack() : pauseTrack();
  };

  // play track
  const playTrack = () => {
    if (currentTrack.filename === "") return;

    audioRef.current.play();
    setIsPlaying(true);
  };

  // prev track
  const previousTrack = () => {
    if (currentTrack.filename === "") return;

    let tempCurrentIndex = currentIndex;
    tempCurrentIndex--;
    if (tempCurrentIndex < 0) tempCurrentIndex = tracks.length - 1;

    setCurrentTrack(tracks[tempCurrentIndex]);
  };

  // loop track
  const loopTrack = () => {
    if (currentTrack.filename === "") return;

    let tempIsLooping = !isLooping;
    setIsLooping(tempIsLooping);
    audioRef.current.loop = tempIsLooping;
  };

  const shuffleTrack = () => {
    if (currentTrack.filename === "") return;

    setIsShuffling(!isShuffling);
  };

  // pause track
  const pauseTrack = () => {
    if (currentTrack.filename === "") return;

    audioRef.current.pause();
    setIsPlaying(false);
  };

  // next track
  const nextTrack = () => {
    if (currentTrack.filename === "") return;

    let tempCurrentIndex = currentIndex;
    tempCurrentIndex++;
    if (tempCurrentIndex > tracks.length - 1) tempCurrentIndex = 0;

    setCurrentTrack(tracks[tempCurrentIndex]);
  };

  const updateCurrentIndex = () => {
    let res = tracks.findIndex((element: any) => {
      if (element.path === currentTrack.path) return true;
    });

    if (res !== -1) setCurrentIndex(res);
  };

  // set progressbar position
  const seekTo = (event: any) => {
    if (currentTrack.filename === "") return;

    const seekPosition = event.clientX / currentTimeRef.current.clientWidth;
    audioRef.current.currentTime = audioRef.current.duration * seekPosition;

    seekUpdate();
  };

  // update progressbar
  const seekUpdate = () => {
    if (currentTrack.filename === "") return;

    setProgress(
      (audioRef.current.currentTime / audioRef.current.duration) * 100
    );
  };

  // handle after audio ended
  const handleAudioEnded = () => {
    if (isShuffling) {
      const newIndex = Math.floor(Math.random() * tracks.length + 1);
      setCurrentTrack(tracks[newIndex]);
    } else {
      nextTrack();
    }
  };

  // change volume
  const changeVolume = (event: any) => {
    setVolume(event.target.value);
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-between overflow-hidden rounded-xl bg-[#141C24]">
      <WindowBar />

      <main>
        <audio
          controls
          ref={audioRef}
          onEnded={handleAudioEnded}
          onTimeUpdate={seekUpdate}
          hidden
        />

        <div className="grid h-full grid-cols-3 gap-3 p-3">
          <section className="grid  place-content-center rounded-2xl">
            <img
              ref={thumbnailRef}
              src={
                isEmpty(currentTrack.image.data)
                  ? default_thumbnail
                  : `data:${currentTrack.image.mime_type};base64,${currentTrack.image.data}`
              }
              alt=""
              className="aspect-square w-[15rem] rounded-lg object-cover object-center lg:w-[20rem]"
            />
          </section>

          <section className="col-span-2 w-full space-y-4 rounded-2xl">
            <header className="flex justify-between">
              <div className="text-xl text-white">Playlist</div>
              <AddTrack openDialog={openDialog} currentColor={currentColor} />
            </header>

            {/* <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg bg-[#282C3C] px-4 py-2 text-white"
              />
              <svg
                className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-white"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" />
              </svg>
            </div> */}

            <div className="h-[70vh] space-y-2 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-700 lg:h-[75vh]">
              {tracks.map((track: any, i: number) => (
                <Track
                  key={track.filename}
                  currentTrack={currentTrack}
                  track={track}
                  currentColor={currentColor}
                  i={i}
                  setCurrentTrack={setCurrentTrack}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="h-[5rem] w-full bg-[#141820]">
        <div
          style={{ backgroundColor: currentColor.text }}
          className="relative h-1 w-full cursor-pointer"
          ref={currentTimeRef}
          onClick={seekTo}
        >
          <div
            style={{
              width: progress + "%",
              backgroundColor: currentColor.background,
            }}
            className="absolute top-0 h-full"
          ></div>
        </div>

        <section className="grid h-full grid-cols-3 items-center gap-4 px-3">
          <div>
            <div className="truncate text-lg font-light text-white">
              {isEmpty(currentTrack.title)
                ? currentTrack.filename
                : currentTrack.title}
            </div>
            <div className="h-5 truncate text-xs font-medium text-white">
              {isEmpty(currentTrack.artist) ? "-" : currentTrack.artist}
            </div>
          </div>

          <div className="flex items-center justify-center gap-8">
            <Repeat
              isLooping={isLooping}
              loopTrack={loopTrack}
              currentColor={currentColor}
            />

            <PreviousTrack previousTrack={previousTrack} />

            <PlayPauseTrack
              playPauseTrack={playPauseTrack}
              isPlaying={isPlaying}
            />

            <NextTrack nextTrack={nextTrack} />

            <ShuffleTrack
              shuffleTrack={shuffleTrack}
              isShuffling={isShuffling}
              currentColor={currentColor}
            />
          </div>

          <Volume changeVolume={changeVolume} volume={volume} />
        </section>
      </footer>
    </div>
  );
}

export default App;
