import { TbArrowsShuffle } from "react-icons/tb";

export default function ShuffleTrack(props) {
    return (
        <button
            title="shuffle"
            onClick={props.shuffleTrack}
            style={{
                backgroundColor: props.isShuffling
                    ? props.currentColor.background
                    : "transparent",
            }}
            className="rounded-sm p-1"
        >
            <TbArrowsShuffle style={{
                color: props.isShuffling ? props.currentColor.text : "#fff",
            }} className="h-6 w-6" />
        </button>
    );
};
