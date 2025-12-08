'use client';

import { useState, useEffect } from 'react';
import ChatWidget from '@/components/ChatWidget';
import { branding } from '@/config/branding';

const featureIcons = {
  bolt: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  brain: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  puzzle: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
};

export default function Home() {
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="gradient-bg grid-pattern min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {branding.companyName}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tighter">
            {branding.tagline.split(',')[0]},{' '}
            <span className="text-amber-400">
              {branding.tagline.split(',')[1]?.trim() || 'instant answers'}
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            {branding.description}
          </p>

          {/* Call attention to the chat widget */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 text-blue-400">
              <span className="text-sm font-medium">Try it now</span>
              <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Click the chat button in the bottom right corner</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter">Why Choose {branding.companyName}</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Built with cutting-edge technology to deliver exceptional AI experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branding.features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500/20 transition-colors">
                  {featureIcons[feature.icon as keyof typeof featureIcons] || featureIcons.bolt}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 tracking-tighter">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      {branding.showPoweredBy && (
        <section id="about" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 bg-amber-500/5 border border-amber-500/20 rounded-3xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 tracking-tighter">Powered by Trainly</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Our AI assistant is built on Trainly&apos;s advanced natural language processing technology,
                    enabling intelligent, context-aware conversations that understand your needs and deliver
                    accurate, helpful responses every time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Floating indicator pointing to chat */}
      {showPulse && (
        <div className="fixed bottom-24 right-6 z-40 flex items-center gap-2 animate-fade-in">
          <div className="px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-lg">
            Chat with us!
          </div>
          <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-blue-500" />
        </div>
      )}

      {/* Chat Widget */}
      <ChatWidget />
    </main>
  );
}
