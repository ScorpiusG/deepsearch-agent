'use client';

import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput() {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    console.log("User said:", input);
    setInput('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything... (e.g., 'Compare iPhone 15 vs S24')"
          className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        AI Agent can make mistakes. Verify important info.
      </p>
    </div>
  );
}