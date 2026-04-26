import React from 'react';
import { Shield, Key, Server, Cpu } from 'lucide-react';

export const ProviderForm = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-xl max-w-2xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
          <Server className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Provider Configuration</h2>
          <p className="text-sm text-gray-500">Securely link your LLM API credentials</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-gray-400" /> Select Provider
          </label>
          <select className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
            <option>OpenAI (GPT-4, GPT-3.5)</option>
            <option>Google Gemini (1.5 Pro, Flash)</option>
            <option>Groq (Llama 3, Mixtral)</option>
            <option>Anthropic (Claude 3.5 Sonnet)</option>
            <option>OpenRouter (Aggregator)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Key className="h-4 w-4 text-gray-400" /> API Key
          </label>
          <div className="relative">
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 pr-12" 
              placeholder="sk-..."
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
              <Shield className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 italic">
            * Keys are encrypted using AES-256 before storage and never exposed in plain text.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Organization ID (Optional)</label>
            <input type="text" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="org-..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project ID (Optional)</label>
            <input type="text" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="proj-..." />
          </div>
        </div>

        <div className="pt-6 border-t">
          <div className="flex gap-3">
            <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all">
              Save & Authenticate
            </button>
            <button className="px-6 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all text-gray-600">
              Test Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
