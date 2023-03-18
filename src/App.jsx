import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import { dialog } from "@tauri-apps/api";
import { audioDir } from "@tauri-apps/api/path";
import { useEffect, useRef, useState } from "react";
// import { Wave } from "@foobar404/wave";
import { prominent } from 'color.js';

import default_thumbnail from "./assets/img/default_thumbnail.png";
import { Track, WindowBar } from "./components";
import {
    AddTrack,
    NextTrack,
    PlayPauseTrack,
    PreviousTrack,
    Repeat,
    ShuffleTrack,
    Volume,
} from "./components/audio_controls";

function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [volume, setVolume] = useState(40);
    const [progress, setProgress] = useState(0);
    const [tracks, setTracks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTrack, setCurrentTrack] = useState({
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
        background: "#374151",
        text: "white",
    });

    const audioRef = useRef();
    const canvasRef = useRef();
    const currentTimeRef = useRef();
    const thumbnailRef = useRef();

    useEffect(() => {
        audioRef.current.volume = 0.01 * volume;
    }, [volume]); // setVolume

    useEffect(() => {
        if (!currentTrack.path) return;

        setProgress(0);
        audioRef.current.src = convertFileSrc(currentTrack.path);
        playTrack();
        updateCurrentIndex();

        prominent(thumbnailRef.current.src, { amount: 10 }).then(colors => {
            const color = extractColor(colors);
            setCurrentColor({
                background: color.vibrant,
                text: color.isDark ? "white" : "black",
            });
        })



    }, [currentTrack]); // setCurrentTrack

    useEffect(() => {
        if (!audioRef.current) return;

        displayAudioVisualizer();
    }, [audioRef.current]); // audio tag

    const extractColor = (colors) => {
        let mostVibrantColor;
        let maxSaturation = -1;

        for (let color of colors) {
            let r = color[0];
            let g = color[1];
            let b = color[2];

            // Calculate saturation
            let max = Math.max(r, g, b);
            let min = Math.min(r, g, b);
            let saturation = (max - min) / max;

            // Update most vibrant color if necessary
            if (saturation > maxSaturation) {
                maxSaturation = saturation;
                mostVibrantColor = color;
            }
        }

        const r = mostVibrantColor[0];
        const g = mostVibrantColor[1];
        const b = mostVibrantColor[2];

        const brightness = (299 * r + 587 * g + 114 * b) / 1000;
        const hexVibrant = `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`;

        return {
            vibrant: hexVibrant,
            isDark: brightness < 128
        };
    }

    const displayAudioVisualizer = () => {
        // const wave = new Wave(audioRef.current, canvasRef.current);
        // wave.addAnimation(
        //     new wave.animations.Lines({
        //         lineWidth: 4,
        //         lineColor: "white",
        //         count: 30,
        //         frequencyBand: "highs",
        //         glow: { color: "black", strength: 5 },
        //         rounded: true,
        //         center: true,
        //         mirroredY: false,
        //     })
        // );
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
            let promise = await invoke("get_metadata_files", {
                filename: path.replace(/^.*[\\\/]/, "").replace(".mp3", ""),
                path: path,
            });

            if (!isExist(tracks, promise))
                setTracks((prevTracks) => [...prevTracks, promise]);
        }
    };

    // check is track is exists in tracks
    const isExist = (arr, objectToSearch) => {
        return arr.find((item) => {
            return item.path === objectToSearch.path;
        });
    };

    const playPauseTrack = () => {
        if (!currentTrack.filename) return;

        !isPlaying ? playTrack() : pauseTrack();
    };

    // play track
    const playTrack = () => {
        if (!currentTrack.filename) return;

        audioRef.current.play();
        setIsPlaying(true);
    };

    // prev track
    const previousTrack = () => {
        if (!currentTrack.filename) return;

        let tempCurrentIndex = currentIndex;
        tempCurrentIndex--;
        if (tempCurrentIndex < 0) tempCurrentIndex = tracks.length - 1;

        setCurrentTrack(tracks[tempCurrentIndex]);
    };

    // loop track
    const loopTrack = () => {
        if (!currentTrack.filename) return;

        let tempIsLooping = !isLooping;
        setIsLooping(tempIsLooping);
        audioRef.current.loop = tempIsLooping;
    };

    const shuffleTrack = () => {
        if (!currentTrack.filename) return;

        setIsShuffling(!isShuffling);
    };

    // pause track
    const pauseTrack = () => {
        if (!currentTrack.filename) return;

        audioRef.current.pause();
        setIsPlaying(false);
    };

    // next track
    const nextTrack = () => {
        if (!currentTrack.filename) return;

        let tempCurrentIndex = currentIndex;
        tempCurrentIndex++;
        if (tempCurrentIndex > tracks.length - 1) tempCurrentIndex = 0;

        setCurrentTrack(tracks[tempCurrentIndex]);
    };

    const updateCurrentIndex = () => {
        let res = tracks.findIndex((element) => {
            if (element.path === currentTrack.path) return true;
        });

        if (res !== -1) setCurrentIndex(res);
    };

    // set progressbar position
    const seekTo = (event) => {
        if (!currentTrack.filename) return;

        const seekPosition = event.clientX / currentTimeRef.current.clientWidth;
        audioRef.current.currentTime = audioRef.current.duration * seekPosition;

        seekUpdate();
    };

    // update progressbar
    const seekUpdate = () => {
        if (!currentTrack.filename) return;

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
    const changeVolume = (event) => {
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
                    crossOrigin="anonymous"
                    hidden
                />

                <div className="grid h-full grid-cols-3 gap-3 p-3">
                    <section className=" grid place-content-center space-y-4 rounded-2xl">
                        <img
                            ref={thumbnailRef}
                            src={
                                !currentTrack.image.data
                                    ? default_thumbnail
                                    : `data:${currentTrack.image.mime_type};base64,${currentTrack.image.data}`
                            }
                            alt=""
                            className="mx-auto aspect-square w-[15rem] rounded-lg object-cover object-center lg:w-[20rem]"
                        />

                        <canvas
                            ref={canvasRef}
                            className="mx-auto h-[4rem] w-[15rem] lg:w-[20rem]"
                        ></canvas>
                    </section>

                    <section className="col-span-2 w-full space-y-4 rounded-2xl">
                        <header className="flex justify-between">
                            <div className="text-xl text-white">Playlist</div>
                            <AddTrack openDialog={openDialog} currentColor={currentColor} />
                        </header>

                        <div className="scrollbar-component h-[70vh] space-y-2 overflow-y-auto pr-3 lg:h-[75vh]">
                            {tracks.map((track, i) => (
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
                            {!currentTrack.title ? currentTrack.filename : currentTrack.title}
                        </div>
                        <div className="h-5 truncate text-xs font-medium text-white">
                            {!currentTrack.artist ? "-" : currentTrack.artist}
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
