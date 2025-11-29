import React, { useState, useEffect } from 'react';
import { Moon, Sun, Send, Bot } from 'lucide-react';

const NewspaperLayout = ({ genres, onSelectGenre }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [botInput, setBotInput] = useState('');
    const [botResult, setBotResult] = useState(null);
    const [isBotLoading, setIsBotLoading] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const handleBotSubmit = () => {
        if (!botInput.trim()) return;
        setIsBotLoading(true);
        // Simulate API call
        setTimeout(() => {
            setBotResult(
                Math.random() > 0.5
                    ? "✅ This claim appears to be TRUE based on our verified sources."
                    : "⚠️ CAUTION: This claim has markers of misinformation."
            );
            setIsBotLoading(false);
        }, 1500);
    };
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    return (
        <div className="min-h-screen bg-paper p-4 md:p-8">
            {/* Header */}
            <header className="border-b-4 border-black mb-8 pb-4 text-center">
                <div className="flex justify-between items-center border-b border-black pb-1 mb-2 relative">
                    <span className="text-2xl font-bold">Newspaper of AI Age</span>
                    <span className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">{formattedDate}</span>
                    <span className="text-2xl font-bold">MUMBAI HACKS EDITION</span>
                </div>

                {/* Header Image */}
                <div className="flex justify-center mb-4">
                    <img src="/src/assets/header_img.png" alt="Header Banner" className="max-h-32 object-contain" />
                </div>

                <div className="flex items-center justify-center gap-6 mb-4">
                    <img src="/src/assets/logo.jpeg" alt="Veritas X Logo" className="h-24 w-24 object-cover border border-black" />
                    <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter uppercase">
                        Veritas X
                    </h1>
                </div>

                {/* Agentic AI Banner */}

                <div className="border-t border-black mt-2 pt-1 flex justify-center gap-8 text-sm font-bold uppercase tracking-widest">
                    <span>Truth</span>
                    <span>•</span>
                    <span>Verification</span>
                    <span>•</span>
                    <span>Clarity</span>
                </div>
            </header>



            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 border-black">

                {/* Chat Bot (Agentic AI Verifier) - Moved to Left */}
                <div className="md:col-span-2 md:row-span-2 border-2 border-black p-6 bg-yellow-50 text-black flex flex-col relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-black p-2 rounded-lg">
                            <Bot className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-headline font-bold leading-none">Agentic AI Chatbot</h2>
                            <span className="text-xs text-gray-600 font-mono">ONLINE • v1.0</span>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col gap-4 overflow-y-auto mb-4 min-h-[120px]">
                        {botResult ? (
                            <div className="bg-white p-4 rounded-lg border-2 border-black animate-fade-in">
                                <p className="text-xs text-gray-600 mb-1">You asked about: {botInput}</p>
                                <p className="font-bold text-black mb-1 text-xs uppercase tracking-wider bg-yellow-200 px-2 py-1 inline-block">Analysis Result</p>
                                <p className="text-sm leading-relaxed">{botResult}</p>
                                <button
                                    onClick={() => { setBotResult(null); setBotInput(''); }}
                                    className="text-xs text-black mt-2 hover:text-gray-700 underline"
                                >
                                    Check another
                                </button>
                            </div>
                        ) : (
                            <div className="text-gray-600 text-center my-auto flex flex-col items-center">
                                <p className="text-sm mb-1 font-bold">Paste a headline, rumor, or link here.</p>
                                <p className="text-xs opacity-70">I will verify it against trusted sources.</p>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={botInput}
                            onChange={(e) => setBotInput(e.target.value)}
                            placeholder={isBotLoading ? "Verifying..." : "Ask Veritas AI..."}
                            disabled={isBotLoading}
                            className="w-full bg-white border-2 border-black rounded-lg py-3 px-4 pr-12 text-sm text-black focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleBotSubmit()}
                        />
                        <button
                            onClick={handleBotSubmit}
                            disabled={isBotLoading}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md transition-colors ${isBotLoading ? 'text-gray-400' : 'text-black hover:bg-yellow-200'
                                }`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Politics & Policy */}
                <div
                    className="md:col-span-1 md:row-span-1 border-2 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer bg-white flex flex-col justify-between h-48"
                    onClick={() => onSelectGenre('Politics')}
                >
                    <div>
                        <h3 className="font-bold uppercase border-b-2 border-black mb-2 text-blue-800">Politics & Policy</h3>
                        <p className="font-newspaper text-sm mb-2">
                            <strong>Election Update:</strong> New voting guidelines released by EC.
                        </p>
                        <p className="font-newspaper text-sm">
                            <strong>Policy Watch:</strong> Analysis of the new digital privacy bill.
                        </p>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 italic">Updated 2h ago</div>
                </div>

                {/* Economy & Finance */}
                <div
                    className="md:col-span-1 md:row-span-1 border-2 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer bg-white flex flex-col justify-between h-48"
                    onClick={() => onSelectGenre('Economy')}
                >
                    <div>
                        <h3 className="font-bold uppercase border-b-2 border-black mb-2">Economy & Finance</h3>
                        <div className="bg-green-100 p-2 border border-black mb-2 text-center">
                            <span className="font-bold text-green-800">MARKET WATCH</span>
                        </div>
                        <p className="font-newspaper text-sm">
                            Inflation myths vs verified data. Stock market rumour control.
                        </p>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 italic">Live Data</div>
                </div>

                {/* Ad Banner (Text) */}
                <div className="md:col-span-1 md:row-span-1 border-2 border-black p-4 overflow-hidden bg-gray-50 flex items-center justify-center h-48 relative">
                    <span className="text-red-600 font-bold text-xl uppercase tracking-widest border-2 border-red-600 p-2 transform -rotate-12">
                        {'{Advertisement}'}
                    </span>
                </div>

                {/* Trending Claims */}
                <div
                    className="md:col-span-1 md:row-span-1 border-2 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer bg-white h-48 overflow-hidden"
                    onClick={() => onSelectGenre('Social')}
                >
                    <h3 className="font-bold uppercase border-b-2 border-black mb-2">Trending Claims</h3>
                    <ul className="list-decimal list-inside font-newspaper text-sm space-y-2">
                        <li><span className="bg-yellow-200 px-1">Analyzing:</span> Viral bridge collapse video.</li>
                        <li><span className="bg-red-200 px-1">Flagged:</span> Fake celebrity endorsement.</li>
                        <li><span className="bg-green-200 px-1">Verified:</span> New metro line opening.</li>
                    </ul>
                </div>


                {/* Health & Pandemic */}
                <div
                    className="md:col-span-1 border-2 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer bg-white"
                    onClick={() => onSelectGenre('Health')}
                >
                    <h3 className="font-bold uppercase border-b-2 border-black mb-2">Health & Pandemic</h3>
                    <p className="font-newspaper text-sm">
                        Vaccine misinformation and outbreak rumours. Verified guidance from WHO/ICMR.
                    </p>
                </div>

                {/* Education & Exams */}
                <div
                    className="md:col-span-1 border-2 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer bg-white"
                    onClick={() => onSelectGenre('Education')}
                >
                    <h3 className="font-bold uppercase border-b-2 border-black mb-2">Education</h3>
                    <p className="font-newspaper text-sm">
                        Fake circulars and exam postponement rumours verified against official notices.
                    </p>
                </div>

                {/* Scam & Fraud Watch */}
                <div
                    className="md:col-span-1 border-2 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer bg-white"
                    onClick={() => onSelectGenre('Scam')}
                >
                    <h3 className="font-bold uppercase border-b-2 border-black mb-2 text-red-600">Scam Watch</h3>
                    <p className="font-newspaper text-sm">
                        UPI/WhatsApp scams, phishing links, and fake job offers.
                    </p>
                </div>

                {/* Ad Banner (Small) */}
                <div className="md:col-span-1 border-2 border-black p-4 overflow-hidden bg-gray-50 flex items-center justify-center relative">
                    <span className="text-red-600 font-bold text-sm uppercase tracking-widest border-2 border-red-600 p-1 transform -rotate-12">
                        {'{Ad}'}
                    </span>
                </div>

                {/* Tech & AI Myths */}
                <div
                    className="md:col-span-2 border-2 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer bg-white"
                    onClick={() => onSelectGenre('Tech')}
                >
                    <h3 className="font-bold uppercase border-b-2 border-black mb-2">Tech & AI Myths</h3>
                    <div className="flex gap-4">
                        <div className="w-1/3 bg-gray-100 border border-black flex items-center justify-center">
                            <span className="font-bold text-xs">AI IMAGE</span>
                        </div>
                        <p className="font-newspaper text-sm w-2/3">
                            Viral AI deepfake stories, privacy fears, and gadget hoaxes explained. Simple explanations for complex tech.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NewspaperLayout;
