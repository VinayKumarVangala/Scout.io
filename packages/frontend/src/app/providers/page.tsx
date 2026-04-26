import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ShieldCheck, Activity, Settings2, PlayCircle, Plus } from 'lucide-react';

const providers = [
  { name: 'OpenAI', logo: 'O', status: 'Healthy', latency: '240ms', activeModels: 4, color: 'emerald' },
  { name: 'Google Gemini', logo: 'G', status: 'Healthy', latency: '410ms', activeModels: 2, color: 'blue' },
  { name: 'Groq', logo: 'Q', status: 'Healthy', latency: '85ms', activeModels: 3, color: 'orange' },
  { name: 'Anthropic', logo: 'A', status: 'Degraded', latency: '890ms', activeModels: 0, color: 'rose' },
];

export default function ProvidersPage() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LLM Providers</h1>
          <p className="text-gray-500">Global provider status and fallback orchestration</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
          <Plus className="h-4 w-4" />
          Connect New Provider
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {providers.map((p) => (
          <div key={p.name} className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={`h-12 w-12 rounded-xl bg-${p.color}-50 flex items-center justify-center text-xl font-bold text-${p.color}-600 border border-${p.color}-100`}>
                {p.logo}
              </div>
              <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                p.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {p.status}
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1">{p.name}</h3>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> Latency</span>
                <span className="font-semibold text-gray-900">{p.latency}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Models</span>
                <span className="font-semibold text-gray-900">{p.activeModels} Active</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
              <button className="py-2 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-1.5 transition-colors">
                <Settings2 className="h-3 w-3" /> Config
              </button>
              <button className="py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-colors">
                <PlayCircle className="h-3 w-3" /> Test
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50/50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Provider Health History</h2>
            <select className="text-xs border rounded-md px-2 py-1 bg-white outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="p-8 flex items-center justify-center h-64 text-gray-400">
            <Activity className="h-12 w-12 opacity-20" />
            <p className="ml-4 italic">Real-time health telemetry visualization</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-6">Global Fallback Logic</h2>
          <div className="space-y-4">
            {[
              { id: 1, from: 'OpenAI', to: 'Groq', trigger: 'Latency > 500ms' },
              { id: 2, from: 'Gemini', to: 'OpenAI', trigger: 'Error Rate > 5%' },
              { id: 3, from: 'Groq', to: 'OpenRouter', trigger: 'Service Down' },
            ].map((rule) => (
              <div key={rule.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Rule #{rule.id}</span>
                  <button className="text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                </div>
                <p className="text-sm text-slate-700">
                  If <span className="font-bold">{rule.from}</span> <span className="text-rose-500 font-medium">{rule.trigger}</span>
                </p>
                <p className="text-sm text-slate-700 mt-1">
                  Switch to <span className="font-bold text-emerald-600">{rule.to}</span>
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border-2 border-dashed rounded-xl text-sm font-semibold text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all">
            + Add Fallback Rule
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
