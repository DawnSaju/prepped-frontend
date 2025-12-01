import React from 'react';
import { UserIcon, ZapIcon, ShieldIcon, FileIcon, ThingChipIcon, SparklesIcon } from './Icons';
import { MemoryBank } from '../types';

interface MedicalProfileCardProps {
    memoryBank: MemoryBank;
}

export const MedicalProfileCard: React.FC<MedicalProfileCardProps> = ({ memoryBank }) => {
    return (
        <div className="w-80 h-full border-r border-gray-200 dark:border-[#454545] bg-gray-50/50 dark:bg-[#2a2a2a] flex flex-col overflow-hidden transition-all duration-300">
            <div className="p-4 border-b border-gray-200 dark:border-[#454545] flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <ThingChipIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">Live Memory Bank</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Structured Context</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <ZapIcon className="w-3 h-3" /> Chief Complaint
                    </h3>
                    <div className="bg-white dark:bg-[#3a3a3a] rounded-xl p-3 shadow-sm border border-gray-200/50 dark:border-[#454545]">
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                            {memoryBank.chiefComplaint ? `"${memoryBank.chiefComplaint}"` : <span className="text-gray-400 italic">Pending input...</span>}
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <FileIcon className="w-3 h-3" /> Symptom Timeline
                    </h3>
                    <div className="space-y-2">
                        {memoryBank.symptomTimeline.length > 0 ? memoryBank.symptomTimeline.map((symptom, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#3a3a3a] rounded-xl p-3 shadow-sm border border-gray-200/50 dark:border-[#454545]">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{symptom.description}</span>
                                    <span className="text-[10px] bg-gray-100 dark:bg-[#4a4a4a] px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400 whitespace-nowrap">{symptom.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded border border-amber-100 dark:border-amber-900/30">
                                        Severity: {symptom.severity}
                                    </span>
                                </div>
                                {symptom.notes && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic border-t border-gray-100 dark:border-[#454545] pt-2">
                                        Note: {symptom.notes}
                                    </p>
                                )}
                            </div>
                        )) : (
                            <div className="text-xs text-gray-400 italic p-2">No symptoms recorded yet.</div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldIcon className="w-3 h-3" /> Current Medications
                    </h3>
                    <div className="bg-white dark:bg-[#3a3a3a] rounded-xl p-1 shadow-sm border border-gray-200/50 dark:border-[#454545]">
                        {memoryBank.currentMedications.length > 0 ? memoryBank.currentMedications.map((med, idx) => (
                            <div key={idx} className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 border-b last:border-0 border-gray-100 dark:border-[#454545] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                {med}
                            </div>
                        )) : (
                            <div className="px-3 py-2 text-xs text-gray-400 italic">None recorded</div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <UserIcon className="w-3 h-3" /> Family History
                    </h3>
                    <div className="bg-white dark:bg-[#3a3a3a] rounded-xl p-1 shadow-sm border border-gray-200/50 dark:border-[#454545]">
                        {memoryBank.familyHistory.length > 0 ? memoryBank.familyHistory.map((item, idx) => (
                            <div key={idx} className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 border-b last:border-0 border-gray-100 dark:border-[#454545] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                {item}
                            </div>
                        )) : (
                            <div className="px-3 py-2 text-xs text-gray-400 italic">None recorded</div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <SparklesIcon className="w-3 h-3 text-purple-500" /> Suggested Questions
                    </h3>
                    <div className="space-y-2">
                        {memoryBank.suggestedQuestions.length > 0 ? memoryBank.suggestedQuestions.map((q, idx) => (
                            <div key={idx} className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-lg p-3">
                                <p className="text-xs font-medium text-purple-900 dark:text-purple-100">
                                    "{q}"
                                </p>
                            </div>
                        )) : (
                            <div className="text-xs text-gray-400 italic p-2">Waiting for analysis...</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
