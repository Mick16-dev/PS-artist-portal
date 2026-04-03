'use client'

import { AlertTriangle, Mail } from 'lucide-react'

export function InvalidToken({ promoterEmail }: { promoterEmail?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">ShowReady</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-warning-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-warning-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">This link is not valid</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          This portal link doesn&apos;t exist or has already been used. Please contact your promoter for a new link.
        </p>
        {promoterEmail && (
          <a
            href={`mailto:${promoterEmail}`}
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors min-h-[44px]"
          >
            <Mail size={18} />
            Contact your promoter
          </a>
        )}
      </div>

      <p className="mt-8 text-gray-400 text-sm">Powered by ShowReady</p>
    </div>
  )
}
