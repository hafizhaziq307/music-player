import { appWindow } from "@tauri-apps/api/window";
import logo from "../assets/img/logo.png";
import { HiMinus, HiXMark, HiOutlineSquare2Stack } from "react-icons/hi2";
import { getVersion } from '@tauri-apps/api/app';
import { useState, useEffect } from "react";

export default function WindowBar() {
    const [appVersion, setAppVersion] = useState([]);

    useEffect(() => {
        const runAsyncFunc = async () => {
            setAppVersion(await getVersion());
        }
        runAsyncFunc();
    }, []);

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
                    <div className="text-[.6rem] font-light text-gray-400">{appVersion}</div>
                </div>
            </section>

            <section>
                <button
                    onClick={() => appWindow.minimize()}
                    className="px-3 py-2 hover:bg-gray-700"
                >
                    <HiMinus className="h-5 w-5 text-white" />
                </button>

                <button
                    onClick={() => appWindow.toggleMaximize()}
                    className="px-3 py-2 hover:bg-gray-700"
                >
                    <HiOutlineSquare2Stack className="h-5 w-5 -scale-x-100  text-white" />
                </button>

                <button
                    onClick={() => appWindow.close()}
                    className="px-3 py-2 hover:bg-red-600"
                >
                    <HiXMark className="h-5 w-5 text-white" />
                </button>
            </section>
        </header>
    );
}
