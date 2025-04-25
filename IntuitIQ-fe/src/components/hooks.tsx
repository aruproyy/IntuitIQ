import { useState, useEffect } from "react";
import { Element } from "./types";

export const useHistory = (initialState: Element[]) => {
    const [index, setIndex] = useState(0);
    const [history, setHistory] = useState([initialState]);
    const setState = (action: Element[] | ((prev: Element[]) => Element[]), overwrite = false) => {
        const newState = typeof action === "function" ? action(history[index]) : action;
        if (overwrite) {
            const historyCopy = [...history];
            historyCopy[index] = newState;
            setHistory(historyCopy);
        } else {
            const updatedState = [...history].slice(0, index + 1);
            setHistory([...updatedState, newState]);
            setIndex((prevState) => prevState + 1);
        }
    };
    const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
    const redo = () => index < history.length - 1 && setIndex((prevState) => prevState + 1);
    return [history[index], setState, undo, redo] as const;
};

export const usePressedKeys = () => {
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { setPressedKeys((prevKeys) => new Set(prevKeys).add(event.key)) };
        const handleKeyUp = (event: KeyboardEvent) => {
            setPressedKeys((prevKeys) => {
                const updatedKeys = new Set(prevKeys);
                updatedKeys.delete(event.key);
                return updatedKeys;
            });
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => { window.removeEventListener("keydown", handleKeyDown); window.removeEventListener("keyup", handleKeyUp); };
    }, []);
    return pressedKeys;
};

export const useDrawingTools = () => {
    const [color, setColor] = useState("#ffffff");
    const [isEraser, setIsEraser] = useState(false);
    const [eraserSize, setEraserSize] = useState(5);
    const [brushSize, setBrushSize] = useState(5);
    return { color, setColor, isEraser, setIsEraser, eraserSize, setEraserSize, brushSize, setBrushSize };
};
