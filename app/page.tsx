import ChatInput from '@/components/ChatInput';

const dummyMessages = [
  { role: 'assistant', content: 'Hello! I am your research agent. What would you like to know?' },
];

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      
      <header className="flex-none p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-blue-600">🔍</span> DeepSearch Agent
          </h1>
          <div className="text-xs font-medium px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            System: Online
          </div>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto w-full">
        <div className="max-w-3xl mx-auto p-4 space-y-6">
          {dummyMessages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                  AI
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-tl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold shrink-0">
                  U
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <ChatInput />

    </main>
  );
}