import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyIcon, CheckIcon } from './Icons';

interface MarkdownRendererProps {
  content: string;
  isUser: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isUser }) => {
  return (
    <div className={`markdown-content ${isUser ? 'text-gray-900 dark:text-gray-100' : 'text-gray-800 dark:text-gray-200'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="text-[15px] leading-relaxed font-medium mb-2 last:mb-0">{children}</p>,
          
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');
            const codeContent = String(children).replace(/\n$/, '');
            
            const [copied, setCopied] = useState(false);

            const handleCopy = () => {
                navigator.clipboard.writeText(codeContent);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            };
            
            if (isInline) {
              return (
                <code className="bg-gray-200/50 dark:bg-white/10 rounded px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:text-gray-200" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-4 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-800 dark:border-zinc-700 shadow-sm group">
                <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                    </div>
                    {match && (
                        <span className="text-xs text-gray-400 font-mono lowercase">
                        {match[1]}
                        </span>
                    )}
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                  >
                     {copied ? <CheckIcon className="w-3.5 h-3.5 text-green-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
                     <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="overflow-x-auto p-4">
                  <code className="text-sm font-mono text-gray-200 block whitespace-pre" {...props}>
                    {children}
                  </code>
                </div>
              </div>
            );
          },
          
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-[15px] leading-relaxed">{children}</li>,
          
          h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h3>,
          
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline decoration-blue-300 dark:decoration-blue-500 underline-offset-2"
            >
              {children}
            </a>
          ),
          
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-zinc-600 pl-4 my-2 italic text-gray-600 dark:text-gray-400">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};