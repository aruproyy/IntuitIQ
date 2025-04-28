import { SignInButton } from '@clerk/clerk-react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, Brain, CheckCheck, CheckCircleIcon, Wallet } from 'lucide-react';
import { useRef } from 'react';

export default function LandingPage() {
    const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
    const handleMouseEnter = () => { autoplay.current.stop() };
    const handleMouseLeave = () => { autoplay.current.play() };
    const creators = [
        {
            name: "Arup Roy",
            photo: "https://avatars.githubusercontent.com/u/155263895?v=4",
            dept_college: "ECE 2025, Future Institute of Engineering and Management",
            details: "JAVA Programmer, Frontend Developer",
            github: "https://github.com/aruproyy",
            linkedin: "https://www.linkedin.com/in/arup-roy299/",
            leetcode: "https://leetcode.com/u/Arup299/"
        },
        {
            name: "Debolina Saha",
            photo: "https://avatars.githubusercontent.com/u/156057665?v=4",
            dept_college: "ECE 2025, Future Institute of Engineering and Management",
            details: "JAVA Programmer, UI/UX designer",
            github: "https://github.com/sdebolina",
            linkedin: "https://www.linkedin.com/in/debolina-saha-58b27a289",
            leetcode: "https://leetcode.com/u/Debolinaarya/"
        },
        {
            name: "Himesh Bhattacharjee",
            photo: "https://avatars.githubusercontent.com/u/155549081?v=4",
            dept_college: "ECE 2025, Future Institute of Engineering and Management",
            details: "C++/Python Coder, Web Developer, AI/ML Enthusiast",
            github: "https://github.com/HimeshBhattacharjee",
            linkedin: "https://www.linkedin.com/in/himeshbhattacharjee/",
            leetcode: "https://leetcode.com/u/traataphoenix/"
        },
        {
            name: "Priyanka Bal",
            photo: "https://avatars.githubusercontent.com/u/159651316?v=4",
            dept_college: "ECE 2025, Future Institute of Engineering and Management",
            details: "JAVA Programmer, Web Developer",
            github: "https://github.com/priyanka-bal44",
            linkedin: "https://www.linkedin.com/in/priyanka-bal-168828288/",
            leetcode: "https://leetcode.com/u/priyanka-4444/"
        },
    ];

    return (
        <div className="font-sans">
            <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-indigo-800">
                <div className="text-center">
                    <h1 className="text-6xl font-black text-white mb-6">
                        Solve Math Problems Like Never Before
                    </h1>
                    <p className="text-xl text-indigo-100 mb-8">
                        IntuitIQ is the ultimate tool for solving mathematical problems and visualizing complex equations.
                    </p>
                    <div className="flex justify-center">
                        <SignInButton>
                            <div className="bg-white text-indigo-600 border-2 border-white font-bold px-6 py-3 rounded-lg hover:text-white hover:bg-transparent hover:cursor-pointer transition transform hover:scale-105 flex items-center justify-center space-x-2">
                                Get Started
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        </SignInButton>
                    </div>
                </div>
            </div>
            <div id="features" className="py-24 bg-gray-100">
                <div className="container mx-auto text-center">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <CheckCheck className="w-8 h-8" />
                        <h2 className="text-3xl font-bold text-gray-800 max-[424px]:text-xl">Why Choose IntuitIQ?</h2>
                    </div>
                    <p className="text-gray-600 mb-12">
                        Discover the features that make IntuitIQ the best tool for math enthusiasts.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 max-[424px]:text-lg">Interactive Canvas and Text Box</h3>
                            <p className="text-gray-600">
                                Draw, write, solve, and visualize mathematical problems in real-time with our intuitive canvas and textbox.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 max-[424px]:text-lg">AI-Powered Solutions</h3>
                            <p className="text-gray-600">
                                Solve complex equations and problems using advanced AI models like Gemini and Mistral.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 max-[424px]:text-lg">History Management</h3>
                            <p className="text-gray-600">
                                Effortlessly revisit and review previously generated solutions at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="pricing" className="py-24 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto text-center">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <Wallet className="w-8 h-8" />
                        <h2 className="text-3xl font-bold text-gray-800 max-[424px]:text-2xl">Pricing</h2>
                    </div>
                    <p className="text-gray-600 mb-12">
                        IntuitIQ is completely free to use. No hidden fees, no subscriptions.
                    </p>
                    <div className="flex justify-center cursor-pointer">
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105 w-full max-w-sm">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Free Plan</h3>
                            <div className="text-left space-y-4">
                                <div className="flex items-center">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                    <span className="text-gray-600">Interactive Canvas and Text Box</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                    <span className="text-gray-600">AI-Powered Solutions</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                    <span className="text-gray-600">Answers in Rich Text Editor Format</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                    <span className="text-gray-600">Real-Time Equation Solving</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                    <span className="text-gray-600">History Management</span>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-between items-center max-[400px]:flex-col gap-2">
                                <div>
                                    <span className="text-4xl font-bold text-gray-800 max-[400px]:text-3xl">₹0</span>
                                    <span className="text-gray-600">/month</span>
                                </div>
                                <button
                                    className="bg-gray-500 text-white font-bold px-10 py-3 rounded-lg cursor-not-allowed opacity-75"
                                    disabled
                                >
                                    Activated
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="meet-the-minds" className="py-24 bg-gray-100">
                <div className="container mx-auto text-center">
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <Brain className="w-8 h-8" />
                        <h2 className="text-3xl font-bold text-gray-800">Meet the Minds</h2>
                    </div>
                    <Carousel
                        withIndicators
                        loop
                        height={400}
                        slideGap={{ base: 0, sm: 'md' }}
                        plugins={[autoplay.current]}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="max-w-6xl mx-auto"
                        styles={{
                            indicator: {
                                backgroundColor: '#4F46E5',
                                width: '40px',
                                height: '8px',
                                transition: 'width 250ms ease',
                                '&[dataActive]': {
                                    width: '40px',
                                    backgroundColor: '#4F46E5',
                                },
                            },
                        }}
                    >
                        {creators.map((creator, index) => (
                            <Carousel.Slide key={index} className='h-400 lg:h-500'>
                                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col lg:flex-row items-center justify-center p-8">
                                    <div className="w-full lg:w-1/3 flex justify-center mb-4 lg:mb-0">
                                        <img
                                            src={creator.photo}
                                            alt={creator.name}
                                            className="w-28 h-28 lg:w-60 lg:h-60 rounded-full object-cover border-4 border-indigo-500 shadow-lg shadow-indigo-500"
                                        />
                                    </div>
                                    <div className="w-full text-center lg:w-2/4 lg:text-left">
                                        <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                                            {creator.name}
                                        </h3>
                                        <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                                            <a
                                                href={creator.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:scale-125 transition"
                                            >
                                                <img src="/github.svg" alt="GitHub" width={28} />
                                            </a>
                                            <a
                                                href={creator.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:scale-125 transition"
                                            >
                                                <img src="/linkedin.svg" alt="LinkedIn" width={28} />
                                            </a>
                                            <a
                                                href={creator.leetcode}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:scale-125 transition"
                                            >
                                                <img src="/leetcode.svg" alt="LeetCode" width={20} />
                                            </a>
                                        </div>
                                        <p className="text-xs lg:text-lg text-gray-800 font-bold">{creator.dept_college}</p>
                                        <p className="text-xs lg:text-lg text-gray-600">{creator.details}</p>
                                    </div>
                                </div>
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                </div>
            </div>
            <footer className="py-12 bg-gray-800 text-white">
                <div className="container mx-auto text-center">
                    <p className="text-gray-400">
                        &copy; 2025 IntuitIQ &trade;. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}