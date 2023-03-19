import { TbPlayerPlayFilled, TbPlayerPauseFilled } from "react-icons/tb";


export default function PlayPauseTrack(props) {
    return (
        <button
            title={props.isPlaying ? "Pause" : "Play"} onClick={props.playPauseTrack}
        >

            {props.isPlaying ? (
                <TbPlayerPauseFilled className="h-8 w-8 text-white" />
            ) : (
                <TbPlayerPlayFilled className="h-8 w-8 text-white" />
            )}
        </button>
    );
};
