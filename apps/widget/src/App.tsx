import React, { useRef, useEffect, useState } from 'react';
import { useWidgetStore } from './hooks/useWidgetStore';

interface AppProps {
  config?: {
    theme?: 'light' | 'dark';
    apiHost?: string;
  };
}

const SUGGESTIONS = [
  'What is Scout.io?',
  'How do I sync a knowledge source?',
  'Explain RAG workflows',
];

export default function App({ config = {} }: AppProps) {
  const { isOpen, messages, isTyping, toggleOpen, addMessage, setTyping } = useWidgetStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDarkMode = config.theme === 'dark';

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage(text, 'user');
    setInputValue('');

    // Simulate bot response
    setTyping(true);
    setTimeout(() => {
      let reply = "That's a great question! I'm currently configured in demo mode, but in production, I'll connect to the Scout.io backend to retrieve and summarize information from your synced knowledge bases using advanced RAG pipelines.";
      
      if (text.toLowerCase().includes('scout.io') || text.toLowerCase().includes('what is')) {
        reply = "Scout.io is a next-generation AI-powered Knowledge Base and RAG platform. It allows teams to sync diverse documents (from Notion, Google Drive, or APIs), build vector databases (with Qdrant & Supabase), and deploy embeddable chat widgets just like this one to answer users' queries instantly.";
      } else if (text.toLowerCase().includes('rag') || text.toLowerCase().includes('workflow')) {
        reply = "Scout.io uses Retrieval-Augmented Generation (RAG). When you ask a question, we create an embedding, query Qdrant to find the most relevant document chunks, and supply those chunks to OpenAI to synthesize an accurate, grounded response.";
      } else if (text.toLowerCase().includes('sync') || text.toLowerCase().includes('source')) {
        reply = "You can sync knowledge sources by connecting external SaaS apps or uploading documents. Our backend uses automated n8n workflows to parse documents, chunk them, embed them using sentence-transformers, and insert them into your Qdrant index.";
      }

      setTyping(false);
      addMessage(reply, 'bot');
    }, 1500);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 font-sans ${isDarkMode ? 'dark' : ''}`}>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 to-sky-400 text-white shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 animate-bounce-subtle"
          style={{
            boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.4), 0 8px 10px -6px rgba(14, 165, 233, 0.4)'
          }}
          aria-label="Open chat assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`flex h-[520px] w-[380px] flex-col rounded-2xl shadow-2xl transition-all duration-300 animate-slide-in overflow-hidden ${
            isDarkMode ? 'glass-effect-dark text-slate-100' : 'glass-effect text-slate-800'
          }`}
          style={{
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-brand-600 to-sky-500 p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold backdrop-blur-sm">
                  S
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-brand-600 bg-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold leading-tight">Scout.io AI</h3>
                <p className="text-xs text-sky-100">Answers instantly from synced docs</p>
              </div>
            </div>
            <button 
              onClick={toggleOpen} 
              className="rounded-full p-1.5 hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-tr-none' 
                      : isDarkMode 
                        ? 'bg-slate-800 text-slate-100 border border-slate-700/50 rounded-tl-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>
                <span className="mt-1 text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className={`rounded-2xl rounded-tl-none px-4 py-3 border shadow-sm ${
                  isDarkMode ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-100'
                }`}>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSubmit(suggestion)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all text-left duration-200 hover:scale-[1.02] ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-brand-500 text-slate-300' 
                      : 'bg-white border-slate-200 hover:bg-brand-50/50 hover:border-brand-500 text-slate-600'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(inputValue);
            }}
            className={`p-3 border-t flex items-center space-x-2 ${
              isDarkMode ? 'border-slate-800' : 'border-slate-100'
            }`}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${
                isDarkMode 
                  ? 'bg-slate-800/80 border border-slate-700/50 text-slate-100 placeholder-slate-500' 
                  : 'bg-slate-100 border border-transparent text-slate-800 placeholder-slate-400 focus:bg-white'
              }`}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-sky-500 text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 transform rotate-90">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
