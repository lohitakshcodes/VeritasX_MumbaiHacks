import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const Flashcard = ({ newsItem, onNext, onFlip }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        if (onFlip) onFlip(!isFlipped);
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setIsFlipped(false);
        onNext();
    };

    // Keyboard shortcuts: Enter to flip, Right Arrow to next
    useEffect(() => {
        const listener = (e) => {
            if (e.key === 'Enter') {
                handleFlip();
            } else if (e.key === 'ArrowRight') {
                handleNext(e);
            }
        };
        window.addEventListener('keydown', listener);
        return () => window.removeEventListener('keydown', listener);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4">
            <div className="relative w-full max-w-4xl h-96 cursor-pointer perspective-1000" onClick={handleFlip}>
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, animationDirection: "normal" }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="border-b-2 border-black pb-2 mb-4">
                            <span className="bg-black text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">
                                {newsItem.genre || "Breaking News"}
                            </span>
                        </div>
                        <h2 className="text-3xl font-headline font-bold leading-tight text-center">
                            {newsItem.title}
                        </h2>
                        <div className="font-newspaper text-sm text-justify overflow-y-auto flex-grow mb-2 pr-1 mt-4">
                            {newsItem.content || newsItem.description}
                        </div>
                        <div className="text-sm text-gray-600 text-center mt-2 font-newspaper italic">
                            Click to reveal the truth...
                        </div>
                        <div className="mt-auto text-xs text-center border-t border-gray-300 pt-2">
                            {new Date(newsItem.pub_date).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute w-full h-full backface-hidden bg-yellow-50 border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                        style={{ transform: "rotateY(180deg)" }}
                    >
                        <div>
                            <div className="flex items-center justify-center mb-4">
                                {newsItem.is_verified ? (
                                    newsItem.misinformation_score > 50 ? (
                                        <div className="flex items-center text-red-600 font-bold text-xl">
                                            <XCircle className="mr-2" /> Misinformation Alert
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-green-600 font-bold text-xl">
                                            <CheckCircle className="mr-2" /> Verified
                                        </div>
                                    )
                                ) : (
                                    <div className="flex items-center text-gray-600 font-bold text-xl">
                                        <RotateCcw className="mr-2" /> Unverified
                                    </div>
                                )}
                            </div>

                            <p className="font-newspaper text-lg leading-relaxed">
                                {newsItem.fact_check_result || newsItem.description || "No specific fact check available."}
                            </p>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button
                                className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-bold text-sm"
                                onClick={(e) => { e.stopPropagation(); console.log("Reported as false"); }}
                            >
                                Report as false
                            </button>
                            <button
                                className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors font-bold text-sm flex items-center"
                                onClick={handleNext}
                            >
                                Next Story <ArrowRight className="ml-2 w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
            {/* Instructions for desktop - Moved below */}
            <div className="hidden md:block mt-4 text-sm text-gray-500 font-newspaper">
                Press <span className="font-bold bg-gray-200 px-1 rounded">Enter</span> to flip, <span className="font-bold bg-gray-200 px-1 rounded">→</span> for next
            </div>
        </div>
    );
};

export default Flashcard;
