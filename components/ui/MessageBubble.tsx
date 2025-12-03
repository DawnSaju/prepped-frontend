import React from 'react';
import Link from 'next/link';
import { Message, MessageRole, MessageType } from '../../types';
import { FigmaIcon, PaperclipIcon, ArrowRightIcon } from '../Icons';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { AudioPlayer } from '../AudioPlayer';
import { NeoButton } from './NeoButton';
import { AgentTrace } from './AgentTrace';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  const bubbleShadow = "rgba(0, 0, 0, 0) 0px 4px 12px, rgba(0, 0, 0, 0.06) 0px 2px 4px, rgba(255, 255, 255, 0.6) 0px 1px 0px inset, rgba(0, 0, 0, 0.1) 0px -1px 0px inset";

  const bubbleShadowDark = "rgba(0, 0, 0, 0) 0px 4px 12px, rgba(0, 0, 0, 0.06) 0px 2px 4px, rgba(255, 255, 255, 0.1) 0px 1px 0px inset, rgba(0, 0, 0, 0.5) 0px -1px 0px inset";

  const iconContainerShadow = "rgba(0, 0, 0, 0.2) 0px 3px 8px, rgba(0, 0, 0, 0.15) 0px 1px 3px, rgba(255, 255, 255, 0.4) 0px 1px 2px inset, rgba(0, 0, 0, 0.25) 0px -2px 3px inset";

  const containerClass = `flex w-full mb-3 ${isUser ? 'justify-end' : 'justify-start'}`;

  const bubbleClass = `
    relative 
    rounded-2xl md:rounded-3xl 
    px-4 py-2.5 md:px-6 md:py-3 
    border 
    border-gray-300/50 dark:border-[#454545]
    transition-colors 
    duration-300 
    max-w-[85vw] md:max-w-[600px]
    overflow-visible
    ${isUser
      ? 'bg-linear-to-b from-gray-100 to-gray-200 dark:from-[#4a4a4a] dark:to-[#3a3a3a]'
      : 'bg-white dark:bg-[#3a3a3a] border-gray-200 dark:border-[#454545]'
    }
  `;

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-start max-w-[600px]">
        {!isUser && message.agentName && (
          <div className="ml-2 mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${message.agentName.includes('Analyst') ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
            {message.agentName}
          </div>
        )}
        <div
          className={bubbleClass}
          style={{ boxShadow: isUser ? 'var(--shadow-user-bubble)' : '0 2px 5px rgba(0,0,0,0.05)' }}
        >
        {message.imageUrl && (
          <div className="mb-3 mt-1 group cursor-pointer relative inline-block">
            <div className="absolute top-1 left-1 w-full h-full bg-gray-200 dark:bg-[#4a4a4a] rounded-lg -z-10 rotate-3 transition-transform group-hover:rotate-6"></div>
            <div className="absolute top-0.5 left-0.5 w-full h-full bg-gray-300 dark:bg-[#5a5a5a] rounded-lg -z-20 rotate-1 transition-transform group-hover:rotate-3"></div>

            <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-lg overflow-hidden border-2 border-white dark:border-[#3a3a3a] shadow-sm bg-white dark:bg-[#2a2a2a]">
              <img
                src={message.imageUrl}
                alt="Attachment"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
              </div>
            </div>

            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-[#3a3a3a] rounded-full p-1 border border-gray-100 dark:border-[#454545] shadow-sm text-gray-500 dark:text-gray-400">
              <PaperclipIcon className="w-3 h-3" />
            </div>
          </div>
        )}

        {message.type === MessageType.AUDIO && (
          <AudioPlayer src={message.audioData} />
        )}

        {message.type === MessageType.FIGMA_CARD && (
          <div className="flex flex-wrap gap-2 mb-3.5">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-linear-to-b from-gray-100 to-gray-200 dark:from-[#4a4a4a] dark:to-[#3a3a3a] rounded-full border border-gray-300/50 dark:border-[#454545]">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center relative p-1"
                style={{
                  backgroundColor: 'rgb(50, 51, 62)',
                  boxShadow: iconContainerShadow
                }}
              >
                <div className="absolute inset-0 rounded-full opacity-40" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)' }} />
                <FigmaIcon className="relative w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700 dark:text-blue-400 font-medium text-sm tracking-normal">Figma</span>
            </div>
          </div>
        )}

        {message.content && (
          <MarkdownRenderer content={message.content} isUser={isUser} />
        )}

        {message.trace && message.trace.length > 0 && (
          <AgentTrace steps={message.trace} />
        )}

        {message.action && (
          <div className="mt-4">
            <Link href={message.action.url}>
              <NeoButton width="w-auto" height="h-10" className="px-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{message.action.label}</span>
                  <ArrowRightIcon className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                </div>
              </NeoButton>
            </Link>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};