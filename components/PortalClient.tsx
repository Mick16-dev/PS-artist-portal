'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Music, AlertCircle, ArrowRight, CheckCircle2, ChevronRight, LayoutDashboard, PartyPopper } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@supabase/supabase-js'
import { Toaster, toast } from 'sonner'
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
  show_id: string
  artist_id: string
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
  initialToken: string
}

export function PortalClient({ show, artist, materials: initialMaterials, initialToken }: PortalClientProps) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const submittedCount = materials.filter(m => m.status === 'submitted').length
  const totalCount = materials.length
  const isAllSubmitted = submittedCount === totalCount && totalCount > 0

  // Celebration effect
  useEffect(() => {
    if (isAllSubmitted) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b']
      })
    }
  }, [isAllSubmitted])

  const refreshMaterials = useCallback(async () => {
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

  const handleUpload = async (token: string, file: File, itemName: string): Promise<boolean> => {
    try {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('item_name', itemName)
      formData.append('file', file)

      const response = await fetch(process.env.NEXT_PUBLIC_N8N_MATERIAL_UPLOAD_WEBHOOK!, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      // Refresh data after successful upload
      await refreshMaterials()
      return true
    } catch (error) {
      console.error('Upload Error:', error)
      return false
    }
  }

  const formattedShowDate = format(new Date(show.show_date), 'EEEE, MMMM do yyyy')

  return (
    <div className="min-h-screen bg-white font-sans antialiased pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      <Toaster position="top-center" expand={true} richColors closeButton />
      
      {/* Header */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight italic">ShowReady</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            Secure Portal
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {isAllSubmitted ? (
            <motion.div 
              key="hero-complete"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                <CheckCircle2 size={16} />
                All mission critical tasks complete
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                🎉 You're all set, <br />
                <span className="text-emerald-600">{artist.name.split(' ')[0]}!</span>
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                All documents have been submitted for your show at <span className="text-gray-900 font-bold underline decoration-indigo-200 decoration-2 underline-offset-4">{show.venue_name}</span>. Your promoter has been notified.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="hero-pending"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                Hi {artist.name.split(' ')[0]},
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl">
                Here's what <span className="text-gray-900 font-bold underline decoration-indigo-200 decoration-2 underline-offset-4">{show.promoter_name}</span> needs from you for your show at <span className="text-gray-900 font-bold">{show.venue_name}</span>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show Info Piles */}
        <div className="flex flex-wrap gap-4 mb-16">
          <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm p-4 rounded-3xl hover:border-indigo-100 transition-colors group">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Venue & City</p>
              <p className="text-sm font-bold text-gray-900 leading-tight">{show.venue_name}, {show.city}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm p-4 rounded-3xl hover:border-indigo-100 transition-colors group">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Event Schedule</p>
              <p className="text-sm font-bold text-gray-900 leading-tight">{formattedShowDate} @ {show.show_time}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="bg-white border text-center border-gray-100 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-50 mb-16 md:mb-24 flex flex-col md:flex-row items-center gap-12 group hover:shadow-indigo-50 transition-all duration-500">
          <div className="flex-1 w-full text-left">
            <ProgressBar total={totalCount} submittedCount={submittedCount} />
          </div>
        </div>

        {/* Documents Section */}
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b pb-6 border-gray-50">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Documents</h2>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
               Scroll to see all <ChevronRight size={14} />
            </div>
          </div>

          <div className="grid gap-8">
            {materials.map((m, idx) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <DocumentCard material={m} onUpload={handleUpload} />
              </motion.div>
            ))}
          </div>
        </div>
        
        {isAllSubmitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 text-center"
          >
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PartyPopper size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need to update something?</h3>
            <p className="text-gray-500 font-medium">You can re-upload any document above if your production details change.</p>
          </motion.div>
        )}

        <footer className="mt-32 pt-12 border-t border-gray-50">
          <div className="flex flex-col items-center justify-center space-y-4">
             <div className="flex items-center gap-2 grayscale brightness-110 opacity-50">
              <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-gray-400 tracking-tight italic">ShowReady</span>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">
               Having trouble? Contact {show.promoter_email}
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
