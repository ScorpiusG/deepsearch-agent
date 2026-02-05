// src/components/ChatInput.tsx
'use client';

import { ChangeEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ChatInput({ value, handleChange }: ChatInputProps) {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
      <div className="relative flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Ask me anything... (e.g., 'Compare iPhone 15 vs S24')"
          className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="absolute right-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        Powered by Google Gemini 2.5 Flash
      </p>
    </div>
  );
}