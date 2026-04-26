import React from 'react';
import { Send, Zap, Bot, User } from 'lucide-react';

export const TestConsole = () => {
  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl flex flex-col h-[600px] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <h2 className="font-bold text-slate-100">LLM Test Console</h2>
        </div>
        <div className="flex gap-2">
          <select className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border-none outline-none">
            <option>GPT-4o (OpenAI)</option>
            <option>Llama 3 70B (Groq)</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex gap-4">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className="bg-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-none max-w-[80%] text-sm">
            Hello! Can you verify the current system configuration?
          </div>
        </div>

        <div className="flex gap-4">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
            <Bot className="h-5 w-5" />
          </div>
          <div className="bg-slate-900 border border-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-none max-w-[80%] text-sm">
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase mb-2">
              <Zap className="h-3 w-3" /> Latency: 142ms
            </div>
            I am currently running on the <span className="text-blue-400">GPT-4o</span> model. All systems are operational, and the proxy engine is successfully authorized for your tenant.
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-900/80 border-t border-slate-800">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Send a test message..." 
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 transition-colors">
            <Send className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Tokens: 142 Prompt / 48 Completion</span>
          <span>Cost: $0.0024</span>
        </div>
      </div>
    </div>
  );
};
