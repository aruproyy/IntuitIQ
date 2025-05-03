import rough from 'roughjs';
import getStroke from "perfect-freehand";
import { Point, Element, LineElement, RectangleElement, PencilElement, TextElement, Tool, Position, EllipseElement } from './canvasTypes';

export const generator = rough.generator();

export const createElement = (id: number, x1: number, y1: number, x2: number, y2: number, type: Tool, color: string, brushSize: number): Element => {
    switch (type) {
        case "line":
        case "rectangle":
        case "ellipse":
            const roughElement = type === "line"
                ? generator.line(x1, y1, x2, y2, { stroke: color, strokeWidth: brushSize })
                : type === "rectangle"
                    ? generator.rectangle(x1, y1, x2 - x1, y2 - y1, { stroke: color, strokeWidth: brushSize })
                    : generator.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1), Math.abs(y2 - y1), { stroke: color, strokeWidth: brushSize });
            return { id, x1, y1, x2, y2, type, roughElement, color, brushSize } as LineElement | RectangleElement | EllipseElement;
        case "pencil": return { id, type, points: [{ x: x1, y: y1 }], color, brushSize } as PencilElement;
        case "text": return { id, type, x1, y1, x2, y2, text: "", color, brushSize } as TextElement;
        default: throw new Error(`Type not recognised: ${type}`);
    }
};

export const nearPoint = (x: number, y: number, x1: number, y1: number, name: Position): Position => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

export const onLine = (x1: number, y1: number, x2: number, y2: number, x: number, y: number, maxDistance = 1): Position => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? "inside" : null;
};

export const positionWithinElement = (x: number, y: number, element: Element): Position => {
    const { type } = element;
    switch (type) {
        case "line": {
            const { x1, y1, x2, y2 } = element;
            const on = onLine(x1, y1, x2, y2, x, y);
            const start = nearPoint(x, y, x1, y1, "start");
            const end = nearPoint(x, y, x2, y2, "end");
            return start || end || on;
        }
        case "rectangle": {
            const { x1, y1, x2, y2 } = element;
            const topLeft = nearPoint(x, y, x1, y1, "tl");
            const topRight = nearPoint(x, y, x2, y1, "tr");
            const bottomLeft = nearPoint(x, y, x1, y2, "bl");
            const bottomRight = nearPoint(x, y, x2, y2, "br");
            const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
            return topLeft || topRight || bottomLeft || bottomRight || inside;
        }
        case "ellipse": {
            const { x1, y1, x2, y2 } = element;
            const centerX = (x1 + x2) / 2;
            const centerY = (y1 + y2) / 2;
            const radiusX = Math.abs(x2 - x1) / 2;
            const radiusY = Math.abs(y2 - y1) / 2;
            const value = Math.pow((x - centerX) / radiusX, 2) + Math.pow((y - centerY) / radiusY, 2);
            const isOnBoundary = Math.abs(value - 1) < 0.1;
            const topLeft = nearPoint(x, y, x1, y1, "tl");
            const topRight = nearPoint(x, y, x2, y1, "tr");
            const bottomLeft = nearPoint(x, y, x1, y2, "bl");
            const bottomRight = nearPoint(x, y, x2, y2, "br");
            const isInside = Math.pow((x - centerX) / radiusX, 2) + Math.pow((y - centerY) / radiusY, 2) <= 1;
            return topLeft || topRight || bottomLeft || bottomRight || (isOnBoundary ? "inside" : null) || (isInside ? "inside" : null);
        }
        case "pencil": {
            const betweenAnyPoint = element.points.some((point, index) => {
                const nextPoint = element.points[index + 1];
                if (!nextPoint) return false;
                return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null;
            });
            return betweenAnyPoint ? "inside" : null;
        }
        case "text": {
            const { x1, y1, x2, y2 } = element;
            return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
        }
        default:
            throw new Error(`Type not recognised: ${type}`);
    }
};

export const distance = (a: Point, b: Point) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const getElementAtPosition = (x: number, y: number, elements: Element[]) => {
    return elements.map((element) => ({ ...element, position: positionWithinElement(x, y, element), })).find((element) => element.position !== null);
};

export const adjustElementCoordinates = (element: LineElement | RectangleElement | EllipseElement) => {
    const { type, x1, y1, x2, y2 } = element;
    if (type === "rectangle" || type === "ellipse") {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
        if (x1 < x2 || (x1 === x2 && y1 < y2)) return { x1, y1, x2, y2 };
        else return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
};

export const cursorForPosition = (position: Position) => {
    switch (position) {
        case "tl":
        case "br":
        case "start":
        case "end":
            return "nwse-resize";
        case "tr":
        case "bl":
            return "nesw-resize";
        default:
            return "move";
    }
};

export const resizedCoordinates = (clientX: number, clientY: number, position: Position, coordinates: { x1: number; y1: number; x2: number; y2: number }) => {
    const { x1, y1, x2, y2 } = coordinates;
    switch (position) {
        case "tl":
        case "start":
            return { x1: clientX, y1: clientY, x2, y2 };
        case "tr":
            return { x1, y1: clientY, x2: clientX, y2 };
        case "bl":
            return { x1: clientX, y1, x2, y2: clientY };
        case "br":
        case "end":
            return { x1, y1, x2: clientX, y2: clientY };
        default:
            return null;
    }
};

export const getSvgPathFromStroke = (stroke: number[][]) => {
    if (!stroke.length) return "";
    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ["M", ...stroke[0], "Q"] as (string | number)[]
    );
    d.push("Z");
    return d.join(" ");
};

export const drawElement = (roughCanvas: any, context: CanvasRenderingContext2D, element: Element) => {
    context.strokeStyle = element.color;
    context.lineWidth = element.brushSize || 1;
    switch (element.type) {
        case "line":
        case "rectangle":
        case "ellipse":
            roughCanvas.draw(element.roughElement);
            break;
        case "pencil":
            const stroke = getStroke(element.points, {
                size: element.brushSize,
                thinning: 0.5,
                smoothing: 0.5,
                streamline: 0.5,
            });
            context.fillStyle = element.color;
            context.fill(new Path2D(getSvgPathFromStroke(stroke)));
            break;
        case "text":
            context.textBaseline = "top";
            context.font = "24px sans-serif";
            context.fillStyle = element.color;
            context.fillText(element.text, element.x1, element.y1);
            break;
        default:
            throw new Error(`Type not recognised: ${(element as Element).type}`);
    }
};

export const adjustmentRequired = (type: string) => ["line", "rectangle", "ellipse"].includes(type);