'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { 
  Music, CheckCircle2, Clock, 
  AlertCircle, UploadCloud, ExternalLink, 
  ChevronRight, PartyPopper, RefreshCw, XCircle 
} from 'lucide-react'
import { format, isPast, formatDistanceToNow } from 'date-fns'
import { createClient } from '@supabase/supabase-js'
import { Toaster, toast } from 'sonner'

// Components
import { ProgressBar } from './ProgressBar'
import { DocumentCard } from './DocumentCard'

interface Material {
  id: string
  item_name: string
  description?: string
  status: 'pending' | 'submitted'
  deadline: string
  submitted_at?: string
  file_url?: string
  portal_token: string
}

interface Show {
  id: string
  venue_name: string
  city: string
  show_date: string
  show_time: string
  promoter_name: string
  promoter_email: string
}

interface Artist {
  id: string
  name: string
}

interface PortalClientProps {
  show: Show
  artist: Artist
  materials: Material[]
  token: string
}

export function PortalClient({ show, artist, materials: initialMaterials, token }: PortalClientProps) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const submittedCount = materials.filter(m => m.status === 'submitted').length
  const totalCount = materials.length
  const isAllSubmitted = submittedCount === totalCount && totalCount > 0

  // Celebration logic for 100% completion
  useEffect(() => {
    if (isAllSubmitted) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444']
      })
    }
  }, [isAllSubmitted])

  // Sync with Supabase logic - handles the "refresh materials from Supabase" instruction
  const syncMaterials = useCallback(async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    setIsRefreshing(true)
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('show_id', show.id)
      .order('deadline', { ascending: true })

    if (!error && data) {
      setMaterials(data as Material[])
    }
    setIsRefreshing(false)
  }, [show.id])

  // Backend POST flow - handles the "POST to n8n upload webhook" instruction
  const handleUploadToN8N = async (materialToken: string, file: File, itemName: string): Promise<boolean> => {
    try {
      const formData = new FormData()
      formData.append('token', materialToken)
      formData.append('item_name', itemName)
      formData.append('file', file)

      const response = await fetch(process.env.NEXT_PUBLIC_N8N_MATERIAL_UPLOAD_WEBHOOK!, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Network response was not ok')

      // Instruction: "On success: Card immediately updates, Green checkmark appears, Progress bar updates, Refresh materials from Supabase"
      await syncMaterials()
      return true
    } catch (error) {
      console.error('Submission failed:', error)
      return false
    }
  }

  const formattedShowDate = format(new Date(show.show_date), 'EEEE, MMMM do yyyy')

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden antialiased">
      <Toaster position="top-center" richColors theme="light" />
      
      {/* Premium Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 py-4 px-6 md:px-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group transition-all">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter italic">ShowReady</span>
          </div>
          
          <div className="text-[10px] font-black text-gray-400 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full shadow-sm tracking-[0.2em] uppercase hidden sm:flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
            Live Artist Portal
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {isAllSubmitted ? (
            <motion.div 
              key="hero-all-done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 mb-20 md:mb-24"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                <CheckCircle2 size={14} />
                Submission Sequence Complete
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[1.05]">
                🎉 You're all set, <br />
                <span className="text-emerald-600 underline decoration-emerald-100 underline-offset-8 decoration-8">{artist.name.split(' ')[0]}!</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl">
                Every document has been securely transmitted for your show at <span className="text-gray-900 font-bold">{show.venue_name}</span>. Your promoter dashboard has been updated.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="hero-pending"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 mb-20 md:mb-24"
            >
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[1.05]">
                  Hi {artist.name.split(' ')[0]},
                </h1>
                <p className="text-2xl md:text-4xl text-gray-400 font-bold tracking-tight">
                  Let's get you <span className="text-indigo-600">Show Ready.</span>
                </p>
              </div>
              <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl">
                <span className="text-gray-900 font-bold italic">{show.promoter_name}</span> is awaiting document submission for your performance at <span className="text-gray-900 font-bold underline decoration-indigo-600/10 decoration-8 underline-offset-4">{show.venue_name}</span>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Show Data Dashboard */}
        <div className="grid sm:grid-cols-2 gap-4 mb-20 md:mb-24">
          <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-xl shadow-gray-50 flex items-center gap-5 group hover:border-indigo-100 transition-all active:scale-95 cursor-default">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Production Location</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{show.venue_name}</p>
              <p className="text-xs font-bold text-gray-400 uppercase">{show.city}</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-xl shadow-gray-50 flex items-center gap-5 group hover:border-indigo-100 transition-all active:scale-95 cursor-default">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Show Schedule</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{formattedShowDate}</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Doors @ {show.show_time}</p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar Module */}
        <div className="bg-gray-900 p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-indigo-100 mb-24 relative overflow-hidden group">
          <div className="relative z-10">
            <ProgressBar total={totalCount} submittedCount={submittedCount} />
          </div>
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
             <Music size={140} color="white" />
          </div>
        </div>

        {/* Documents Grid - Instructions: "Each document shown as a large card" */}
        <section className="space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-8">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">Your Materials</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                <Clock size={12} />
                Encrypted Submission
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
              <p className="text-xs font-bold text-gray-400">Drag & Drop Enabled</p>
            </div>
          </div>

          <div className="grid gap-10">
            {materials.map((m, idx) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, ease: "easeOut" }}
              >
                <DocumentCard material={m} onUpload={handleUploadToN8N} />
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Confetti / Final Ready Section */}
        {isAllSubmitted && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-24 bg-indigo-50/40 p-10 md:p-16 rounded-[3rem] border border-indigo-100 text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 bg-white shadow-xl shadow-indigo-100/50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 relative z-10 transition-transform hover:scale-110">
              <PartyPopper size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Need to update a file?</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
              You're all set, but you can still replace any document above by uploading a newer version before the show date.
            </p>
            <div className="absolute -bottom-8 -right-8 opacity-[0.03] rotate-12">
               <Music size={200} />
            </div>
          </motion.div>
        )}

        {/* Professional Minimal Footer */}
        <footer className="mt-40 pt-16 border-t border-gray-50">
          <div className="flex flex-col items-center space-y-8">
             <div className="flex items-center gap-2 opacity-20 hover:opacity-40 transition-opacity">
                <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="16" r="3"/>
                  </svg>
                </div>
                <span className="text-sm font-black text-gray-900 tracking-tighter italic">ShowReady</span>
            </div>
            
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] text-center max-w-xs leading-loose">
               Secure Production Environment &bull; Powered by ShowReady &bull; Built for Artists
            </p>
            
            <a 
              href={`mailto:${show.promoter_email}`}
              className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors"
            >
              Need assistance? Email {show.promoter_name}
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}
