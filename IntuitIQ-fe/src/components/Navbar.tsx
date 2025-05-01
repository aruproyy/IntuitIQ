import { SignInButton, UserButton, useAuth } from '@clerk/clerk-react';
import { Tooltip } from '@mantine/core';
import { History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();
    return (
        <nav className="fixed top-0 left-0 w-full bg-gradient-to-b from-gray-800 to-transparent z-50">
            <div className="container mx-auto flex justify-between items-center py-3 px-6">
                <div className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="w-11 h-11 rounded-3xl cursor-pointer" onClick={() => navigate("/home")} />
                    <span className="ml-2 text-2xl font-bold cursor-pointer text-white max-[389px]:hidden" onClick={() => navigate("/home")}>IntuitIQ</span>
                </div>
                <div className="flex items-center space-x-6">
                    {isSignedIn ? (
                        <div className="flex items-center gap-4">
                            <Tooltip label="History">
                                <History className="w-6 h-6 text-white cursor-pointer" onClick={() => navigate("/history")} />
                            </Tooltip>
                            <UserButton />
                        </div>
                    ) : (
                        <SignInButton>
                            <div className="bg-black border-2 border-transparent font-bold text-white px-6 py-2 rounded-full hover:bg-white hover:border-2 hover:border-indigo-600 hover:text-indigo-600 hover:cursor-pointer">
                                Sign In
                            </div>
                        </SignInButton>
                    )}
                </div>
            </div>
        </nav>
    );
}