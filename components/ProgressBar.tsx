'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

interface ProgressBarProps {
  total: number
  submittedCount: number
}

export function ProgressBar({ total, submittedCount }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((submittedCount / total) * 100) : 0
  
  // Custom color logic based on requirements
  const getBarColor = () => {
    if (percentage <= 40) return 'bg-red-500'
    if (percentage <= 79) return 'bg-amber-500'
    if (percentage <= 99) return 'bg-indigo-600'
    return 'bg-emerald-500'
  }

  const isComplete = percentage === 100

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{submittedCount}</span>
          <span className="text-2xl font-bold text-gray-300 ml-1">/ {total}</span>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Documents Submitted</p>
        </div>
        
        {isComplete && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100"
          >
            <CheckCircle2 size={18} />
            <span className="text-sm">All set!</span>
          </motion.div>
        )}
      </div>

      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${getBarColor()} transition-colors duration-500 shadow-sm shadow-black/10`}
        />
        
        {/* Subtle pattern for texture (premium feel) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>
      
      {isComplete && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-emerald-700 text-sm font-bold flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-5 h-5 bg-emerald-100 rounded-full">
            <CheckCircle2 size={12} className="text-emerald-600" />
          </span>
          All documents submitted. You're all set!
        </motion.p>
      )}
    </div>
  )
}
