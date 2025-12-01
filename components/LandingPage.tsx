"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowUpIcon,
    CodeIcon,
    MenuIcon,
    FigmaIcon,
    PaperclipIcon,
    ThingRetroMacIcon,
    ThingCassetteIcon,
    ThingCubeIcon,
    ThingCameraIcon,
    ThingJoystickIcon,
    ThingChipIcon,
    MoonIcon,
    SunIcon,
    XIcon,
    ShieldIcon,
    UserIcon,
    FileIcon,
    ZapIcon,
    SparklesIcon,
    BrainIcon,
    FileTextIcon,
    CheckIcon
} from './Icons';
import { MessageRole, MessageType } from '../types';
import { MessageBubble } from './ui/MessageBubble';
import { NeoButton } from './ui/NeoButton';
import { useTheme } from './ThemeContext';

const BlueprintBackground = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.4] select-none overflow-hidden">
        <div className="absolute h-full w-px border-l border-dashed border-zinc-400 dark:border-[#454545]"></div>
        <div className="absolute w-full h-px border-t border-dashed border-zinc-400 dark:border-[#454545]"></div>
        <div className="absolute h-full w-[600px] border-x border-dashed border-zinc-300 dark:border-[#333333]"></div>
        <div className="absolute w-full h-[600px] border-y border-dashed border-zinc-300 dark:border-[#333333]"></div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#FAFAFA_90%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#2a2a2a_90%)]"></div>
    </div>
);

const LandingCard: React.FC<{ children: React.ReactNode, className?: string, noHover?: boolean }> = ({ children, className = "", noHover = false }) => {
    return (
        <div
            className={`
                group relative overflow-hidden
                bg-white dark:bg-[#3a3a3a] rounded-3xl
                border border-gray-200/80 dark:border-[#454545]
                shadow-[0_2px_8px_rgba(0,0,0,0.02)]
                ${!noHover && 'hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-gray-300/80 dark:hover:border-gray-500 hover:-translate-y-1'}
                transition-all duration-500 ease-out
                ${className}
            `}
        >
            {children}
        </div>
    );
};

