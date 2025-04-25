import { ColorPicker, Slider } from "@mantine/core";
import { Eraser, MousePointer2, Palette, PencilLine, Slash, Square, Circle, Type } from "lucide-react";
import { useEffect, useState } from "react";
import ToolButton from "./ToolButton";
import { Tool } from '../components/types';

interface ToolsProps {
    tool: Tool;
    setTool: (tool: Tool) => void;
    color: string;
    setColor: (color: string) => void;
    setIsEraser: (isEraser: boolean) => void;
    eraserSize: number;
    setEraserSize: (eraserSize: number) => void;
    brushSize: number;
    setBrushSize: (brushSize: number) => void;
}

export default function Tools({ tool, setTool, color, setColor, setIsEraser, eraserSize, setEraserSize, brushSize, setBrushSize }: ToolsProps) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const screenHeight = window.innerHeight;
            if (screenHeight < 511) {
                const newScale = Math.max(screenHeight / 511, 0.4);
                setScale(newScale);
            } else {
                setScale(1);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleToolSelect = (tool: Tool) => {
        if (['selection', 'line', 'rectangle', 'ellipse', 'pencil', 'text', 'eraser', 'color'].includes(tool)) {
            setTool(tool);
            setIsEraser(tool === 'eraser');
        }
    };

    return (
        <div
            className="absolute flex flex-col mx-2 my-32 bg-gray-200 p-2 gap-3 rounded-xl z-10"
            style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
            <ToolButton
                tool="selection"
                selectedTool={tool}
                icon={<MousePointer2 size={16} style={{ color: tool === "selection" ? "#ffffff" : "#4F46E5" }} />}
                label="Selection"
                onClick={handleToolSelect}
                scale={scale}
            />
            <ToolButton
                tool="color"
                selectedTool={tool}
                icon={<Palette size={16} style={{ color: tool === "color" ? "#ffffff" : "#4F46E5" }} />}
                label="Color"
                onClick={handleToolSelect}
                scale={scale}
            >
                <ColorPicker format="hex" size="xs" value={color} onChange={setColor} styles={{ wrapper: { width: 125, height: 125 } }} />
            </ToolButton>
            <ToolButton
                tool="pencil"
                selectedTool={tool}
                icon={<PencilLine size={16} style={{ color: tool === "pencil" ? "#ffffff" : "#4F46E5" }} />}
                label="Pencil"
                onClick={handleToolSelect}
                scale={scale}
            >
                <Slider color="indigo" size="xs" w={100} value={brushSize} onChange={setBrushSize} min={1} max={10} label={(value) => `Brush Size: ${value}`} />
            </ToolButton>
            <ToolButton
                tool="line"
                selectedTool={tool}
                icon={<Slash size={16} style={{ color: tool === "line" ? "#ffffff" : "#4F46E5" }} />}
                label="Line"
                onClick={handleToolSelect}
                scale={scale}
            >
                <Slider color="indigo" size="xs" w={100} value={brushSize} onChange={setBrushSize} min={1} max={10} label={(value) => `Brush Size: ${value}`} />
            </ToolButton>
            <ToolButton
                tool="rectangle"
                selectedTool={tool}
                icon={<Square size={16} style={{ color: tool === "rectangle" ? "#ffffff" : "#4F46E5" }} />}
                label="Rectangle"
                onClick={handleToolSelect}
                scale={scale}
            >
                <Slider color="indigo" size="xs" w={100} value={brushSize} onChange={setBrushSize} min={1} max={10} label={(value) => `Brush Size: ${value}`} />
            </ToolButton>
            <ToolButton
                tool="ellipse"
                selectedTool={tool}
                icon={<Circle size={16} style={{ color: tool === "ellipse" ? "#ffffff" : "#4F46E5" }} />}
                label="Ellipse"
                onClick={handleToolSelect}
                scale={scale}
            >
                <Slider color="indigo" size="xs" w={100} value={brushSize} onChange={setBrushSize} min={1} max={10} label={(value) => `Brush Size: ${value}`} />
            </ToolButton>
            <ToolButton
                tool="text"
                selectedTool={tool}
                icon={<Type size={16} style={{ color: tool === "text" ? "#ffffff" : "#4F46E5" }} />}
                label="Text"
                onClick={handleToolSelect}
                scale={scale}
            />
            <ToolButton
                tool="eraser"
                selectedTool={tool}
                icon={<Eraser size={16} style={{ color: tool === "eraser" ? "#ffffff" : "#4F46E5" }} />}
                label="Eraser"
                onClick={handleToolSelect}
                scale={scale}
            >
                <Slider color="indigo" size="xs" w={100} value={eraserSize} onChange={setEraserSize} min={1} max={10} label={(value) => `Eraser Size: ${value}`} />
            </ToolButton>
        </div>
    );
}