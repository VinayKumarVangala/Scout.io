import React, { useState } from 'react';
import { Settings, Globe, Shield, Save } from 'lucide-react';

export const ClientForm = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="bg-white rounded-2xl border shadow-xl max-w-2xl mx-auto overflow-hidden">
      <div className="flex border-b">
        {[
          { s: 1, label: 'General', icon: Settings },
          { s: 2, label: 'Domains', icon: Globe },
          { s: 3, label: 'LLM Config', icon: Shield },
        ].map((item) => (
          <div 
            key={item.s}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
              step === item.s ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </div>
        ))}
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
              <input type="text" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Acme Corp" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Email</label>
              <input type="email" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@acme.com" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Whitelisted Domains</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="acme.com, dashboard.acme.net" />
              <p className="text-xs text-gray-500 mt-2">Comma separated list of domains authorized to host the widget.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
                <select className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                  <option>OpenAI</option>
                  <option>Gemini</option>
                  <option>Groq</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Default Model</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="gpt-4o" />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl disabled:opacity-0"
          >
            Back
          </button>
          <button 
            onClick={() => step < 3 ? setStep(s => s + 1) : null}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
          >
            {step === 3 ? 'Save Configuration' : 'Next Step'}
            {step === 3 && <Save className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
