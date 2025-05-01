import { Popover, Tooltip } from "@mantine/core";
import { ReactNode, useState, useEffect } from "react";
import { Tool } from '../utilities/canvasTypes';

interface ToolButtonProps {
    tool: Tool;
    selectedTool: Tool | null;
    icon: JSX.Element;
    label: string;
    onClick: (tool: Tool) => void;
    children?: ReactNode;
    scale: number;
    showDropdown?: boolean;
    onDropdownToggle?: (tool: Tool, isOpen: boolean) => void;
}

const ToolButton = ({ tool, selectedTool, icon, label, onClick, children, scale, showDropdown = true, onDropdownToggle }: ToolButtonProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const hasDropdown = ['color', 'pencil', 'line', 'rectangle', 'ellipse'].includes(tool);

    useEffect(() => {
        if (!hasDropdown) return;
        if (selectedTool === tool) setIsDropdownOpen(showDropdown ?? false);
        else setIsDropdownOpen(false);
    }, [selectedTool, showDropdown, tool, hasDropdown]);

    const handleClick = () => {
        if (hasDropdown) {
            const newState = !isDropdownOpen;
            setIsDropdownOpen(newState);
            onDropdownToggle?.(tool, newState);
        }
        onClick(tool);
    };

    return (
        <Popover
            opened={isDropdownOpen && hasDropdown}
            onChange={setIsDropdownOpen}
            position="right"
            withArrow={scale >= 0.9}
            zIndex={100}
        >
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
                        onClick={handleClick}
                    >
                        {icon}
                    </div>
                </Tooltip>
            </Popover.Target>
            {hasDropdown && (
                <Popover.Dropdown
                    style={{ transform: `scale(${scale})`, transformOrigin: "bottom left", padding: "6px", marginLeft: "8px" }}
                >
                    {children}
                </Popover.Dropdown>
            )}
        </Popover>
    );
};

export default ToolButton;