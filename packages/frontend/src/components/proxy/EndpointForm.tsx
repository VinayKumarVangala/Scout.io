import React from 'react';
import { Globe, Shield, Code, Save } from 'lucide-react';

export const EndpointForm = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-xl max-w-2xl mx-auto overflow-hidden">
      <div className="p-8 border-b bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" /> Proxy Endpoint Registration
        </h2>
        <p className="text-sm text-gray-500 mt-1">Define how the AI interacts with your internal APIs</p>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Service Name</label>
          <input type="text" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Customer Data Service" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Target URL</label>
          <div className="flex gap-2">
            <select className="bg-gray-50 border rounded-xl px-4 py-3 text-sm font-bold text-gray-600 outline-none">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            <input type="text" className="flex-1 px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://api.internal/v1/..." />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
            Custom Headers <span className="text-xs font-normal text-gray-400">JSON format</span>
          </label>
          <div className="relative">
            <textarea rows={4} className="w-full px-4 py-3 bg-slate-900 text-emerald-400 font-mono text-sm rounded-xl outline-none border border-slate-800" placeholder='{ "X-API-Key": "{{SECRET}}" }' />
            <div className="absolute right-4 top-4">
              <Code className="h-4 w-4 text-slate-700" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
          <Shield className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Security Note:</strong> All outgoing requests will have restricted headers removed. Use <code>{{SECRET}}</code> placeholders to inject client-encrypted keys.
          </p>
        </div>

        <div className="pt-4 flex gap-3">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Save className="h-4 w-4" /> Save Endpoint
          </button>
          <button className="px-6 py-3 border rounded-xl font-semibold hover:bg-gray-50 transition-all text-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
