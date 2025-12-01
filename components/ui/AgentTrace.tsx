import React, { useState } from 'react';
import { ExecutionStep } from '../../types';
import { ThingChipIcon, ZapIcon, FileIcon, SparklesIcon, ArrowRightIcon, EyeIcon, EyeOffIcon } from '../Icons';

interface AgentTraceProps {
    steps: ExecutionStep[];
}

export const AgentTrace: React.FC<AgentTraceProps> = ({ steps }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (!steps || steps.length === 0) return null;

    return (
        <div className="mt-3 mb-2 space-y-2">
            <div 
                className="flex items-center gap-2 mb-2 group cursor-pointer select-none" 
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Hide Agent Workflow" : "Show Agent Workflow"}
            >
                <div className="h-px flex-1 bg-gray-200 dark:bg-[#333]"></div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    Agent Workflow
                    {isExpanded ? <EyeOffIcon className="w-3 h-3" /> : <EyeIcon className="w-3 h-3" />}
                </span>
                <div className="h-px flex-1 bg-gray-200 dark:bg-[#333]"></div>
            </div>
            
            {isExpanded && (
                <div className="relative pl-4 border-l-2 border-gray-100 dark:border-[#333] space-y-3 ml-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className={`
                                absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#2a2a2a]
                                ${step.type === 'thought' ? 'bg-gray-300 dark:bg-gray-600' : 
                                  step.type === 'tool_call' ? 'bg-blue-400' : 
                                  step.type === 'action' ? 'bg-green-500' : 
                                  'bg-purple-500'}
                            `}></div>

                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 shrink-0">
                                    {step.type === 'thought' && <ThingChipIcon className="w-3.5 h-3.5 text-gray-400" />}
                                    {step.type === 'tool_call' && <ZapIcon className="w-3.5 h-3.5 text-blue-500" />}
                                    {step.type === 'action' && <FileIcon className="w-3.5 h-3.5 text-green-500" />}
                                    {step.type === 'handoff' && <ArrowRightIcon className="w-3.5 h-3.5 text-purple-500" />}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-medium ${
                                        step.type === 'thought' ? 'text-gray-500 dark:text-gray-400 italic' :
                                        step.type === 'tool_call' ? 'text-blue-600 dark:text-blue-400 font-mono' :
                                        step.type === 'action' ? 'text-green-700 dark:text-green-400' :
                                        'text-purple-600 dark:text-purple-400 font-bold'
                                    }`}>
                                        {step.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
