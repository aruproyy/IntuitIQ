import { Button, Drawer, Menu, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from "axios";
import { Check, ChevronLeft, Copy, EllipsisVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function Sidebar() {
    const { user } = useUser();
    const [opened, { open, close }] = useDisclosure(false);
    const [textBoxValue, setTextBoxValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const cleanMathExpression = (expression: string): string => {
        if (!expression) return expression;
        
        return expression
            .replace(/\\text\{([^}]+)\}/g, '$1')  // Remove \text{}
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<sup>$1</sup>&frasl;<sub>$2</sub>')  // Format fractions nicely
            .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')  // Simplify parentheses
            .replace(/\\[()\[\]]/g, '')  // Remove other LaTeX brackets
            .replace(/\$\$/g, '')  // Remove $$ markers
            .replace(/\*/g, '')  // Remove asterisks
            .replace(/`/g, '')  // Remove backticks
            .replace(/\\times/g, '×')  // Convert \times to multiplication symbol
            .replace(/-{3,}/g, '=')  // Convert --- to =
            .replace(/[{}]/g, '')  // Remove curly braces
            .replace(/\s+/g, ' ')  // Collapse multiple spaces
            .trim();
    };

    const formatSteps = (steps: string | string[]): string => {
        if (!steps) return '<div class="step">No steps provided</div>';
        
        const stepsArray = typeof steps === 'string' ? 
            steps.split('\n').filter(step => step.trim()) : 
            steps;

        return stepsArray
            .filter(step => step.trim().length > 0)
            .map((step, index) => {
                const cleanedStep = cleanMathExpression(step)
                    .replace(/^Step \d+:\s*/i, '')  // Remove existing step numbers
                    .replace(/^\d+\.\s*/, '');  // Remove numbered list prefixes

                return `
                    <div class="step">
                        <span class="step-number">Step ${index + 1}.</span>
                        <span class="step-content">${cleanedStep}</span>
                    </div>
                `;
            })
            .join('');
    };

    const fetchTextOutput = async () => {
        if (!textBoxValue.trim()) {
            setApiError("Please enter a question");
            return;
        }
        if (!user) {
            setApiError("You must be logged in");
            return;
        }

        setLoading(true);
        setApiError(null);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/text_calculate`,
                {
                    user_id: user.id,
                    question: textBoxValue
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 15000
                }
            );

            const { steps, result } = response.data.data[0];
            const cleanedProblem = cleanMathExpression(textBoxValue);
            const cleanedAnswer = cleanMathExpression(result?.toString() || "");
            if (!steps || cleanedAnswer === "The provided text does not contain any solvable mathematical problems or equations.") {
                setApiError("The provided text does not contain any solvable mathematical problems or equations.");
                return;
            }

            const formattedResponse = `
                <div class="math-solution">
                    <div class="problem-section">
                       <strong> <h3 class="section-title">Problem:</h3></strong>
                        <div class="problem-content">${cleanedProblem}</div>
                    </div>
                    
                    <div class="solution-section">
                       <strong> <h3 class="section-title">Solution Steps:</h3></strong>
                        <div class="steps-container">
                            ${formatSteps(steps)}
                        </div>
                    </div>
                    
                    <div class="answer-section">
                       <strong><h3 class="section-title">Final Answer:</h3></strong>
                        <div class="answer-content">${cleanedAnswer || "No result calculated"}</div>
                    </div>
                    
                    <style>
                        .math-solution {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                            color: #333;
                            line-height: 1.6;
                            padding: 1rem;
                        }
                        
                        .section-title {
                            font-weight: 600;
                            color: #4f46e5;
                            margin: 1rem 0 0.5rem 0;
                            font-size: 1.1rem;
                        }
                        
                        .problem-content {
                            background: #f8fafc;
                            padding: 0.75rem;
                            border-radius: 0.375rem;
                            border-left: 3px solid #4f46e5;
                            margin-bottom: 0.5rem;
                        }
                        
                        .steps-container {
                            background: #f8fafc;
                            padding: 0.75rem;
                            border-radius: 0.375rem;
                            border-left: 3px solid #10b981;
                        }
                        
                        .step {
                            display: flex;
                            margin-bottom: 0.5rem;
                        }
                        
                        .step-number {
                            font-weight: 600;
                            margin-right: 0.5rem;
                            color: #10b981;
                            min-width: 2rem;
                        }
                        
                        .answer-content {
                            background: #f0fdf4;
                            padding: 0.75rem;
                            border-radius: 0.375rem;
                            border-left: 3px solid #10b981;
                            font-weight: 600;
                        }
                        
                        .error-message {
                            color: #ef4444;
                            padding: 1rem;
                            background: #fef2f2;
                            border-radius: 0.375rem;
                        }
                        
                        sup {
                            vertical-align: super;
                            font-size: smaller;
                        }
                        
                        sub {
                            vertical-align: sub;
                            font-size: smaller;
                        }
                    </style>
                </div>
            `;

            if (editor) {
                editor.commands.setContent(formattedResponse);
            }
            setTextBoxValue("");

        } catch (error: any) {
            console.error("API Error:", error);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "Error processing your question";
            setApiError(errorMessage);

            if (editor) {
                editor.commands.setContent(`
                    <div class="error-message">
                        ${errorMessage}
                    </div>
                `);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (editor) {
            const text = editor.getText().trim();
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const clearSolution = () => {
        if (editor) {
            editor.commands.setContent("");
        }
        setApiError(null);
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
            }),
            Underline.configure(),
            Highlight.configure(),
            SubScript.configure(),
            Superscript.configure(),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: 'Your solution will appear here...'
            }),
        ],
        content: '',
    });

    return (
        <>
            <Drawer
                opened={opened}
                offset={8}
                size="sm"
                radius={10}
                position="right"
                onClose={close}
                title="Answers"
                transitionProps={{ transition: 'fade-left', duration: 300, timingFunction: 'linear' }}
                styles={{ content: { height: "75vh", marginTop: "10vh" } }}>
                <div className="flex flex-col gap-3">
                    {apiError && (
                        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                            {apiError}
                        </div>
                    )}
                    <textarea
                        data-autofocus
                        className="border rounded-lg p-2 w-full"
                        rows={3}
                        placeholder="Enter your question here..."
                        value={textBoxValue}
                        onChange={(e) => setTextBoxValue(e.target.value)}
                    />
                    <div className="flex justify-between my-2">
                        <div className="flex gap-2">
                            <Tooltip label="Copy solution">
                                <Button
                                    className={`px-3 transition-all duration-300 ${copied ? "bg-green-600 hover:bg-green-600 scale-110" : "bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"}`}
                                    onClick={handleCopy}
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </Tooltip>
                            <Tooltip label="Clear solution">
                                <Button 
                                    className="px-3 transition-all duration-300 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110" 
                                    onClick={clearSolution}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </Tooltip>
                        </div>
                        <Button
                            className={`px-3 border-2 text-indigo-600 transition 
                                ${loading
                                    ? "bg-gray-400 border-gray-400 text-white cursor-not-allowed"
                                    : "bg-white border-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110 cursor-pointer"
                                }`}
                            onClick={fetchTextOutput}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Solve"}
                        </Button>
                    </div>
                </div>
                <RichTextEditor editor={editor} style={{}}>
                    <RichTextEditor.Toolbar
                        sticky
                        stickyOffset={60}
                        className="flex flex-wrap justify-center"
                        styles={{ toolbar: { gap: "2px", padding: "2px", border: "1px solid black", borderRadius: 3 } }}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.Undo />
                            <RichTextEditor.Redo />
                        </RichTextEditor.ControlsGroup>
                        <Menu shadow="md" width={35} offset={4} withArrow arrowSize={10} loop>
                            <Menu.Target>
                                <Button variant="subtle" size="xs" className="p-2" title="More">
                                    <EllipsisVertical className="size-4 text-indigo-600" />
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Divider>
                                    <RichTextEditor.Subscript />
                                    <RichTextEditor.Superscript />
                                    <RichTextEditor.BulletList />
                                    <RichTextEditor.OrderedList />
                                </Menu.Divider>
                            </Menu.Dropdown>
                        </Menu>
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content />
                </RichTextEditor>
            </Drawer>
            {!opened && (
                <Tooltip label="Expand" position="left" withArrow>
                    <div className="absolute right-0 py-2 z-10 top-[calc(57vh-5rem)] text-white rounded-md cursor-pointer hover:bg-white hover:text-black duration-500">
                        <ChevronLeft size={40} onClick={open} className="animate-pulse-and-move" />
                    </div>
                </Tooltip>
            )}
        </>
    );
}