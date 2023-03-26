import { FaVolumeUp } from "react-icons/fa";

export default function Volume(props) {
    return (
        <div className="flex items-center gap-3 justify-self-end">
            <FaVolumeUp className="h-7 w-7 text-white" />
            <input
                title={props.volume}
                type="range"
                value={props.volume}
                max={100}
                min={0}
                onChange={props.changeVolume}
                className="h-1"
            />
        </div>
    );
};
