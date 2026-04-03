'use client'

import { Clock, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

interface ExpiredTokenProps {
  expiresAt: string
  promoterEmail?: string
}

export function ExpiredToken({ expiresAt, promoterEmail }: ExpiredTokenProps) {
  const formattedDate = format(new Date(expiresAt), 'EEEE, MMMM do yyyy')

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center antialiased">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight italic">ShowReady</span>
        </div>
      </div>
      
      <div className="max-w-md w-full bg-amber-50 rounded-3xl p-10 border border-amber-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 transition-transform hover:scale-105">
          <Clock size={32} />
        </div>
        
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">This link has expired</h1>
        
        <p className="text-gray-600 leading-relaxed mb-8">
          Your portal link expired on <span className="font-bold text-gray-900">{formattedDate}</span>. Please contact your promoter to send you a new link.
        </p>

        <a 
          href={promoterEmail ? `mailto:${promoterEmail}` : 'mailto:'}
          className="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
        >
          Contact your promoter
        </a>
      </div>
      
      <p className="mt-12 text-sm font-bold text-gray-400 uppercase tracking-widest">
        Powered by ShowReady
      </p>
    </div>
  )
}
