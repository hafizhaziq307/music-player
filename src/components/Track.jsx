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
                <svg
                    className="h-5 w-5 animate-spin"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                >
                    <path d="M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 224c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32zm-96 32c0 53 43 96 96 96s96-43 96-96s-43-96-96-96s-96 43-96 96zM96 240c0-35 17.5-71.1 45.2-98.8S205 96 240 96c8.8 0 16-7.2 16-16s-7.2-16-16-16c-45.4 0-89.2 22.3-121.5 54.5S64 194.6 64 240c0 8.8 7.2 16 16 16s16-7.2 16-16z" />
                </svg>
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
};
