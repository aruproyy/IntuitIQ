import { Popover, Tooltip } from "@mantine/core";
import { ReactNode } from "react";
import { Tool } from '../components/types';

interface ToolButtonProps {
    tool: string;
    selectedTool: string | null;
    icon: JSX.Element;
    label: string;
    onClick: (tool: Tool) => void;
    children?: ReactNode;
    scale: number;
}

const ToolButton = ({ tool, selectedTool, icon, label, onClick, children, scale }: ToolButtonProps) => (
    <Popover opened={selectedTool === tool && tool !== "selection" && tool !== "text"} onClose={() => { }} position="right" withArrow={scale >= 0.9} zIndex={100}>
        <Popover.Target>
            <Tooltip label={label} position="right" withArrow>
                <div
                    style={{
                        display: "inline-block",
                        justifyItems: "center",
                        cursor: "pointer",
                        border: "2px solid #4F46E5",
                        borderRadius: "50%",
                        padding: "6px",
                        transition: "all 0.2s ease",
                        backgroundColor: selectedTool === tool ? "#4F46E5" : "#ffffff",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    onClick={() => onClick(tool as Tool)}
                >
                    {icon}
                </div>
            </Tooltip>
        </Popover.Target>
        {tool !== "selection" && tool !== "text" && (
            <Popover.Dropdown style={{ transform: `scale(${scale})`, transformOrigin: "bottom left", padding: "6px" }}>
                {children}
            </Popover.Dropdown>
        )}
    </Popover>
);

export default ToolButton;