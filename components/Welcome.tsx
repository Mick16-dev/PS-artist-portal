'use client'

import { Music, UploadCloud, ShieldCheck, ArrowRight } from 'lucide-react'

export function Welcome() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col antialiased">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">ShowReady</span>
          </div>
          <p className="text-sm font-semibold text-gray-500">Artist Portal</p>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-bold animate-fade-in">
            <Music size={16} />
            Streamlined Material Collection
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight animate-slide-up">
            Your Show, <br />
            <span className="text-primary-600">Simplified.</span>
          </h1>
          
          <p className="text-xl text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-slide-up delay-100">
            ShowReady is the premium gateway for artists to manage documents, technical riders, and promo materials for their upcoming live dates. 
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 animate-slide-up delay-200">
            <div className="text-sm text-gray-400 font-medium">
              Access is available via your unique invite link provided by your promoter.
            </div>
          </div>
        </div>

        {/* Action Preview (Decorative) */}
        <div className="hidden lg:block flex-1 w-full max-w-md animate-fade-in delay-300">
          <div className="bg-white rounded-3xl shadow-xl shadow-primary-100 border border-gray-100 p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Music size={120} />
            </div>
            <div className="w-12 h-12 bg-success-50 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-success-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Secure Submission</h3>
            <p className="text-gray-500 leading-relaxed">
              Every upload is encrypted and sent directly to your production team, ensuring no material is ever lost.
            </p>
            <div className="space-y-3 pt-4">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-primary-600 rounded-full" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Artist Material Syncing</p>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-white border-t border-gray-100 py-24">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <UploadCloud size={20} />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Cloud Upload</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Drag-and-drop your tech riders and press kits directly from your device.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <ArrowRight size={20} />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Live Status</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Real-time tracking of what your promoter has received and what is still needed.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              < ShieldCheck size={20} />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Encrypted Links</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Private tokens ensure only authorized team members can access your data.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-gray-50 container mx-auto">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Powered by ShowReady Productions</p>
      </footer>
    </div>
  )
}
