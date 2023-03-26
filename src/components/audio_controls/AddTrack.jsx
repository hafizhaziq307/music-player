import { TbPlus } from "react-icons/tb";

export default function AddTrack(props) {
    return (
        <button
            title="Add Mp3"
            className="rounded-sm py-1 px-1.5"
            style={{ backgroundColor: props.currentColor.background }}
            onClick={props.openDialog}
        >
            <TbPlus className="h-5 w-5" style={{ color: props.currentColor.text }} />
        </button>
    );
};
