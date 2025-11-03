import React from 'react';

const ZCoreAvatar: React.FC = () => (
    <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center shadow-lg bg-cyber-purple/80 ring-1 ring-electric-cyan/30">
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
              <linearGradient id="grad-avatar-typing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#00FFFF'}} />
                  <stop offset="100%" style={{stopColor: '#FF00FF'}} />
              </linearGradient>
          </defs>
          <path d="M12 2L21.5 7V17L12 22L2.5 17V7L12 2Z" stroke="url(#grad-avatar-typing)" strokeWidth="1" strokeOpacity="0.4"/>
          <g className="animate-pulsate origin-center">
              <path d="M17 6L7 6" stroke="url(#grad-avatar-typing)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 6L17 18" stroke="url(#grad-avatar-typing)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 18L7 18" stroke="url(#grad-avatar-typing)" strokeWidth="2" strokeLinecap="round"/>
          </g>
      </svg>
    </div>
);

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end space-x-2 self-start animate-slide-in-left">
      <ZCoreAvatar />
      <div className="px-4 py-3 rounded-2xl bg-slate-800/50 backdrop-blur-lg rounded-bl-none ring-1 ring-electric-cyan/20 shadow-lg">
        <div className="flex items-center justify-center space-x-1.5">
          <div className="w-2 h-2 bg-electric-cyan rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-electric-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-electric-cyan rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;