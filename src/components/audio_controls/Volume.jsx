import { FaVolumeUp } from "react-icons/fa";

export default function Volume(props) {
    return (
        <div className="flex items-center gap-3 justify-self-end">
            <FaVolumeUp className="h-7 w-7 text-white" />
            <input title={props.volume} min={0} max={100} type="range" onChange={props.changeVolume} value={props.volume}
                className="rounded-full h-1 cursor-pointer"
                style={{ accentColor: `${props.currentColor.background}` }} />

            {/* <input title={props.volume} min={0} max={100} type="range" onChange={props.changeVolume} value={props.volume}
                className="rounded-full h-1 appearance-none outline-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${props.currentColor.background} ${props.volume}%, ${props.currentColor.text} 0px)`, accentColor: `${props.currentColor.background}` }} /> */}
        </div>
    );
};
