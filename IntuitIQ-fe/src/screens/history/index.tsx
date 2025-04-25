import { useUser } from "@clerk/clerk-react";
import { CloseButton, Tooltip, Modal } from "@mantine/core";
import axios from "axios";
import { Check, Clipboard, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface HistoryEntry {
    _id: string;
    input: string;
    output: string;
    image: string;
    responses: any[];
    date: string;
    type: "text" | "image";
}

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
}

export default function History() {
    const { user } = useUser();
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "text" | "image">("all");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { width } = useWindowSize();
    const isWidth = width < 769;
    const getButtonSizeClass = (width: number) => {
        if (width < 361) return 'px-2 py-1 text-xs';  // Extra small screens
        return 'px-4 py-2';                           // Default
    };
    const buttonSizeClass = getButtonSizeClass(width);

    useEffect(() => {
        if (!user) return;
        const fetchHistory = async () => {
            try {
                let textHistory = [];
                let imageHistory = [];
                try {
                    const textResponse = await axios.get(`${import.meta.env.VITE_API_URL}/text_history`, { params: { user_id: user.id } });
                    textHistory = textResponse.data.history.map((entry: any) => ({ ...entry, type: "text" }));
                } catch (textErr) {
                    console.error("Failed to fetch text history:", textErr);
                }
                try {
                    const imageResponse = await axios.get(`${import.meta.env.VITE_API_URL}/image_history`, { params: { user_id: user.id } });
                    imageHistory = imageResponse.data.history.map((entry: any) => ({ ...entry, type: "image" }));
                } catch (imageErr) {
                    console.error("Failed to fetch image history:", imageErr);
                }
                const combinedHistory = [...textHistory, ...imageHistory];
                if (combinedHistory.length === 0) setError(null);
                else {
                    const sortedHistory = combinedHistory.sort((a, b) => {
                        const dateA = new Date(a.date.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2}:\d{2})/, "$3-$2-$1T$4"));
                        const dateB = new Date(b.date.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2}:\d{2})/, "$3-$2-$1T$4"));
                        return dateB.getTime() - dateA.getTime();
                    });
                    setHistory(sortedHistory);
                }
            } catch (err) {
                setError("Failed to fetch history");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id: string, type: "text" | "image") => {
        try {
            const endpoint = type === "text" ? "text_history" : "image_history";
            await axios.delete(`${import.meta.env.VITE_API_URL}/${endpoint}/${id}`);
            const updatedHistory = history.filter((entry) => entry._id !== id);
            setHistory(updatedHistory);
            if (updatedHistory.length === 0) setError(null);
        } catch (err) {
            console.error("Failed to delete entry:", err);
            setError("Failed to delete entry");
        }
    };

    const handleDeleteAll = async () => {
        setIsDeleting(true);
        try {
            if (!user) throw new Error("User not authenticated");
            await axios.delete(`${import.meta.env.VITE_API_URL}/text_history/user/${user.id}`);
            await axios.delete(`${import.meta.env.VITE_API_URL}/image_history/user/${user.id}`);
            setHistory([]);
            setError(null);
        } catch (err) {
            console.error("Failed to delete all history:", err);
            setError("Failed to delete all history");
        } finally {
            setIsDeleting(false);
            setDeleteModalOpen(false);
        }
    };

    const filteredHistory = history.filter((entry) => {
        if (filter === "all") return true;
        return entry.type === filter;
    });

    const noEntriesForFilter = filteredHistory.length === 0;

    const getSectionMessage = () => {
        if (filter === "all") return "Your entire history will be shown here";
        if (filter === "text") return "Your text output history will be maintained here";
        if (filter === "image") return "Your image output history will be maintained here";
        return "";
    };

    return (
        <div className="bg-black h-[100vh] overflow-hidden">
            <Modal
                opened={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Delete All History"
                centered
                overlayProps={{ blur: 4 }}
                zIndex={1000}
            >
                <div>
                    <p>Are you sure you want to delete all your history? This action cannot be undone.</p>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAll}
                            disabled={isDeleting}
                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? "Deleting..." : "Delete All"}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="mt-20 m-5 p-5 border rounded-lg bg-gray-900 border-none">
                <div className="flex items-center justify-between">
                    <h1 className={`font-bold text-white ${isWidth ? "text-xl" : "text-3xl"}`}>History</h1>
                    <Tooltip label="Close History">
                        <Link to="/home">
                            {isWidth ? (<CloseButton size={25} className="text-white hover:bg-transparent hover:text-red-500" />)
                                : (<CloseButton size={35} className="text-white hover:bg-transparent hover:text-red-500" />)}
                        </Link>
                    </Tooltip>
                </div>
                <p className={`text-white ${isWidth ? "text-xs" : "text-md"}`}>See your previously generated contents</p>
                <div className="flex gap-4 mt-5 items-center">
                    <div className="flex gap-2">
                        <button
                            className={`${buttonSizeClass} rounded-lg ${filter === "all" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-600 text-gray-300 hover:bg-gray-700"}`}
                            onClick={() => setFilter("all")}
                        >
                            All
                        </button>
                        <button
                            className={`${buttonSizeClass} rounded-lg ${filter === "text" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-600 text-gray-300 hover:bg-gray-700"}`}
                            onClick={() => setFilter("text")}
                        >
                            {isWidth ? "Text" : "Text Output History"}
                        </button>
                        <button
                            className={`${buttonSizeClass} rounded-lg ${filter === "image" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-600 text-gray-300 hover:bg-gray-700"}`}
                            onClick={() => setFilter("image")}
                        >
                            {isWidth ? "Image" : "Image Output History"}
                        </button>
                    </div>
                    <button
                        className={`ml-auto ${buttonSizeClass} rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2`}
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        {isWidth ? (<Trash2 size={16} />)
                            : (<>
                                <Trash2 size={16} />
                                Delete All History
                            </>
                            )}
                    </button>
                </div>
                {loading ? (
                    <p className="text-gray-500 text-center mt-5">Loading...</p>
                ) : error ? (
                    <p className="text-gray-500 text-center mt-5">{error}</p>
                ) : (
                    <div className={`mt-5 overflow-y-auto ${width < 769 ? 'overflow-x-auto max-h-[60vh]' : 'max-h-[60vh]'}`}>
                        {history.length === 0 || noEntriesForFilter ? (
                            <p className="text-gray-500 text-center mt-5">{getSectionMessage()}</p>
                        ) : (
                            <div className={`${width < 769 ? 'min-w-[800px]' : ''}`}>
                                <div className="grid grid-cols-7 bg-gray-700 text-white text-center font-bold py-3 px-3 rounded-lg">
                                    <h2 className={`${width < 769 ? 'text-xs' : ''} col-span-2`}>INPUT</h2>
                                    <h2 className={`${width < 769 ? 'text-xs' : ''} col-span-2`}>RESPONSE</h2>
                                    <h2 className={`${width < 769 ? 'text-xs' : ''}`}>DATE</h2>
                                    <h2 className={`${width < 769 ? 'text-xs' : ''}`}>COPY</h2>
                                    <h2 className={`${width < 769 ? 'text-xs' : ''}`}>DELETE</h2>
                                </div>
                                {filteredHistory.map((entry) => (
                                    <div
                                        key={entry._id}
                                        className={`grid grid-cols-7 text-white text-center mt-2 py-2 px-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700`}
                                    >
                                        <div className={`${width < 769 ? 'text-xs' : ''} col-span-2 px-2 ${entry.type === "text" ? "truncate" : "flex items-center justify-center"}`}>
                                            {entry.type === "text" ? entry.input : (
                                                <img
                                                    src={entry.image}
                                                    alt="Processed Input Image"
                                                    className={`${width < 769 ? 'w-40 h-20' : 'w-60 h-30'} object-cover rounded-lg`}
                                                />
                                            )}
                                        </div>
                                        <div className={`${width < 769 ? 'text-xs' : ''} col-span-2 px-2 ${entry.type === "text" ? "truncate" : "flex items-center justify-center"}`}>
                                            {entry.type === "text"
                                                ? entry.output
                                                : entry.responses?.length > 0
                                                    ? JSON.stringify(`${entry.responses[0]?.expr ?? "N/A"} = ${entry.responses[0]?.result ?? "N/A"}`)
                                                    : "No response available"}
                                        </div>
                                        <p className={`${width < 769 ? 'text-xs' : ''} flex items-center justify-center px-2`}>{entry.date}</p>
                                        <button className={`${width < 769 ? 'text-xs' : ''} flex items-center justify-center transition-all duration-300`}
                                            onClick={() => handleCopy(
                                                entry.type === "text"
                                                    ? entry.output
                                                    : entry.responses?.length > 0
                                                        ? JSON.stringify(`${entry.responses[0]?.expr ?? "N/A"} = ${entry.responses[0]?.result ?? "N/A"}`)
                                                        : "No response available",
                                                entry._id
                                            )}>
                                            {copiedId === entry._id ? (
                                                <Check className="w-4 h-4 transition-all duration-300 text-green-500" />
                                            ) : (
                                                <Clipboard className="w-4 h-4 transition-all duration-300 hover:text-gray-400" />
                                            )}
                                        </button>
                                        <button className={`${width < 769 ? 'text-xs' : ''} flex items-center justify-center`} onClick={() => handleDelete(entry._id, entry.type)}>
                                            <Trash2 size={20} className="cursor-pointer hover:text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
