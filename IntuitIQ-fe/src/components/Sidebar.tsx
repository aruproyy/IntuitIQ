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

    const fetchTextOutput = async () => {
        if (!textBoxValue.trim()) return;
        if (!user) return;
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/text_calculate`, {
                user_id: user.id,
                question: textBoxValue
            });
            const result = response.data.data;
            if (editor) editor.commands.setContent(result);
            setTextBoxValue("");
        } catch (error) {
            console.error("Error running text route:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (editor) {
            const text = editor.getText().trim();
            navigator.clipboard.writeText(text);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const editor = useEditor({
        extensions: [
            StarterKit, Underline, Superscript, SubScript, Highlight,
            Placeholder.configure({ placeholder: 'Your answer will appear here...' }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
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
                            <Button
                                title="Copy"
                                className={`px-3 transition-all duration-300 ${copied ? "bg-green-600 hover:bg-green-600 scale-110" : "bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"}`}
                                onClick={handleCopy}
                            >
                                {copied ? <Check className="w-4 h-4 transition-all duration-300" /> : <Copy className="w-4 h-4 transition-all duration-300" />}
                            </Button>
                            <Button title="Clear" className="px-3 transition-all duration-300 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110" onClick={() => { if (editor) editor.commands.setContent(""); }}>
                                <Trash2 className="w-4 h-4 transition-all duration-300" />
                            </Button>
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
                            {loading ? "Fetching..." : "Run"}
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
            </Drawer >
            {!opened && (
                <Tooltip label="Expand" position="left" withArrow>
                    <div className="absolute right-0 py-2 z-10 top-[calc(57vh-5rem)] text-white rounded-md cursor-pointer hover:bg-white hover:text-black duration-500">
                        <ChevronLeft size={40} onClick={open} className="animate-pulse-and-move" />
                    </div>
                </Tooltip>
            )
            }
        </>
    );
}