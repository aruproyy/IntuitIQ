import { Redo2, Undo2 } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface FooterProps {
    setReset: (reset: boolean) => void;
    undo: () => void;
    redo: () => void;
    runRoute: () => void;
    isSolving: boolean;
}

export default function Footer({ setReset, runRoute, undo, redo, isSolving }: FooterProps) {
    const [scale, setScale] = useState(1);
    const [padding, setPadding] = useState([4, 4]);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            const footerWidth = 50;
            const newScale = screenWidth < footerWidth ? Math.max(screenWidth / footerWidth, 0.4) : 1;
            setScale(newScale);
            let newPaddingX: number;
            let newPaddingY: number;
            if (screenWidth <= 540) {
                newPaddingX = 2;
                newPaddingY = 1;
            } else if (screenWidth >= 541 && screenWidth <= 800) {
                newPaddingX = 4;
                newPaddingY = 2;
            } else if (screenWidth >= 801 && screenWidth <= 1000) {
                newPaddingX = 6;
                newPaddingY = 3;
            } else {
                newPaddingX = 8;
                newPaddingY = 2;
            }
            setPadding([newPaddingX, newPaddingY]);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            className={`fixed flex bottom-0 right-0 justify-end items-center px-${padding[0]} py-${padding[1]} z-10 bg-gray-200 rounded-tl-2xl`}
            style={{ transform: `scale(${scale})`, transformOrigin: "bottom right", transition: 'transform 0.2s ease' }}
        >
            <div className="flex gap-1 bg-gray-200 rounded overflow-hidden shadow-xl">
                <Button
                    onClick={undo}
                    className={`bg-white border-2 px-${padding[0]} py-${padding[1]} border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-105`}
                >
                    <Undo2 className="w-5 h-5" />
                </Button>
                <Button
                    onClick={redo}
                    className={`bg-white border-2 px-${padding[0]} py-${padding[1]} border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-105`}
                >
                    <Redo2 className="w-5 h-5" />
                </Button>
                <Button
                    onClick={() => setReset(true)}
                    className={`bg-white border-2 px-${padding[0]} py-${padding[1]} border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-105`}
                    style={{ fontSize: `${12 * scale}px` }}
                >
                    Reset
                </Button>
                <Button
                    onClick={runRoute}
                    disabled={isSolving}
                    className={`border-2 text-white px-${padding[0]} py-${padding[1]} ${isSolving ? "bg-gray-500 text-white cursor-not-allowed" : "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-105"}`}
                    style={{ fontSize: `${12 * scale}px` }}
                >
                    {isSolving ? "Solving..." : "Solve"}
                </Button>
            </div>
        </div>
    );
}
