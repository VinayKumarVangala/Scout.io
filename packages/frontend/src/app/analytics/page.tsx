import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BarChart3, TrendingUp, Calendar, Download, Zap, DollarSign, Users, AlertCircle } from 'lucide-react';

const stats = [
  { label: 'Total Tokens', value: '42.8M', change: '+12%', trend: 'up', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Cost', value: '$1,240.45', change: '+5%', trend: 'up', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Active Sessions', value: '1,420', change: '-2%', trend: 'down', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Avg. Latency', value: '342ms', change: '-15%', trend: 'up', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-500">Global performance and cost telemetry</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </button>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                stat.trend === 'up' && stat.label !== 'Avg. Latency' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-2xl border shadow-sm min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-blue-500" /> Token Consumption</h2>
            <div className="flex gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Prompt</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Completion</span>
            </div>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl flex items-center justify-center text-gray-400 italic">
            [Interactive Usage Chart Visualization]
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border shadow-sm min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><Zap className="h-5 w-5 text-orange-500" /> Provider Performance</h2>
            <select className="text-xs border rounded-md px-2 py-1">
              <option>By Latency</option>
              <option>By Success Rate</option>
            </select>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl flex items-center justify-center text-gray-400 italic">
            [Provider Comparison Heatmap]
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><AlertCircle className="h-5 w-5 text-rose-500" /> Incident Tracker</h2>
          <button className="text-sm text-blue-600 font-semibold">View All Logs</button>
        </div>
        <div className="space-y-4">
          {[
            { id: 1, type: 'API Timeout', provider: 'Anthropic', freq: 12, status: 'Monitoring' },
            { id: 2, type: 'Rate Limit Hit', provider: 'OpenAI', freq: 45, status: 'Investigating' },
            { id: 3, type: 'Model Not Found', provider: 'Ollama', freq: 2, status: 'Resolved' },
          ].map((error) => (
            <div key={error.id} className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{error.type}</h4>
                  <p className="text-xs text-gray-500">Provider: {error.provider}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{error.freq} Occurrences</p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">{error.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
