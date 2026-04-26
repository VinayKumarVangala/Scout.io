import React from 'react';
import Link from 'next/link';
import { Book, Shield, Zap, Code, Terminal, MessageSquare } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Scout.io Documentation</h1>
          <p className="text-xl text-gray-600">Master the multi-tenant AI chat platform with our comprehensive guides and API references.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Quick Start', description: 'Get the widget up and running in under 5 minutes.', icon: Zap, color: 'text-blue-500' },
            { title: 'Security Model', description: 'Deep dive into our multi-tenant isolation and encryption.', icon: Shield, color: 'text-emerald-500' },
            { title: 'API Reference', description: 'Detailed documentation for all REST and WS endpoints.', icon: Code, color: 'text-purple-500' },
            { title: 'Proxy Engine', description: 'Learn how to secure internal APIs for AI tool calling.', icon: Terminal, color: 'text-orange-500' },
            { title: 'Widget Customization', description: 'Theming and branding guides for the chat interface.', icon: MessageSquare, color: 'text-rose-500' },
            { title: 'Architecture', description: 'Understand the hybrid-elite design and scalability.', icon: Book, color: 'text-slate-500' },
          ].map((card) => (
            <Link key={card.title} href={`/docs/${card.title.toLowerCase().replace(' ', '-')}`} className="group p-8 border rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all">
              <div className={`mb-4 ${card.color}`}>
                <card.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2">{card.title}</h3>
              <p className="text-gray-500">{card.description}</p>
            </Link>
          ))}
        </div>

        <section className="mt-24 p-12 bg-slate-900 rounded-3xl text-white overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Interactive Playground</h2>
            <p className="text-slate-400 max-w-2xl mb-8">Test your prompts, try out themes, and see real-time proxy logs without writing a single line of code.</p>
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold transition-all">
              Open Playground
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-500/20 to-transparent"></div>
        </section>
      </div>
    </div>
  );
}
