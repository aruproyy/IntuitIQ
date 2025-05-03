import {
    Brain, Calculator, Sigma, Square, FunctionSquare, PieChart, Divide, Plus, Minus, X, Equal,
    Pi, Infinity as InfinityIcon, Database, FileSearch, GitBranch, Sparkles, Triangle
} from "lucide-react";

export const symbols = [
    { Icon: Sigma, top: "15%", left: "5%", delay: 0, duration: 25, color: "text-indigo-300/80", size: 80 },
    { Icon: Square, top: "25%", left: "85%", delay: 0, duration: 20, color: "text-purple-300/80", size: 80 },
    { Icon: Triangle, top: "35%", left: "75%", delay: 0, duration: 20, color: "text-orange-300/80", size: 80 },
    { Icon: FunctionSquare, top: "75%", left: "10%", delay: 1, duration: 30, color: "text-pink-300/80", size: 80 },
    { Icon: Calculator, top: "65%", left: "90%", delay: 1, duration: 35, color: "text-yellow-300/80", size: 80 },
    { Icon: PieChart, top: "45%", left: "15%", delay: 0, duration: 25, color: "text-blue-300/80", size: 80 },
    { Icon: Divide, top: "20%", left: "25%", delay: 1, duration: 40, color: "text-green-300/80", size: 80 },
    { Icon: Plus, top: "80%", left: "75%", delay: 1.5, duration: 30, color: "text-red-300/80", size: 80 },
    { Icon: Minus, top: "60%", left: "50%", delay: 1, duration: 35, color: "text-orange-300/80", size: 80 },
    { Icon: X, top: "35%", left: "65%", delay: 0.5, duration: 25, color: "text-teal-300/80", size: 80 },
    { Icon: Equal, top: "55%", left: "35%", delay: 1, duration: 20, color: "text-indigo-300/80", size: 80 },
    { Icon: Pi, top: "30%", left: "45%", delay: 0, duration: 40, color: "text-purple-300/80", size: 80 },
    { Icon: InfinityIcon, top: "70%", left: "25%", delay: 1.5, duration: 30, color: "text-pink-300/80", size: 80 },
];

export interface FeatureCardProps {
    title: string;
    description: string;
    Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    index: number;
}

export interface TeamMember {
    name: string;
    photo: string;
    dept_college: string;
    details: string;
    github: string;
    linkedin: string;
    leetcode: string;
}

export const creators: TeamMember[] = [
    {
        name: "Arup Roy",
        photo: "https://avatars.githubusercontent.com/u/155263895?v=4",
        dept_college: "ECE 2025, FIEM",
        details: "JAVA Programmer, Frontend Developer",
        github: "https://github.com/aruproyy",
        linkedin: "https://www.linkedin.com/in/arup-roy299/",
        leetcode: "https://leetcode.com/u/Arup299/",
    },
    {
        name: "Debolina Saha",
        photo: "https://avatars.githubusercontent.com/u/156057665?v=4",
        dept_college: "ECE 2025, FIEM",
        details: "JAVA Programmer, UI/UX designer",
        github: "https://github.com/sdebolina",
        linkedin: "https://www.linkedin.com/in/debolina-saha-58b27a289",
        leetcode: "https://leetcode.com/u/Debolinaarya/",
    },
    {
        name: "Himesh Bhattacharjee",
        photo: "https://avatars.githubusercontent.com/u/155549081?v=4",
        dept_college: "ECE 2025, FIEM",
        details: "C++/Python Coder, Web+AI Developer",
        github: "https://github.com/HimeshBhattacharjee",
        linkedin: "https://www.linkedin.com/in/himeshbhattacharjee/",
        leetcode: "https://leetcode.com/u/traataphoenix/",
    },
    {
        name: "Priyanka Bal",
        photo: "https://avatars.githubusercontent.com/u/159651316?v=4",
        dept_college: "ECE 2025, FIEM",
        details: "JAVA Programmer, Web Developer",
        github: "https://github.com/priyanka-bal44",
        linkedin: "https://www.linkedin.com/in/priyanka-bal-168828288/",
        leetcode: "https://leetcode.com/u/priyanka-4444/",
    },
];

export const features = [
    {
        title: "Interactive Canvas",
        description:
            "Draw, write, solve, and visualize mathematical problems in real-time with our intuitive canvas.",
        Icon: Square,
    },
    {
        title: "AI-Powered Solutions",
        description:
            "Solve complex equations and problems using advanced AI models like Gemini and Mistral.",
        Icon: Brain,
    },
    {
        title: "History Management",
        description:
            "Effortlessly revisit and review previously generated solutions at any time.",
        Icon: Database,
    },
    {
        title: "Step-by-Step Explanations",
        description:
            "Understand the solution process with detailed breakdowns of each step.",
        Icon: FileSearch,
    },
    {
        title: "Real-Time Collaboration",
        description:
            "Work together with classmates or colleagues on the same problem simultaneously.",
        Icon: GitBranch,
    },
    {
        title: "Smart Suggestions",
        description:
            "Get intelligent recommendations for similar problems to deepen your understanding.",
        Icon: Sparkles,
    },
];