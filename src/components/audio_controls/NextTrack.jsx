import { TbPlayerSkipForwardFilled } from "react-icons/tb";

export default function NextTrack(props) {
    return (
        <button title="Next" onClick={props.nextTrack}>
            <TbPlayerSkipForwardFilled className="h-6 w-6 text-white" />
        </button>
    );
};
