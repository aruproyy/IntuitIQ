import { Button, Drawer, Menu, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import {
  Check,
  ChevronLeft,
  Copy,
  EllipsisVertical,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

interface ParsedContent {
  problem: string;
  steps: string[];
  finalAnswer: string;
}

// Function to process LaTeX content
const processLatex = (content: string) => {
  // Convert display math ($$...$$) to div with mathjax class
  content = content.replace(
    /\$\$(.*?)\$\$/gs,
    '<div class="math-display">$$$1$$</div>'
  );
  // Convert inline math ($...$) to span with mathjax class
  content = content.replace(
    /\$(.*?)\$/g,
    '<span class="math-inline">$$$1$$</span>'
  );
  return content;
};

export default function Sidebar() {
  const { user } = useUser();
  const [opened, { open, close }] = useDisclosure(false);
  const [textBoxValue, setTextBoxValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      SubScript,
      Highlight,
      Placeholder.configure({ placeholder: "Your answer will appear here..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
  });

  const fetchTextOutput = async () => {
    if (!textBoxValue.trim()) return;
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_URL}/text_calculate`,
        headers: { "Content-Type": "application/json" },
        data: { user_id: user.id, question: textBoxValue },
      });
      const result = response.data.data;
      const parsed = parseRawResponse(result);

      const formattedContent = `
                <h2>Problem:</h2>
                <p>${processLatex(parsed.problem)}</p>
                <h2>Solution Steps:</h2>
                <ol>
                ${parsed.steps
                  .map((step) => `<li>${processLatex(step)}</li>`)
                  .join("")}
                </ol>
                <h2>Final Answer:</h2>
                <p>${processLatex(parsed.finalAnswer)}</p>
            `;

      if (editor) editor.commands.setContent(formattedContent);
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

  const parseRawResponse = (text: string): ParsedContent => {
    const problemMatch = text.match(/Problem:(.*?)(Solution Steps:|$)/s);
    const stepsMatch = text.match(/Solution Steps:(.*?)(Final Answer:|$)/s);
    const finalAnswerMatch = text.match(/Final Answer:(.*)/s);

    const problem = problemMatch ? problemMatch[1].trim() : "Not Found";
    const stepsRaw = stepsMatch ? stepsMatch[1].trim() : "";
    const finalAnswer = finalAnswerMatch
      ? finalAnswerMatch[1].trim()
      : "Not Found";

    const steps = stepsRaw
      .split(/-\s|Step\s\d+:/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return {
      problem,
      steps,
      finalAnswer,
    };
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
        const mathJax = (window as any).MathJax;
        mathJax.Hub.Config({
            tex2jax: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                processEscapes: true,
                processEnvironments: true,
                ignoreClass: ".*|",
                skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
            },
            messageStyle: "none",
            showProcessingMessages: false,
            showMathMenu: false
        });

        mathJax.Hub.Queue(["Typeset", mathJax.Hub]);
    };

    return () => {
        document.head.removeChild(script);
    };
}, []);

useEffect(() => {
    if (editor && (window as any).MathJax) {
        (window as any).MathJax.Hub.Queue(["Typeset", (window as any).MathJax.Hub]);
    }
}, [editor?.getHTML()]);

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
        transitionProps={{
          transition: "fade-left",
          duration: 300,
          timingFunction: "linear",
        }}
        styles={{ content: { height: "75vh", marginTop: "10vh" } }}
      >
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
                className={`px-3 transition-all duration-300 ${
                  copied
                    ? "bg-green-600 hover:bg-green-600 scale-110"
                    : "bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"
                }`}
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-4 h-4 transition-all duration-300" />
                ) : (
                  <Copy className="w-4 h-4 transition-all duration-300" />
                )}
              </Button>
              <Button
                title="Clear"
                className="px-3 transition-all duration-300 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"
                onClick={() => {
                  if (editor) editor.commands.setContent("");
                }}
              >
                <Trash2 className="w-4 h-4 transition-all duration-300" />
              </Button>
            </div>
            <Button
              className={`px-3 border-2 text-indigo-600 transition
                ${
                  loading
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

        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar
            sticky
            stickyOffset={60}
            className="flex flex-wrap justify-center"
            styles={{
              toolbar: {
                gap: "2px",
                padding: "2px",
                border: "1px solid black",
                borderRadius: 3,
              },
            }}
          >
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
            <Menu
              shadow="md"
              width={35}
              offset={4}
              withArrow
              arrowSize={10}
              loop
            >
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
            <ChevronLeft
              size={40}
              onClick={open}
              className="animate-pulse-and-move"
            />
          </div>
        </Tooltip>
      )}
    </>
  );
}
