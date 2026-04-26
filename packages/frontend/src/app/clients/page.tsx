import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Search, Filter, MoreVertical, Globe, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';

const ClientStats = dynamic(() => import('@/components/clients/ClientStats').then(mod => mod.ClientStats), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-xl mb-8"></div>,
  ssr: false
});

const mockClients = [
  { id: '1', name: 'Acme Corp', domains: ['acme.com'], status: 'active', provider: 'openai', usage: '1.2M tokens' },
  { id: '2', name: 'Global Tech', domains: ['globaltech.io'], status: 'active', provider: 'gemini', usage: '850K tokens' },
  { id: '3', name: 'Startup Inc', domains: ['startup.net'], status: 'pending', provider: 'groq', usage: '0 tokens' },
];

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500">Manage your multi-tenant chat configurations</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          Add New Client
        </button>
      </div>

      <ClientStats />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter clients..." 
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Domains</th>
              <th className="px-6 py-4">Provider</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {mockClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {client.domains[0]}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold capitalize">
                    {client.provider}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    client.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      client.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></span>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{client.usage}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <p>Showing 1 to 3 of 3 clients</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border bg-white rounded disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border bg-white rounded disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
