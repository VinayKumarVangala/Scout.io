import React from 'react';
import { Shield, Zap, Globe, Cpu, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
          <span className="text-xl font-bold tracking-tight">Scout.io</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
        </div>
        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <header className="px-8 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          v1.0 is now live
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          The Intelligent <br /> <span className="text-blue-600">Proxy Layer</span> for AI.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Embed state-of-the-art AI into your application in minutes. Secure, multi-tenant, and vendor-agnostic by design.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
            Start Building Free <ArrowRight className="h-5 w-5" />
          </button>
          <button className="w-full sm:w-auto bg-white border-2 border-slate-100 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
            View Documentation
          </button>
        </div>
      </header>

      {/* Feature Grid */}
      <section id="features" className="px-8 py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Secure Proxy Engine', desc: 'Execute API calls directly from AI tools without exposing keys.', icon: Shield },
              { title: 'Multi-Tenant Isolation', desc: 'Built-in sandboxing for thousands of independent clients.', icon: Globe },
              { title: 'Pluggable LLMs', desc: 'Switch between OpenAI, Gemini, Groq, and more with zero code changes.', icon: Cpu },
            ].map((f) => (
              <div key={f.title} className="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">Powering Next-Gen AI Interfaces</p>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale">
            <div className="text-2xl font-black">ACME</div>
            <div className="text-2xl font-black">GLOBAL TECH</div>
            <div className="text-2xl font-black">STARTUP.INC</div>
            <div className="text-2xl font-black">ENTERPRISE</div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-slate-900 text-white py-24 px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to evolve your UI?</h2>
        <button className="bg-white text-slate-900 px-12 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all mb-16">
          Initialize My Instance
        </button>
        <div className="pt-12 border-t border-slate-800 text-slate-500 text-sm">
          &copy; 2026 Scout.io. All rights reserved. Built with Elite Architecture.
        </div>
      </footer>
    </div>
  );
}
