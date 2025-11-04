import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 p-4 bg-slate-900/50 backdrop-blur-lg border-b border-white/5">
      <div className="container mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-hot-magenta"
            style={{ textShadow: '0 0 15px rgba(255, 0, 255, 0.3)' }}>
          Zyrox AI Chat
        </h1>
        <p className="text-sm text-slate-400">Powered by Zyrox</p>
      </div>
    </header>
  );
};

export default Header;