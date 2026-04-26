import React from 'react';
import { BarChart3, TrendingUp, AlertCircle, Clock } from 'lucide-react';

export const ClientStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Total Conversations', value: '12,450', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Avg. Response Time', value: '450ms', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Success Rate', value: '99.8%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Error Logs', value: '12', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
      ].map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">{stat.label}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
};
