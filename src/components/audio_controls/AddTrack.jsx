export default function AddTrack(props) {
    return (
        <button
            title="Add Mp3"
            className="rounded-sm py-1 px-2 text-xs"
            style={{ backgroundColor: props.currentColor.background }}
            onClick={props.openDialog}
        >
            <svg
                style={{ color: props.currentColor.text }}
                className="h-4 w-4"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
            >
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
        </button>
    );
};
