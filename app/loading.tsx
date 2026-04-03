'use client'

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6 animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        {/* Large Logo for Loading State */}
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
        <span className="text-3xl font-black text-gray-900 tracking-tight">ShowReady</span>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Getting your show details...</p>
      </div>
    </div>
  )
}
