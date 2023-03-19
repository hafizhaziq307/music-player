import { FaCompactDisc } from "react-icons/fa";

export default function Track(props) {
    return (
        <article
            style={
                props.currentTrack.path === props.track.path
                    ? {
                        backgroundColor: props.currentColor.background,
                        color: props.currentColor.text,
                    }
                    : {}
            }
            className={`grid cursor-pointer grid-cols-12 items-center gap-2 rounded-lg py-3 px-4 ${props.currentTrack.path === props.track.path
                    ? ""
                    : "text-white hover:bg-gray-800"
                }`}
            onClick={() => props.setCurrentTrack(props.track)}
        >
            <div hidden={props.currentTrack.path !== props.track.path}>
                <FaCompactDisc className="h-5 w-5 animate-spin" />
            </div>

            <div
                className={
                    props.currentTrack.path === props.track.path ? "" : "font-light"
                }
            >
                {(props.i + 1).toString().padStart(2, "0")}
            </div>

            <div
                className={`truncate ${props.currentTrack.path === props.track.path
                        ? "col-span-7"
                        : "col-span-8 font-light"
                    }`}
            >
                {!props.track.title ? props.track.filename : props.track.title}
            </div>

            <div
                className={`col-span-3 self-center truncate text-right text-xs ${props.currentTrack.path === props.track.path ? "" : "font-light"
                    }`}
            >
                {props.track.artist}
            </div>
        </article>
    );
}
