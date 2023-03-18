import { appWindow } from "@tauri-apps/api/window";
import logo from "../assets/img/logo.png";

export default function WindowBar() {
    return (
        <header
            data-tauri-drag-region
            className="flex items-center justify-between bg-gray-800"
        >
            <section className="flex items-center gap-3 px-2 py-0.5">
                <img
                    src={logo}
                    alt=""
                    className="aspect-square w-7 rounded ring-1 ring-gray-600"
                />
                <div>
                    <div className="text-[.8rem] text-white">Music Player</div>
                    <div className="text-[.6rem] font-light text-gray-400">0.2.1</div>
                </div>
            </section>

            <section>
                <button
                    onClick={() => appWindow.minimize()}
                    className="px-3 py-2 hover:bg-gray-700"
                >
                    <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 12h-15"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => appWindow.toggleMaximize()}
                    className="px-3 py-2 hover:bg-gray-700"
                >
                    <svg
                        className="h-5 w-5 -scale-x-100 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => appWindow.close()}
                    className="px-3 py-2 hover:bg-red-600"
                >
                    <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </section>
        </header>
    );
};
