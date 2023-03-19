import { TbRepeat } from "react-icons/tb";

export default function Repeat(props) {
    return (
        <button
            title="Repeat"
            onClick={props.loopTrack}
            style={{
                backgroundColor: props.isLooping
                    ? props.currentColor.background
                    : "transparent",
            }}
            className="rounded-sm p-1"
        >
            <TbRepeat style={{
                color: props.isLooping ? props.currentColor.text : "#fff",
            }} className="h-6 w-6" />
        </button>
    );
};
