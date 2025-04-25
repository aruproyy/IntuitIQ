import { Redo2, Undo2 } from "lucide-react";
import { Button } from "./ui/button";

interface FooterProps {
    setReset: (reset: boolean) => void;
    undo: () => void;
    redo: () => void;
    runRoute: () => void;
    isFetching: boolean;
}

export default function Footer({ setReset, runRoute, undo, redo, isFetching }: FooterProps) {
    return (
        <div className="fixed flex bottom-0 right-0 justify-end items-center py-2 px-4 z-10 bg-gray-200 rounded-tl-2xl">
            <div className="flex gap-1 bg-gray-200 rounded overflow-hidden shadow-xl">
                <Button
                    onClick={undo}
                    className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"
                >
                    <Undo2 className="w-5 h-5" />
                </Button>
                <Button
                    onClick={redo}
                    className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"
                >
                    <Redo2 className="w-5 h-5" />
                </Button>
                <Button
                    onClick={() => setReset(true)}
                    className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"
                >
                    Reset
                </Button>
                <Button
                    onClick={runRoute}
                    disabled={isFetching}
                    className={`border-2 text-white ${isFetching ? "bg-gray-500 text-white cursor-not-allowed" : "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"}`}
                >
                    {isFetching ? "Fetching..." : "Run"}
                </Button>
            </div>
        </div>
    );
}