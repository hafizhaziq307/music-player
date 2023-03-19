import { TbPlayerSkipBackFilled } from "react-icons/tb";


export default function PreviousTrack(props) {
    return (
        <button title="Previous" onClick={props.previousTrack}>
            <TbPlayerSkipBackFilled className="h-6 w-6 text-white" />
        </button>
    );
};
