import React, { useState } from 'react';

interface InputBarProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="sticky bottom-0 z-20 p-4 bg-slate-950/30 backdrop-blur-lg border-t border-white/5">
      <div className="container mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="relative w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Zyrox anything..."
              disabled={isLoading}
              className="w-full pl-4 pr-12 py-3 bg-white/10 text-slate-100 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-electric-cyan transition-all duration-300 disabled:opacity-50 placeholder:text-slate-500"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-electric-cyan to-hot-magenta text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-hot-magenta animate-breathing-glow"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 transform rotate-0">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputBar;