"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { NeoButton } from '@/components/ui/NeoButton';
import {
    ArrowLeftIcon,
    DownloadIcon,
    FileIcon,
    ZapIcon,
    ShieldIcon,
    SparklesIcon,
    UserIcon
} from '@/components/Icons';
import { MemoryBank } from '@/types';

// Mock Data for the Canvas (Simulating a completed session)
const MOCK_DATA: MemoryBank = {
    chiefComplaint: "Severe migraine with light sensitivity and nausea",
    symptomTimeline: [
        { description: "Throbbing pain in left temple", duration: "2 days", severity: "Severe (8/10)" },
        { description: "Nausea and vomiting", duration: "Started this morning", severity: "Moderate" },
        { description: "Visual aura (flashing lights)", duration: "30 mins before headache", severity: "N/A" }
    ],
    currentMedications: [
        "Sumatriptan 50mg (as needed)",
        "Ibuprofen 400mg"
    ],
    familyHistory: [
        "Mother has history of migraines",
        "Father has hypertension"
    ],
    suggestedQuestions: [
        "Could this be a cluster headache given the location?",
        "Is my current dosage of Sumatriptan sufficient?",
        "Should I be concerned about the frequency increasing?"
    ]
};

export default function CanvasPage() {
    const [data, setData] = useState<MemoryBank | null>(null);
    const [currentDate, setCurrentDate] = useState<string>("");
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const fetchData = async () => {
            if (!sessionId) {
                // Fallback to mock data if no session ID
                setData(MOCK_DATA);
                setCurrentDate(new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }));
                return;
            }

            try {
                const res = await fetch(`http://localhost:8000/session/${sessionId}`);
                if (!res.ok) {
                    console.error(`Fetch failed with status: ${res.status} ${res.statusText}`);
                    throw new Error(`Failed to fetch session: ${res.status}`);
                }

                const backendData = await res.json();                // Map backend data to frontend MemoryBank
                const mappedData: MemoryBank = {
                    chiefComplaint: backendData.main_complaint || "Not recorded",
                    symptomTimeline: backendData.symptoms.map((s: any) => ({
                        description: s.description,
                        duration: s.duration,
                        severity: s.severity
                    })),
                    currentMedications: backendData.medications || [],
                    familyHistory: backendData.family_history || [],
                    suggestedQuestions: backendData.suggested_questions || []
                };

                setData(mappedData);
            } catch (error) {
                console.error("Error fetching session:", error);
                setData(MOCK_DATA); // Fallback on error
            }

            setCurrentDate(new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }));
        };

        fetchData();
    }, [sessionId]);

    const handlePrint = () => {
        window.print();
    };

    if (!data) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#1e1e1e] p-4 md:p-8 print:p-0 print:bg-white transition-colors duration-300">

            {/* Navigation Bar (Hidden when printing) */}
            <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between print:hidden">
                <Link href="/dashboard">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer group">
                        <div className="p-2 bg-white dark:bg-[#2a2a2a] rounded-full shadow-sm border border-gray-200 dark:border-[#333] group-hover:border-gray-300 dark:group-hover:border-[#444] transition-colors">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm">Back to Chat</span>
                    </div>
                </Link>

                <div className="flex gap-3">
                    <NeoButton onClick={handlePrint} width="w-auto" className="px-4 scale-95">
                        <div className="flex items-center gap-2">
                            <DownloadIcon className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Print / Save PDF</span>
                        </div>
                    </NeoButton>
                </div>
            </div>

            {/* Document Canvas */}
            <div className="max-w-3xl mx-auto bg-white dark:bg-[#2a2a2a] rounded-2xl shadow-xl print:shadow-none print:rounded-none overflow-hidden border border-gray-200 dark:border-[#333]">

                {/* Header */}
                <div className="bg-gray-50/50 dark:bg-[#252525] p-8 border-b border-gray-200 dark:border-[#333] flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <ShieldIcon className="w-5 h-5 text-white dark:text-black" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Doctor Briefing</h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Generated by Prepped Life Agent</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#333] rounded-lg border border-gray-200 dark:border-[#444] shadow-sm mb-2"></div>
                        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">{currentDate}</p>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-8 space-y-10">

                    {/* Section 1: Chief Complaint */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <ZapIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Chief Complaint</h2>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl p-6 shadow-sm">
                            <p className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                                "{data.chiefComplaint}"
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Symptom Timeline */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FileIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Symptom Timeline</h2>
                        </div>
                        <div className="space-y-3">
                            {data.symptomTimeline.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 border border-gray-200 dark:border-[#333] shadow-sm hover:border-gray-300 dark:hover:border-[#444] transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-gray-900 dark:text-white">{item.description}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-[#333] rounded-md text-gray-600 dark:text-gray-400 font-medium">
                                            {item.duration}
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-[#333] rounded-md text-gray-600 dark:text-gray-400 font-medium border border-gray-200 dark:border-[#444]">
                                            Severity: {item.severity}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Section 3: Medications */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Current Medications</h2>
                            </div>
                            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
                                <ul className="divide-y divide-gray-100 dark:divide-[#333]">
                                    {data.currentMedications.map((med, idx) => (
                                        <li key={idx} className="px-4 py-3 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                                            {med}
                                        </li>
                                    ))}
                                    {data.currentMedications.length === 0 && <li className="px-4 py-3 text-sm text-gray-400 italic">None recorded</li>}
                                </ul>
                            </div>
                        </section>

                        {/* Section 4: Family History */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <UserIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Family History</h2>
                            </div>
                            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
                                <ul className="divide-y divide-gray-100 dark:divide-[#333]">
                                    {data.familyHistory.map((item, idx) => (
                                        <li key={idx} className="px-4 py-3 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                                            {item}
                                        </li>
                                    ))}
                                    {data.familyHistory.length === 0 && <li className="px-4 py-3 text-sm text-gray-400 italic">None recorded</li>}
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Section 5: Suggested Questions */}
                    <section className="pt-8 border-t border-gray-200 dark:border-[#333]">
                        <div className="flex items-center gap-2 mb-6">
                            <SparklesIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Suggested Questions</h2>
                        </div>
                        <div className="grid gap-3">
                            {data.suggestedQuestions.map((q, idx) => (
                                <div key={idx} className="flex gap-4 p-4 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl transition-colors">
                                    <div className="shrink-0 w-6 h-6 bg-white dark:bg-[#333] rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-xs border border-gray-200 dark:border-[#444] shadow-sm">
                                        {idx + 1}
                                    </div>
                                    <p className="text-gray-800 dark:text-gray-200 font-medium text-sm pt-0.5">{q}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="pt-8 mt-4 text-center">
                        <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wider font-medium">
                            Confidential • Generated by AI • Not Medical Advice
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
