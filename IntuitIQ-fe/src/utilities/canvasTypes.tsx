export type Point = { x: number; y: number };
export type ElementBase = { id: number; type: string; offsetX?: number; offsetY?: number; position?: Position; color: string; brushSize: number; };
export type LineElement = ElementBase & { type: "line"; x1: number; y1: number; x2: number; y2: number; roughElement: any; };
export type RectangleElement = ElementBase & { type: "rectangle"; x1: number; y1: number; x2: number; y2: number; roughElement: any; };
export type EllipseElement = ElementBase & { type: "ellipse"; x1: number; y1: number; x2: number; y2: number; roughElement: any; };
export type PencilElement = ElementBase & { type: "pencil"; points: Point[]; xOffsets?: number[]; yOffsets?: number[]; };
export type TextElement = ElementBase & { type: "text"; x1: number; y1: number; x2: number; y2: number; text: string; };
export type Element = LineElement | RectangleElement | PencilElement | TextElement | EllipseElement;
export type Position = "tl" | "tr" | "bl" | "br" | "start" | "end" | "inside" | null;
export type Tool = "selection" | "color" | "pencil" | "line" | "rectangle" | "ellipse" | "text" | "eraser";
export type Action = "none" | "drawing" | "moving" | "resizing" | "panning" | "writing" | "erasing";
export interface GeneratedImageResult { expression: string; procedure: string; solution: string }
export interface ImageResponse { expr: string; steps: string; result: string; assign: boolean; }
export interface GeneratedTextResult { expression: string; procedure: string; solution: string }
export interface TextResponse { expr: string; steps: string; result: string; }