const NumberTicker = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    const duration = 2000;
                    const start = 0;
                    const end = value;
                    const startTime = performance.now();

                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 4);

                        setCount(Math.floor(start + (end - start) * ease));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };

                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [value]);

    return <span ref={ref}>{count}</span>;
};

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    return (
        <>
            <nav className={`
                fixed top-0 left-0 right-0 z-50 transition-all duration-500
                ${scrolled ? 'bg-white/80 dark:bg-[#2a2a2a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-[#333333] py-3' : 'bg-transparent border-transparent py-6'}
            `}>
                <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-gray-900 to-black dark:from-[#4a4a4a] dark:to-[#2a2a2a] flex items-center justify-center shadow-lg ring-1 ring-black/5 dark:ring-[#333333]">
                            <ShieldIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white tracking-tight text-lg">Prepped</span>
                    </div>

                    <div className="hidden md:flex items-center gap-1">
                        {['Features', 'Privacy', 'For Doctors'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-white/5"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="hidden md:flex p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                        </button>

                        {isLoggedIn ? (
                            <div className="hidden md:block">
                                <NeoButton
                                    onClick={() => router.push('/dashboard')}
                                    width="w-[140px]"
                                    height="h-[40px]"
                                    className="scale-95"
                                >
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Go to Dashboard</span>
                                </NeoButton>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors border border-transparent dark:border-gray-800 rounded-full"
                                >
                                    Log in
                                </button>
                                <NeoButton
                                    onClick={() => router.push('/register')}
                                    width="w-[110px]"
                                    height="h-[40px]"
                                    className="scale-95"
                                >
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Get Started</span>
                                </NeoButton>
                            </div>
                        )}

                        <button
                            className="md:hidden p-2 text-gray-900 dark:text-white"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-60 bg-white/95 dark:bg-[#2a2a2a]/95 backdrop-blur-xl flex flex-col p-6 animate-in slide-in-from-top-10 duration-300 md:hidden">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-gray-900 to-black dark:from-[#4a4a4a] dark:to-[#2a2a2a] flex items-center justify-center shadow-lg">
                                <ShieldIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white tracking-tight text-lg">Menu</span>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-full bg-gray-100 dark:bg-[#3a3a3a] text-gray-900 dark:text-white"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-6 text-2xl font-medium text-gray-900 dark:text-white">
                        <a href="#" className="hover:text-gray-500 transition-colors">Features</a>
                        <a href="#" className="hover:text-gray-500 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-500 transition-colors">For Doctors</a>
                    </nav>

                    <div className="mt-auto flex flex-col gap-4 pb-8">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-between w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-[#3a3a3a] text-gray-900 dark:text-white font-medium"
                        >
                            <span>Appearance</span>
                            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                        </button>

                        {isLoggedIn ? (
                            <NeoButton
                                onClick={() => router.push('/dashboard')}
                                width="w-full"
                                height="h-[56px]"
                            >
                                <span className="text-base font-semibold text-gray-800 dark:text-gray-200">Go to Dashboard</span>
                            </NeoButton>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full h-14 rounded-xl border border-gray-200 dark:border-[#454545] text-gray-900 dark:text-white font-medium"
                                >
                                    Log in
                                </button>
                                <NeoButton
                                    onClick={() => router.push('/register')}
                                    width="w-full"
                                    height="h-[56px]"
                                >
                                    <span className="text-base font-semibold text-gray-800 dark:text-gray-200">Get Started</span>
                                </NeoButton>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export const LandingPage: React.FC = () => {
    const { toggleTheme, theme } = useTheme();
    const router = useRouter();

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-[#2a2a2a] relative font-sans selection:bg-gray-200 dark:selection:bg-white/20 transition-colors duration-500">
            <Navbar />

            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-screen">
                <BlueprintBackground />

                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="w-full h-0.5 bg-linear-to-r from-transparent via-gray-400/30 dark:via-white/20 to-transparent absolute top-0 animate-scan"></div>
                </div>

                <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center">

                    <div className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-[#3a3a3a]/50 backdrop-blur-sm border border-gray-200 dark:border-[#454545] shadow-sm mb-8 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-default">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide uppercase">Agent Active</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-gray-900 dark:text-white mb-8 leading-[0.9] select-none text-balance">
                            Your AI <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-b from-gray-500 to-gray-900 dark:from-zinc-400 dark:to-zinc-100">Medical Agent.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium tracking-tight mb-10">
                            The autonomous clinical assistant that interviews patients, structures history, and prepares briefing documents.
                        </p>

                        <div className="flex items-center gap-4">
                            <NeoButton
                                onClick={() => router.push('/login')}
                                width="w-[200px]"
                                height="h-[56px]"
                            >
                                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-tight">Start Intake</span>
                            </NeoButton>

                            <button className="px-6 py-3 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                View Demo
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full max-w-4xl mx-auto mt-12 perspective-[2000px] group">
                        <div className="relative transform rotate-x-12 group-hover:rotate-x-0 transition-transform duration-1000 ease-out">
                            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent dark:from-[#2a2a2a] z-20 pointer-events-none h-full bottom-0"></div>

                            <div className="bg-white dark:bg-[#1e1e1e] rounded-t-3xl border border-gray-200 dark:border-[#333] shadow-2xl overflow-hidden min-h-[400px] relative">
                                <div className="h-12 border-b border-gray-100 dark:border-[#333] flex items-center px-4 gap-2 bg-gray-50/50 dark:bg-[#252525]">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                                    </div>
                                    <div className="ml-4 px-3 py-1 rounded-md bg-white dark:bg-[#333] border border-gray-200 dark:border-[#444] text-[10px] text-gray-400 font-mono flex-1 text-center">
                                        prepped.health/intake/session-active
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col gap-6 max-w-2xl mx-auto pt-12">
                                    <MessageBubble message={{
                                        id: 'h1',
                                        role: MessageRole.ASSISTANT,
                                        content: "I understand you've been experiencing migraines. Can you describe the location of the pain?",
                                        type: MessageType.TEXT,
                                        timestamp: 0
                                    }} />
                                    <MessageBubble message={{
                                        id: 'h2',
                                        role: MessageRole.USER,
                                        content: "It's mostly on the left side, behind my eye. It throbs when I move.",
                                        type: MessageType.TEXT,
                                        timestamp: 0
                                    }} />
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 animate-pulse ml-4">
                                        <SparklesIcon className="w-3 h-3" />
                                        <span>Agent analyzing symptoms...</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -inset-4 bg-linear-to-t from-blue-500/20 to-purple-500/20 blur-3xl -z-10 opacity-50 rounded-[3rem]"></div>
                    </div>

                </div>
            </section>

            <section className="py-32 bg-white dark:bg-[#2a2a2a] relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <BrainIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />,
                                title: "Clinical Reasoning",
                                desc: "Uses advanced LLMs to ask follow-up questions based on medical guidelines, not just scripts."
                            },
                            {
                                icon: <FileTextIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />,
                                title: "Structured Output",
                                desc: "Converts conversational history into professional SOAP notes and briefing documents instantly."
                            },
                            {
                                icon: <ShieldIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />,
                                title: "Secure & Private",
                                desc: "Built with privacy-first architecture. Data is encrypted and processed with strict compliance."
                            }
                        ].map((feature, idx) => (
                            <LandingCard key={idx} className="p-8 min-h-80 flex flex-col justify-between bg-gray-50/50 dark:bg-[#333333]">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#444] border border-gray-100 dark:border-[#555] flex items-center justify-center mb-6 shadow-sm">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">{feature.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
                                </div>
                            </LandingCard>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 relative overflow-hidden border-y border-gray-100 dark:border-[#333]">
                <div className="absolute inset-0 bg-gray-50 dark:bg-[#252525]"></div>
                <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-16">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900 dark:text-white mb-6">
                                Save 15 minutes <br />
                                <span className="text-gray-400 dark:text-gray-500">per patient encounter.</span>
                            </h2>
                            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-8">
                                Let the agent handle the routine history taking. You focus on diagnosis, treatment, and connection.
                            </p>
                            <div className="flex flex-col gap-4">
                                {[
                                    "Complete history before you enter the room",
                                    "Automated symptom analysis & flagging",
                                    "Instant integration with EHR formats"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <CheckIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:w-1/2 relative">
                            <div className="absolute -inset-4 bg-linear-to-r from-gray-200 to-gray-100 dark:from-[#333] dark:to-[#2a2a2a] rounded-4xl rotate-3 opacity-50"></div>
                            <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-200 dark:border-[#333] shadow-xl p-8 relative">
                                <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-[#333] pb-4">
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Generated Output</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">Clinical Briefing</div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wide">
                                        Ready
                                    </div>
                                </div>
                                <div className="space-y-4 font-mono text-sm text-gray-600 dark:text-gray-300">
                                    <div className="p-3 bg-gray-50 dark:bg-[#252525] rounded-lg border border-gray-100 dark:border-[#333]">
                                        <span className="text-gray-400 font-bold mr-2">CC:</span>
                                        Severe migraine, left-sided, photophobia.
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-[#252525] rounded-lg border border-gray-100 dark:border-[#333]">
                                        <span className="text-gray-400 font-bold mr-2">HPI:</span>
                                        Patient reports 3-day history of pulsating headache...
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-[#252525] rounded-lg border border-gray-100 dark:border-[#333]">
                                        <span className="text-gray-400 font-bold mr-2">ROS:</span>
                                        (+) Nausea, (+) Visual aura. (-) Fever, (-) Neck stiffness.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>            <section className="pt-24 pb-12 md:pt-24 md:pb-12 bg-white dark:bg-[#2a2a2a] flex flex-col items-center justify-center border-t border-dashed border-zinc-200 dark:border-[#333333] overflow-hidden relative">
                <div className="absolute inset-0 pointer-events-none opacity-[0.2]">
                    <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center w-full px-6">

                    <h2 className="text-[15vw] md:text-[180px] leading-[0.8] font-black tracking-tighter text-gray-900 dark:text-white text-center select-none animate-in fade-in zoom-in-50 duration-1000 drop-shadow-sm font-sans condensed">
                        <NumberTicker value={100} />%
                    </h2>
                    <p className="text-xl md:text-2xl font-medium text-gray-500 dark:text-gray-400 mt-8 tracking-tight">
                        Private & Secure
                    </p>
                </div>
            </section>

            <section className="pt-24 pb-24 bg-white dark:bg-[#2a2a2a] border-t border-dashed border-zinc-200 dark:border-[#333333] relative z-30">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="mb-16 flex items-end justify-between">
                        <h2 className="text-4xl font-semibold tracking-tighter text-gray-900 dark:text-white">How it works.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <LandingCard className="p-8 min-h-[360px] flex flex-col relative bg-white dark:bg-[#3a3a3a]">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#4a4a4a] border border-gray-200 dark:border-[#454545] flex items-center justify-center mb-6 text-lg font-bold text-gray-900 dark:text-white">1</div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">Chat with Agent</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
                                Describe your symptoms naturally. Our agent asks clarifying questions to understand your condition fully.
                            </p>
                            <div className="mt-auto relative h-32 w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-[#454545]">
                                <div className="absolute top-4 left-4 right-4">
                                    <MessageBubble message={{ id: 's1', role: MessageRole.USER, content: "My throat hurts when I swallow.", type: MessageType.TEXT, timestamp: 0 }} />
                                </div>
                            </div>
                        </LandingCard>

                        <LandingCard className="p-8 min-h-[360px] flex flex-col relative bg-white dark:bg-[#3a3a3a]">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#4a4a4a] border border-gray-200 dark:border-[#454545] flex items-center justify-center mb-6 text-lg font-bold text-gray-900 dark:text-white">2</div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">Clinical Analysis</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
                                The system structures your input into a clinical timeline and identifies key medical details.
                            </p>
                            <div className="mt-auto relative h-32 w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-[#454545] p-4 flex items-center justify-center">
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">Symptom</div>
                                    <div className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium">Duration</div>
                                    <div className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium">Severity</div>
                                </div>
                            </div>
                        </LandingCard>

                        <LandingCard className="p-8 min-h-[360px] flex flex-col relative bg-white dark:bg-[#3a3a3a]">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#4a4a4a] border border-gray-200 dark:border-[#454545] flex items-center justify-center mb-6 text-lg font-bold text-gray-900 dark:text-white">3</div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">Doctor Briefing</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
                                Receive a professional summary to share with your provider, saving time and ensuring accuracy.
                            </p>
                            <div className="mt-auto relative h-32 w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-[#454545] p-4">
                                <div className="w-full h-2 bg-gray-200 dark:bg-[#454545] rounded-full mb-2"></div>
                                <div className="w-3/4 h-2 bg-gray-200 dark:bg-[#454545] rounded-full mb-2"></div>
                                <div className="w-1/2 h-2 bg-gray-200 dark:bg-[#454545] rounded-full"></div>
                            </div>
                        </LandingCard>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-gray-200 dark:border-[#333333] bg-white dark:bg-[#2a2a2a]">
                <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                            <ShieldIcon className="w-3 h-3 text-white dark:text-black" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white tracking-tight">Prepped</span>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
                    </div>

                    <div className="text-sm text-gray-400 font-medium text-right">
                        <p>Prepped Capstone Project.</p>
                        <p className="text-xs mt-1 opacity-70">Kaggle 5-Day Intensive AI Agent Course</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};