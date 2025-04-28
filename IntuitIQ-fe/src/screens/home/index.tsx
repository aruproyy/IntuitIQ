import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import rough from "roughjs";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import Tools from "../../components/Tools";
import { useDrawingTools, useHistory, usePressedKeys } from "../../components/hooks";
import { Action, Element, GeneratedResult, Response, LineElement, RectangleElement, Tool, EllipseElement } from "../../components/types";
import { adjustElementCoordinates, adjustmentRequired, createElement, cursorForPosition, drawElement, getElementAtPosition, resizedCoordinates, generator } from "../../components/utils";

const Home = () => {
    const { user } = useUser();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pressedKeys = usePressedKeys();
    const [reset, setReset] = useState(false);
    const [dictOfVars, setDictOfVars] = useState({});
    const [result, setResult] = useState<GeneratedResult>();
    const [latexPosition, setLatexPosition] = useState({ x: 0, y: 0 });
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
    const [visibleLines, setVisibleLines] = useState(0);
    const [elements, setElements, undo, redo] = useHistory([]);
    const [action, setAction] = useState<Action>("none");
    const [tool, setTool] = useState<Tool>("selection");
    const [selectedElement, setSelectedElement] = useState<Element | null>(null);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [startPanMousePosition, setStartPanMousePosition] = useState({ x: 0, y: 0 });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [dimensions, setDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [_, setTouchStartPosition] = useState({ x: 0, y: 0 });
    const { color, setColor, setIsEraser, eraserSize, setEraserSize, brushSize, setBrushSize } = useDrawingTools();

    // Detect touch device
    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouchDevice();
        window.addEventListener('resize', checkTouchDevice);
        return () => window.removeEventListener('resize', checkTouchDevice);
    }, []);

    const toolCursors = {
        selection: "default",
        line: "crosshair",
        rectangle: "crosshair",
        ellipse: "crosshair",
        pencil: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"20\" height=\"2 0\" viewBox=\"0 0 50 50\"><path d=\"M 46.574219 3.425781 C 45.625 2.476563 44.378906 2 43.132813 2 C 41.886719 2 40.640625 2.476563 39.691406 3.425781 C 39.691406 3.425781 39.621094 3.492188 39.53125 3.585938 C 39.523438 3.59375 39.511719 3.597656 39.503906 3.605469 L 4.300781 38.804688 C 4.179688 38.929688 4.089844 39.082031 4.042969 39.253906 L 2.035156 46.742188 C 1.941406 47.085938 2.039063 47.453125 2.292969 47.707031 C 2.484375 47.898438 2.738281 48 3 48 C 3.085938 48 3.171875 47.988281 3.257813 47.964844 L 10.746094 45.957031 C 10.917969 45.910156 11.070313 45.820313 11.195313 45.695313 L 46.394531 10.5 C 46.40625 10.488281 46.410156 10.472656 46.417969 10.460938 C 46.507813 10.371094 46.570313 10.308594 46.570313 10.308594 C 48.476563 8.40625 48.476563 5.324219 46.574219 3.425781 Z M 45.160156 4.839844 C 46.277344 5.957031 46.277344 7.777344 45.160156 8.894531 C 44.828125 9.222656 44.546875 9.507813 44.304688 9.75 L 40.25 5.695313 C 40.710938 5.234375 41.105469 4.839844 41.105469 4.839844 C 41.644531 4.296875 42.367188 4 43.132813 4 C 43.898438 4 44.617188 4.300781 45.160156 4.839844 Z M 5.605469 41.152344 L 8.847656 44.394531 L 4.414063 45.585938 Z\" fill=\"white\"/></svg>') 0 16, auto",
        text: "text",
        eraser: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"20\" height=\"20\" viewBox=\"0 0 50 50\"><path d=\"M 3 33 L 20 16 L 34 30 L 17 47 C 16.609375 47.390625 16.078125 47.609375 15.519531 47.609375 C 14.957031 47.609375 14.421875 47.390625 14.027344 47 L 3 36 Z M 21 15 L 32.292969 3.707031 C 33.074219 2.925781 34.351563 2.925781 35.132813 3.707031 L 46.292969 14.867188 C 47.074219 15.648438 47.074219 16.925781 46.292969 17.707031 L 35 29 Z M 36.414063 18.414063 L 31.585938 13.585938 L 33 12.171875 L 37.828125 17 Z\" fill=\"white\"/></svg>') 0 16, auto",
        color: "default"
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });

            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    // Redraw all elements after resize
                    const roughCanvas = rough.canvas(canvas);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.save();
                    ctx.translate(panOffset.x, panOffset.y);
                    elements.forEach((element) => {
                        if (action === "writing" && selectedElement?.id === element.id) return;
                        drawElement(roughCanvas, ctx, element);
                    });
                    ctx.restore();
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [elements, action, selectedElement, panOffset]);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!context || !canvas) return;

        const roughCanvas = rough.canvas(canvas);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(panOffset.x, panOffset.y);
        elements.forEach((element) => {
            if (action === "writing" && selectedElement?.id === element.id) return;
            drawElement(roughCanvas, context, element);
        });
        context.restore();
    }, [elements, action, selectedElement, panOffset]);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(
                result.expression || "",
                result.procedure || "",
                result.solution || ""
            );
        }
    }, [result]);

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setVisibleLines(0);
            setResult(undefined);
            setDictOfVars({});
            setErrorMessage(null);
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = dimensions.width;
                canvas.height = dimensions.height;
                ctx.lineCap = "round";
                ctx.lineWidth = brushSize;
            }
        }

        // Load MathJax only if it's not already loaded
        if (!window.MathJax) {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
            script.async = true;
            document.head.appendChild(script);
            script.onload = () => {
                window.MathJax.Hub.Config({
                    tex2jax: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
                    showProcessingMessages: false,
                    messageStyle: "none"
                });
            };
            return () => { document.head.removeChild(script); };
        }
    }, [dimensions]);

    useEffect(() => {
        const undoRedoFunction = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "z") undo();
            if ((event.metaKey || event.ctrlKey) && event.key === "y") redo();
        };
        document.addEventListener("keydown", undoRedoFunction);
        return () => { document.removeEventListener("keydown", undoRedoFunction); };
    }, [undo, redo]);

    useEffect(() => {
        const panFunction = (event: WheelEvent) => {
            setPanOffset((prevState) => ({
                x: prevState.x - event.deltaX,
                y: prevState.y - event.deltaY,
            }));
        };
        document.addEventListener("wheel", panFunction);
        return () => { document.removeEventListener("wheel", panFunction); };
    }, []);

    useEffect(() => {
        const textArea = textAreaRef.current;
        if (action === "writing" && textArea && selectedElement?.type === "text") {
            setTimeout(() => {
                textArea.focus();
                textArea.value = selectedElement.text || "";
            }, 0);
        }
    }, [action, selectedElement]);

    useEffect(() => {
        if (latexExpression.length > 0) {
            setVisibleLines(0);
            const timer = setInterval(() => {
                setVisibleLines(prev => {
                    if (prev < latexExpression.length) return prev + 1;
                    clearInterval(timer);
                    return prev;
                });
            }, 300);
            return () => clearInterval(timer);
        }
    }, [latexExpression]);

    const getEventPosition = (e: MouseEvent | TouchEvent) => {
        let clientX = 0;
        let clientY = 0;

        if (e instanceof MouseEvent) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e instanceof TouchEvent) {
            clientX = e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX ?? 0;
            clientY = e.touches[0]?.clientY ?? e.changedTouches[0]?.clientY ?? 0;
        }

        const rect = canvasRef.current?.getBoundingClientRect();

        return {
            x: clientX - (rect?.left ?? 0),
            y: clientY - (rect?.top ?? 0),
        };
    };

    const renderLatexToCanvas = (expression: string, procedure: string, solution: string) => {
        try {
            const procedureString = typeof procedure === 'string' ? procedure : '';
            const answerLines = procedureString.split('\n').filter(line => line.trim() !== '');

            const latexLines: string[] = [];

            if (expression) {
                latexLines.push(`\\text{Problem: } ${expression}`);
            }

            if (answerLines.length > 0 || solution) {
                latexLines.push(`\\text{Solution: }`);
                answerLines.forEach((line) => {
                    const cleanedLine = line.replace(/\\text\{.*?\}/g, '').replace(/\\quad/g, '').trim();
                    if (cleanedLine) latexLines.push(` ${cleanedLine}`);
                });
            }

            if (solution) {
                latexLines.push(`\\text{Final Answer: } ${solution}`);
            }

            setLatexExpression(latexLines);
            const canvas = canvasRef.current;
            if (canvas) {
                const centerX = (canvas.width / 2) - 200;
                const centerY = (canvas.height / 2) - (latexLines.length * 20);
                setLatexPosition({ x: centerX, y: centerY });
            }
            setTimeout(() => {
                if (window.MathJax) window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        } catch (error) {
            console.error("Error rendering LaTeX:", error);
            setErrorMessage("Error displaying the solution. Please try again.");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setElements([]);
        setPanOffset({ x: 0, y: 0 });
    };

    const updateElement = (id: number, x1: number, y1: number, x2: number, y2: number, type: Tool, options?: { text?: string }) => {
        const elementsCopy = [...elements];
        const element = elementsCopy[id];
        switch (element.type) {
            case "line":
            case "rectangle":
            case "ellipse":
                elementsCopy[id] = {
                    ...element,
                    x1, y1, x2, y2,
                    roughElement: type === "line"
                        ? generator.line(x1, y1, x2, y2, { stroke: color, strokeWidth: brushSize })
                        : type === "rectangle"
                            ? generator.rectangle(x1, y1, x2 - x1, y2 - y1, { stroke: color, strokeWidth: brushSize })
                            : generator.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1), Math.abs(y2 - y1), { stroke: color, strokeWidth: brushSize }),
                    color,
                    brushSize
                };
                break;
            case "pencil":
                elementsCopy[id] = {
                    ...element,
                    points: [...element.points, { x: x2, y: y2 }],
                    color,
                    brushSize
                };
                break;
            case "text":
                const canvas = canvasRef.current;
                const context = canvas?.getContext("2d");
                if (context) {
                    // Use responsive font size
                    const fontSize = Math.max(16, Math.min(24, dimensions.width / 50));
                    context.font = `${fontSize}px sans-serif`;
                    const textWidth = context.measureText(options?.text || "").width;
                    const textHeight = fontSize;
                    elementsCopy[id] = {
                        ...element,
                        x1, y1,
                        x2: x1 + textWidth,
                        y2: y1 + textHeight,
                        text: options?.text || "",
                        color,
                        brushSize
                    };
                }
                break;
            default:
                const _exhaustiveCheck: never = element;
                return _exhaustiveCheck;
        }
        setElements(elementsCopy, true);
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
        if (action === "writing") return;

        // Prevent default touch behavior to avoid scrolling
        if (e instanceof TouchEvent) {
            e.preventDefault();
        }

        const { x, y } = getEventPosition(e);
        setTouchStartPosition({ x, y });

        if (('button' in e && e.button === 1) || pressedKeys.has(" ")) {
            setAction("panning");
            setStartPanMousePosition({ x, y });
            return;
        }

        if (tool === "selection") {
            const element = getElementAtPosition(x, y, elements);
            if (element) {
                if (element.type === "pencil") {
                    const xOffsets = element.points.map(point => x - point.x);
                    const yOffsets = element.points.map(point => y - point.y);
                    setSelectedElement({ ...element, xOffsets, yOffsets });
                } else {
                    const offsetX = x - element.x1;
                    const offsetY = y - element.y1;
                    setSelectedElement({ ...element, offsetX, offsetY });
                }
                if (element.position === "inside") setAction("moving");
                else setAction("resizing");
            }
        } else if (tool === "eraser") {
            const element = getElementAtPosition(x, y, elements);
            if (element) {
                setElements(prev => prev.filter(el => el.id !== element.id));
                setAction("erasing");
            }
        } else {
            const id = elements.length;
            const element = createElement(id, x, y, x, y, tool, color, brushSize);
            setElements(prev => [...prev, element]);
            setSelectedElement(element);
            setAction(tool === "text" ? "writing" : "drawing");
        }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
        if (e instanceof TouchEvent) {
            e.preventDefault();
        }

        const { x, y } = getEventPosition(e);

        // For touch devices, check if this is a pan gesture (two fingers)
        if (e instanceof TouchEvent && e.touches.length >= 2) {
            setAction("panning");
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const deltaX = (touch1.clientX + touch2.clientX) / 2 - startPanMousePosition.x;
            const deltaY = (touch1.clientY + touch2.clientY) / 2 - startPanMousePosition.y;
            setPanOffset(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
            setStartPanMousePosition({
                x: (touch1.clientX + touch2.clientX) / 2,
                y: (touch1.clientY + touch2.clientY) / 2
            });
            return;
        }

        const target = e.target as HTMLElement;
        if (!isTouchDevice) {
            target.style.cursor = toolCursors[tool];
        }

        if (action === "panning") {
            const deltaX = x - startPanMousePosition.x;
            const deltaY = y - startPanMousePosition.y;
            setPanOffset(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
            setStartPanMousePosition({ x, y });
            return;
        }

        if (tool === "selection") {
            const element = getElementAtPosition(x, y, elements);
            if (element && !isTouchDevice) {
                target.style.cursor = cursorForPosition(element.position);
            }
        } else if (tool === "eraser") {
            if (!isTouchDevice) {
                target.style.cursor = toolCursors.eraser;
            }
            if (action === "erasing") {
                const element = getElementAtPosition(x, y, elements);
                if (element) {
                    setElements(prev => prev.filter(el => el.id !== element.id));
                }
            }
        }

        if (action === "drawing") {
            if (!isTouchDevice) {
                target.style.cursor = toolCursors[tool];
            }
            const index = elements.length - 1;
            const element = elements[index];
            if (element.type === "line" || element.type === "rectangle" || element.type === "ellipse" || element.type === "text") {
                updateElement(index, element.x1, element.y1, x, y, tool);
            } else if (element.type === "pencil") updateElement(index, 0, 0, x, y, tool);
        } else if (action === "moving" && selectedElement) {
            if (!isTouchDevice) {
                target.style.cursor = "move";
            }
            if (selectedElement.type === "pencil") {
                const newPoints = selectedElement.points.map((_, i) => ({ x: x - (selectedElement.xOffsets?.[i] || 0), y: y - (selectedElement.yOffsets?.[i] || 0) }));
                const elementsCopy = [...elements];
                elementsCopy[selectedElement.id] = { ...selectedElement, points: newPoints };
                setElements(elementsCopy, true);
            } else if (selectedElement.type === "line" || selectedElement.type === "rectangle" || selectedElement.type === "ellipse" || selectedElement.type === "text") {
                const offsetX = selectedElement.offsetX || 0;
                const offsetY = selectedElement.offsetY || 0;
                const width = selectedElement.x2 - selectedElement.x1;
                const height = selectedElement.y2 - selectedElement.y1;
                const newX1 = x - offsetX;
                const newY1 = y - offsetY;
                const options = selectedElement.type === "text" ? { text: selectedElement.text } : undefined;
                updateElement(selectedElement.id, newX1, newY1, newX1 + width, newY1 + height, selectedElement.type, options);
            }
        } else if (action === "resizing" && selectedElement) {
            if (selectedElement.type === "line" || selectedElement.type === "rectangle" || selectedElement.type === "ellipse") {
                if (selectedElement.position) {
                    const resizedCoord = resizedCoordinates(x, y, selectedElement.position,
                        { x1: selectedElement.x1, y1: selectedElement.y1, x2: selectedElement.x2, y2: selectedElement.y2 }
                    );
                    if (resizedCoord) {
                        updateElement(selectedElement.id, resizedCoord.x1, resizedCoord.y1, resizedCoord.x2, resizedCoord.y2, selectedElement.type);
                    }
                }
            }
        }
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
        const { x, y } = getEventPosition(e);

        if (selectedElement) {
            if (
                selectedElement.type === "text" &&
                x - (selectedElement as any).offsetX === selectedElement.x1 &&
                y - (selectedElement as any).offsetY === selectedElement.y1
            ) {
                setAction("writing");
                return;
            }
            const index = selectedElement.id;
            const { id, type } = elements[index];
            if ((action === "drawing" || action === "resizing") && adjustmentRequired(type)) {
                const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index] as LineElement | RectangleElement | EllipseElement);
                updateElement(id, x1, y1, x2, y2, type as Tool);
            }
        }
        if (action === "writing") return;
        setAction("none");
        setSelectedElement(null);
    };

    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (!selectedElement || selectedElement.type !== "text") return;
        const { id, x1, y1, type } = selectedElement;
        setAction("none");
        setSelectedElement(null);
        updateElement(id, x1, y1, 0, 0, type as Tool, { text: event.target.value });
    };

    const handleSetTool = (tool: string) => {
        if (["selection", "line", "rectangle", "ellipse", "pencil", "text", "eraser", "color"].includes(tool)) setTool(tool as Tool);
    };

    const runRoute = async () => {
        const canvas = canvasRef.current;
        if (!user || !canvas) return;
        setIsFetching(true);
        try {
            const response = await axios({
                method: "post",
                url: `${import.meta.env.VITE_API_URL}/image_calculate`,
                data: { user_id: user.id, image: canvas.toDataURL("image/png"), dict_of_vars: dictOfVars }
            });

            const resp = await response.data;

            if (!resp.data || resp.data.length === 0) {
                setErrorMessage("Input contains no Mathematical Problem");
                setTimeout(() => setErrorMessage(null), 3000);
                setIsFetching(false);
                return;
            }

            const validResults: GeneratedResult[] = [];
            resp.data.forEach((data: Response) => {
                if (data.assign === true) {
                    setDictOfVars(prev => ({ ...prev, [data.expr]: data.steps }));
                }

                if (data.expr && (data.steps || data.result)) {
                    validResults.push({
                        expression: data.expr,
                        procedure: typeof data.steps === 'string' ? data.steps : '',
                        solution: data.result || ''
                    });
                }
            });

            if (validResults.length === 0) {
                setErrorMessage("No valid mathematical problems found");
                setTimeout(() => setErrorMessage(null), 3000);
                setIsFetching(false);
                return;
            }

            const ctx = canvas.getContext("2d");
            const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    if (imageData.data[i + 3] > 0) {
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }

            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            setLatexPosition({ x: centerX, y: centerY });

            validResults.forEach((result, index) => {
                setTimeout(() => {
                    setResult(result);
                }, index * 1000);
            });
            setIsFetching(false);
            resetCanvas();
        } catch (error) {
            console.error("Error in runRoute:", error);
            setErrorMessage("Error processing the input. Please try again.");
            setTimeout(() => setErrorMessage(null), 3000);
            setIsFetching(false);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const startHandler = (e: MouseEvent | TouchEvent) => {
            handlePointerDown(e);
        };

        const moveHandler = (e: MouseEvent | TouchEvent) => {
            handlePointerMove(e);
        };

        const endHandler = (e: MouseEvent | TouchEvent) => {
            handlePointerUp(e);
        };

        canvas.addEventListener('mousedown', startHandler);
        canvas.addEventListener('mousemove', moveHandler);
        canvas.addEventListener('mouseup', endHandler);

        canvas.addEventListener('touchstart', startHandler, { passive: false });
        canvas.addEventListener('touchmove', moveHandler, { passive: false });
        canvas.addEventListener('touchend', endHandler, { passive: false });

        return () => {
            canvas.removeEventListener('mousedown', startHandler);
            canvas.removeEventListener('mousemove', moveHandler);
            canvas.removeEventListener('mouseup', endHandler);

            canvas.removeEventListener('touchstart', startHandler);
            canvas.removeEventListener('touchmove', moveHandler);
            canvas.removeEventListener('touchend', endHandler);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                position: 'relative',
                touchAction: 'none' // Prevent default touch behaviors
            }}
        >
            <Tools
                tool={tool}
                setTool={handleSetTool}
                color={color}
                setColor={setColor}
                setIsEraser={setIsEraser}
                eraserSize={eraserSize}
                setEraserSize={setEraserSize}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
            />
            <Sidebar />
            {action === "writing" && selectedElement?.type === "text" ? (
                <textarea
                    ref={textAreaRef}
                    onBlur={handleBlur}
                    style={{
                        position: "absolute",
                        top: selectedElement.y1 - 2 + panOffset.y,
                        left: selectedElement.x1 + panOffset.x,
                        font: `max(16px, min(24px, ${dimensions.width / 50}px)) sans-serif`,
                        color: "white",
                        margin: 0,
                        padding: 0,
                        border: 0,
                        outline: 0,
                        resize: "both",
                        overflow: "hidden",
                        whiteSpace: "pre",
                        background: "transparent",
                        zIndex: 2,
                        maxWidth: '80%',
                    }}
                />
            ) : null}
            <canvas
                id="canvas"
                ref={canvasRef}
                style={{
                    position: "absolute",
                    zIndex: 1,
                    background: "#000",
                    width: '100%',
                    height: '100%',
                    touchAction: 'none'
                }}
            />
            {latexExpression.length > 0 && (
                <Draggable
                    defaultPosition={{ x: latexPosition.x, y: latexPosition.y }}
                    onStop={(_, data) => { setLatexPosition({ x: data.x, y: data.y }) }}
                    bounds="parent"
                >
                    <div
                        className="latex-container"
                        style={{
                            position: "absolute",
                            top: panOffset.y,
                            left: panOffset.x,
                            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                            maxWidth: '90%',
                            overflow: 'hidden',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            padding: '10px',
                            borderRadius: '5px',
                            fontSize: `clamp(14px, 3vw, 20px)`,
                            color: 'white',
                            zIndex: 3,
                            touchAction: 'none' // Make draggable work better on touch devices
                        }}
                    >
                        {latexExpression.map((latex, index) => (
                            <div
                                key={index}
                                style={{
                                    animationDelay: `${index * 0.3}s`,
                                    display: index <= visibleLines ? 'block' : 'none',
                                    marginBottom: '5px',
                                    wordBreak: 'break-word'
                                }}
                            >
                                {index === 0 ? (
                                    <span className="problem-label" style={{ fontWeight: 'bold', color: '#4CAF50' }}>Problem: </span>
                                ) : index === 1 ? (
                                    <span className="solution-steps-label" style={{ fontWeight: 'bold', color: '#2196F3' }}>Solution: </span>
                                ) : index === latexExpression.length - 1 ? (
                                    <span className="final-solution-label" style={{ fontWeight: 'bold', color: '#FF5722' }}>Final Answer: </span>
                                ) : null}
                                <span dangerouslySetInnerHTML={{ __html: latex.replace(/\\text\{.*?\}/g, '').replace(/\\quad/g, '') }} />
                            </div>
                        ))}
                    </div>
                </Draggable>
            )}
            {errorMessage && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(255, 0, 0, 0.8)",
                    color: "white",
                    padding: "20px",
                    borderRadius: "5px",
                    zIndex: 100,
                    animation: "fadeInOut 3s forwards",
                    maxWidth: '80%',
                    textAlign: 'center',
                    fontSize: 'clamp(14px, 4vw, 18px)'
                }}>
                    {errorMessage}
                </div>
            )}
            <Footer
                setReset={setReset}
                undo={undo}
                redo={redo}
                runRoute={runRoute}
                isFetching={isFetching}
            />
            <style>
                {`
                @keyframes fadeInOut {
                    0% { opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { opacity: 0; }
                }

                @media (max-width: 768px) {
                    .latex-container {
                        font-size: 16px !important;
                        padding: 8px !important;
                    }

                    textarea {
                        font-size: 18px !important;
                    }
                }

                @media (max-width: 480px) {
                    .latex-container {
                        font-size: 14px !important;
                        padding: 5px !important;
                    }

                    textarea {
                        font-size: 16px !important;
                    }
                }

                /* Prevent text selection on touch devices */
                * {
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                /* Allow text selection in textarea */
                textarea {
                    -webkit-user-select: text;
                    user-select: text;
                }
                `}
            </style>
        </div>
    );
};

export default Home;
