'use client'

import { Music, UploadCloud, ShieldCheck, ArrowRight, Zap, Target, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

export function Welcome() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 antialiased overflow-hidden">
      {/* Dynamic Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-50 flex items-center h-20 px-8 lg:px-12">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter italic">ShowReady</span>
          </div>
          
          <div className="text-[10px] font-black text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm sm:flex gap-2 hidden uppercase tracking-widest">
            Production &bull; Artist Portal
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-12">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm border border-indigo-100"
           >
              <Zap size={14} className="animate-pulse" />
              Artist Material Management
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-6xl lg:text-[7rem] font-black text-gray-900 leading-[0.95] tracking-tighter"
           >
              Your Show. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-900">Seamless.</span>
           </h1 >

           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-xl lg:text-3xl text-gray-400 font-bold max-w-3xl mx-auto leading-relaxed tracking-tight"
           >
              ShowReady is the premium gateway for artists to securely manage technical riders, promo materials, and production documents.
           </motion.p>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="pt-10 flex flex-col items-center space-y-6"
           >
              <div className="p-8 bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-indigo-100 flex flex-col sm:flex-row items-center gap-8 max-w-xl border border-white/10 group">
                 <div className="w-16 h-16 bg-white/10 text-white rounded-3xl flex items-center justify-center shrink-0 border border-white/20 group-hover:bg-indigo-600 transition-colors">
                    <Lock size={28} />
                 </div>
                 <div className="text-left">
                    <h3 className="text-white text-xl font-black mb-1">Access Required</h3>
                    <p className="text-gray-400 font-medium leading-relaxed text-sm">
                       This is a private production portal. Please use the unique secure link provided in your invite email from the promoter.
                    </p>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Dynamic Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-5 blur-[120px] pointer-events-none">
           <div className="w-[600px] h-[600px] bg-indigo-600 rounded-full" />
        </div>
      </main>

      {/* Feature Section */}
      <section className="bg-gray-50/50 border-t border-gray-100 py-24 px-8 lg:px-12">
         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 lg:gap-20">
            <div className="space-y-6">
               <div className="w-14 h-14 bg-white shadow-xl shadow-gray-200/50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <UploadCloud size={24} />
               </div>
               <h4 className="text-xl font-black text-gray-900 italic tracking-tight">Direct Injection</h4>
               <p className="text-gray-500 font-medium leading-relaxed italic">Drag and drop your mission-critical files directly into our secure production cloud with real-time status syncing.</p>
            </div>
            
            <div className="space-y-6">
               <div className="w-14 h-14 bg-white shadow-xl shadow-gray-200/50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Target size={24} />
               </div>
               <h4 className="text-xl font-black text-gray-900 italic tracking-tight">Live Milestone Tracking</h4>
               <p className="text-gray-500 font-medium leading-relaxed italic">Instantly see what documents the production team has received and what is still needed for your upcoming dates.</p>
            </div>

            <div className="space-y-6">
               <div className="w-14 h-14 bg-white shadow-xl shadow-gray-200/50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <ShieldCheck size={24} />
               </div>
               <h4 className="text-xl font-black text-gray-900 italic tracking-tight">Encrypted Access</h4>
               <p className="text-gray-500 font-medium leading-relaxed italic">No passwords, no friction. Your unique invite token ensures that your data is private and only accessible to authorized team members.</p>
            </div>
         </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-16 border-t border-gray-100 flex flex-col items-center space-y-6">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] text-center">
           Powered by ShowReady Productions &bull; Made for Artists
        </p>
      </footer>
    </div>
  )
}
