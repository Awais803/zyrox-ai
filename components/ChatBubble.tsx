import React, { useState } from 'react';
import { Message, MessageAuthor } from '../types';

interface ChatBubbleProps {
  message: Message;
  isFirst?: boolean;
  isStreaming?: boolean;
}

const ZCoreAvatar: React.FC = () => (
    <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center shadow-lg bg-slate-900/70 border border-electric-cyan/30">
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
              <linearGradient id="grad-avatar-bubble" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#00FFFF'}} />
                  <stop offset="100%" style={{stopColor: '#FF00FF'}} />
              </linearGradient>
          </defs>
          <path d="M12 2L21.5 7V17L12 22L2.5 17V7L12 2Z" stroke="url(#grad-avatar-bubble)" strokeWidth="1" strokeOpacity="0.4"/>
          <g className="animate-pulsate origin-center">
              <path d="M17 6L7 6" stroke="url(#grad-avatar-bubble)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 6L17 18" stroke="url(#grad-avatar-bubble)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 18L7 18" stroke="url(#grad-avatar-bubble)" strokeWidth="2" strokeLinecap="round"/>
          </g>
      </svg>
    </div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 rounded-full bg-black/20 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/40 hover:text-white"
            aria-label="Copy message"
        >
            {isCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
        </button>
    );
};


const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isFirst, isStreaming }) => {
  const isUser = message.author === MessageAuthor.USER;

  if (isUser) {
    return (
      <div className="self-end animate-slide-in-right group relative">
        <div className="max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-lg bg-gradient-to-br from-violet-600 to-hot-magenta text-white rounded-br-none">
          <p className="whitespace-pre-wrap break-words text-base leading-relaxed">{message.content}</p>
        </div>
        <CopyButton text={message.content} />
      </div>
    );
  }

  // AI/Model bubble
  return (
    <div className="self-start flex items-end space-x-2 max-w-md lg:max-w-2xl animate-slide-in-left">
      <div className="w-10 flex-shrink-0">
        {isFirst && <ZCoreAvatar />}
      </div>
      <div className="relative group">
        <div
          className={`px-4 py-3 rounded-2xl shadow-lg bg-white/10 backdrop-blur-xl text-slate-100 rounded-bl-none border border-white/10`}
        >
          <p className="whitespace-pre-wrap break-words text-base leading-relaxed">
            {message.content || ' '}
            {isStreaming && <span className="inline-block w-0.5 h-5 bg-electric-cyan animate-blink ml-1 align-bottom"></span>}
          </p>
        </div>
        {message.content && <CopyButton text={message.content} />}
      </div>
    </div>
  );
};

export default ChatBubble;