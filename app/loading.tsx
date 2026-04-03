'use client'

import { Music } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 antialiased">
      <div className="flex flex-col items-center space-y-8 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight italic">ShowReady</span>
        </div>
        
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
             Getting your show details...
          </p>
        </div>
      </div>
    </div>
  )
}
