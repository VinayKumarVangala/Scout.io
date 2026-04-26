import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Link2, Shield, Activity, Terminal, ExternalLink, Plus } from 'lucide-react';

const activeProxies = [
  { id: '1', name: 'User Service', endpoint: 'https://api.internal/users', methods: ['GET', 'POST'], status: 'active', traffic: '2.4k/hr' },
  { id: '2', name: 'Inventory API', endpoint: 'https://inv.internal/v1', methods: ['GET'], status: 'active', traffic: '850/hr' },
  { id: '3', name: 'Payment Gateway', endpoint: 'https://pay.ext/process', methods: ['POST'], status: 'paused', traffic: '0/hr' },
];

export default function ProxyPage() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Secure Proxy Engine</h1>
          <p className="text-gray-500">Manage outbound API calls and request transformations</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-100">
          <Plus className="h-4 w-4" />
          Register New Endpoint
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50/50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><Link2 className="h-4 w-4 text-blue-500" /> Active Endpoints</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400">
              <tr>
                <th className="px-6 py-3">Service Name</th>
                <th className="px-6 py-3">Internal Endpoint</th>
                <th className="px-6 py-3">Traffic</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {activeProxies.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.endpoint}</td>
                  <td className="px-6 py-4 text-gray-600">{p.traffic}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700"><ExternalLink className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-center items-center text-center">
          <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Security Hardened</h3>
          <p className="text-sm text-gray-500 px-4">
            All outbound traffic is sanitized. Sensitive headers are automatically stripped before forwarding.
          </p>
          <div className="mt-6 w-full space-y-2">
            <div className="flex justify-between text-xs font-medium text-gray-600 bg-gray-50 p-2 rounded-lg">
              <span>Header Sanitization</span>
              <span className="text-emerald-600">Enabled</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-600 bg-gray-50 p-2 rounded-lg">
              <span>Payload Filtering</span>
              <span className="text-emerald-600">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-white flex items-center gap-2"><Terminal className="h-4 w-4 text-emerald-500" /> Live Request Inspector</h2>
          <div className="flex gap-2">
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">WS Connected</span>
          </div>
        </div>
        <div className="space-y-3 font-mono text-[11px]">
          {[
            { time: '23:08:42', method: 'POST', path: '/api/proxy/execute', client: 'Acme_Corp', status: 200, latency: '142ms' },
            { time: '23:08:41', method: 'GET', path: '/api/proxy/status', client: 'Global_Tech', status: 200, latency: '45ms' },
            { time: '23:08:39', method: 'POST', path: '/api/proxy/execute', client: 'Acme_Corp', status: 500, latency: '320ms' },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-800/50 hover:bg-slate-800/30 transition-all cursor-pointer px-2 rounded">
              <span className="text-slate-500">{log.time}</span>
              <span className={`font-bold ${log.method === 'POST' ? 'text-blue-400' : 'text-emerald-400'}`}>{log.method}</span>
              <span className="text-slate-300 flex-1">{log.path}</span>
              <span className="text-slate-400">Client: {log.client}</span>
              <span className={`font-bold ${log.status === 200 ? 'text-emerald-500' : 'text-rose-500'}`}>{log.status}</span>
              <span className="text-slate-500">{log.latency}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
