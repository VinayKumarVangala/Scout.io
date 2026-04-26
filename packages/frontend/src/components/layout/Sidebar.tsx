import React from 'react';
import { LayoutDashboard, Users, MessageSquare, Shield, Settings, BarChart3, Cloud } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/' },
  { icon: Users, label: 'Clients', href: '/clients' },
  { icon: MessageSquare, label: 'Conversations', href: '/conversations' },
  { icon: Shield, label: 'Security', href: '/security' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Cloud, label: 'Providers', href: '/providers' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 h-screen text-slate-300 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">S</div>
          Scout.io
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link 
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
          >
            <item.icon className="h-5 w-5 group-hover:text-blue-400 transition-colors" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Service Status</p>
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
            Core Systems Active
          </div>
        </div>
      </div>
    </aside>
  );
};
