import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon } from './Icons';

interface AudioPlayerProps {
    src?: string;
    duration?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, duration = "0:00" }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (src) {
            audioRef.current = new Audio(src);
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                setProgress(0);
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
            });
            
            audioRef.current.addEventListener('timeupdate', () => {
                if (audioRef.current && audioRef.current.duration) {
                     const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                     setProgress(p);
                }
            });
        }
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        }
    }, [src]);

    const togglePlay = () => {
        if (src && audioRef.current) {
             if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        } else {
            if (isPlaying) {
                setIsPlaying(false);
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
            } else {
                setIsPlaying(true);
                const animate = () => {
                    setProgress(prev => (prev + 0.5) % 100);
                    animationRef.current = requestAnimationFrame(animate);
                };
                animate();
            }
        }
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    const [bars] = useState(() => Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.2));

    return (
        <div className="flex flex-col w-full max-w-sm">
            <div className="relative rounded-2xl bg-gray-100 dark:bg-[#2a2a2a] p-4 shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
                
                <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={togglePlay}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-0.5" />}
                        </button>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {src ? 'Voice Note' : 'Audio Message'}
                        </span>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{duration}</span>
                </div>

                <div className="relative h-12 flex items-center gap-0.5 opacity-80">
                    <div className="absolute inset-0 flex items-center justify-between gap-0.5 w-full">
                        {bars.map((height, i) => (
                            <div 
                                key={i} 
                                className="w-1.5 bg-gray-300 dark:bg-white/20 rounded-full"
                                style={{ height: `${height * 100}%` }}
                            ></div>
                        ))}
                    </div>

                    <div 
                        className="absolute inset-y-0 left-0 flex items-center justify-between gap-0.5 w-full overflow-hidden transition-[width] duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                    >
                         <div className="min-w-full h-full flex items-center justify-between gap-0.5">
                            {bars.map((height, i) => (
                                <div 
                                    key={`active-${i}`} 
                                    className="w-1.5 bg-gray-900 dark:bg-white rounded-full"
                                    style={{ height: `${height * 100}%` }}
                                ></div>
                            ))}
                         </div>
                    </div>

                    <div 
                        className="absolute top-0 bottom-0 w-px bg-black dark:bg-white transition-[left] duration-75 ease-linear z-20"
                        style={{ left: `${progress}%` }}
                    >
                         <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 bg-black dark:bg-white rounded-sm rotate-45 transform origin-center"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};