
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#1e1e1e] border-b border-[#333] sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-tr from-yellow-400 to-orange-500 p-1.5 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          TASHAN WIN
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-[#2a2a2a] px-3 py-1 rounded-full border border-yellow-500/30">
          <span className="text-xs text-yellow-500 font-medium">PREMIUM HACK</span>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Header;
