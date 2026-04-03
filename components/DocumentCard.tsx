'use client'

import React, { useState, useRef } from 'react'
import { 
  FileText, CheckCircle2, Clock, AlertCircle, 
  UploadCloud, ExternalLink, RefreshCw, XCircle,
} from 'lucide-react'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface DocumentCardProps {
  material: {
    id: string
    item_name: string
    description?: string
    status: 'pending' | 'submitted'
    deadline: string
    submitted_at?: string
    file_url?: string
    portal_token: string
  }
  onUpload: (token: string, file: File, itemName: string) => Promise<boolean>
}

export function DocumentCard({ material, onUpload }: DocumentCardProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const deadline = new Date(material.deadline)
  const isOverdue = material.status === 'pending' && isPast(deadline)
  const isSubmitted = material.status === 'submitted'
  
  const distanceToDeadline = formatDistanceToNow(deadline, { addSuffix: true })
  const formattedDate = format(deadline, 'EEEE, MMMM do yyyy')

  // Instructions: Card styling logic
  let borderClass = 'border-l-indigo-600'
  let bgClass = 'bg-white'
  let icon = <Clock size={16} className="text-secondary-400" />
  let statusBadgeText = `${distanceToDeadline.replace('about ', '')} remaining`
  let badgeColor = 'bg-gray-100 text-gray-500'

  if (isSubmitted) {
    // Instruction: "Green left border, card background: very light green"
    borderClass = 'border-l-emerald-500 scale-100'
    bgClass = 'bg-emerald-50/20'
    icon = <CheckCircle2 size={16} className="text-emerald-600" />
    statusBadgeText = `COMPLETED — ${material.submitted_at ? format(new Date(material.submitted_at), 'MMM do') : 'RECEIVED'}`
    badgeColor = 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
  } else if (isOverdue) {
    // Instruction: "Red left border, card background: very light red"
    borderClass = 'border-l-red-500'
    bgClass = 'bg-red-50/20'
    icon = <AlertCircle size={16} className="text-red-500" />
    statusBadgeText = `${distanceToDeadline.replace('ago', '')} overdue`
    badgeColor = 'bg-red-100 text-red-700 ring-1 ring-red-200 shadow-sm'
  }

  const startUploadFlow = async (file: File) => {
    setUploadError(null)
    
    // Instruction: "Max size: 10MB"
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('This file is too large. Maximum size is 10MB.')
      return
    }

    // Instruction: "Accepted: PDF, DOC, DOCX"
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(file.type)) {
      setUploadError('This file type is not accepted. Please upload PDF, DOC, or DOCX.')
      return
    }

    setIsUploading(true)
    try {
      const success = await onUpload(material.portal_token, file, material.item_name)
      if (!success) throw new Error('Failed to reach backend')
    } catch (err) {
      setUploadError('Upload failed. Please check your internet connection and try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (isSubmitted) return
    
    const file = e.dataTransfer.files?.[0]
    if (file) await startUploadFlow(file)
  }

  return (
    <motion.div
      layout
      onDragOver={(e) => { e.preventDefault(); !isSubmitted && setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`relative border-l-4 ${borderClass} ${bgClass} border border-gray-100 rounded-[2rem] p-8 transition-all hover:shadow-xl hover:shadow-indigo-50/50 group ${isDragOver ? 'ring-4 ring-indigo-500 shadow-2xl' : ''}`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-xl bg-white shadow-sm border border-gray-50 text-gray-400 transition-colors ${isSubmitted ? 'text-emerald-500' : 'text-indigo-400'}`}>
                <FileText size={20} />
             </div>
             <div>
               <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none group-hover:text-indigo-700 transition-colors">
                  {material.item_name}
               </h3>
               {material.description && <p className="text-sm font-medium text-gray-500 mt-1">{material.description}</p>}
             </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${badgeColor}`}>
               {icon}
               {statusBadgeText}
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100">
               Due {formattedDate}
            </div>
          </div>
          
          {isOverdue && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 font-bold text-xs uppercase tracking-widest"
            >
               Please submit this as soon as possible
            </motion.p>
          )}
        </div>

        <div className="flex-shrink-0 md:pt-2">
          {isSubmitted ? (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={material.file_url}
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-900 border-2 border-gray-100 font-black py-4 px-10 rounded-[1.25rem] text-[13px] uppercase tracking-widest shadow-sm hover:border-emerald-200 transition-all active:shadow-inner min-h-[56px] min-w-[200px]"
            >
              <ExternalLink size={16} />
              View File
            </motion.a>
          ) : (
            <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && startUploadFlow(e.target.files[0])}
                className="hidden" 
                accept=".pdf,.doc,.docx"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`w-full md:w-auto inline-flex items-center justify-center gap-3 font-black py-4 px-10 rounded-[1.25rem] text-[13px] uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 min-h-[56px] min-w-[240px] text-white ${isOverdue ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-gray-900 hover:bg-black shadow-gray-100'}`}
              >
                {isUploading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <UploadCloud size={18} />
                )}
                {isUploading ? `Sending...` : `Upload ${material.item_name}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {uploadError && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 border border-red-100"
        >
          <XCircle size={16} />
          {uploadError}
        </motion.div>
      )}

      {/* Drag & Drop Visual State */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-indigo-600/90 backdrop-blur-md rounded-[2rem] flex items-center justify-center z-50 text-white border-4 border-dashed border-white/50"
          >
            <div className="text-center space-y-4">
               <UploadCloud size={48} className="mx-auto" />
               <p className="text-2xl font-black uppercase tracking-widest">Drop to Upload</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isSubmitted && !isUploading && (
        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
           <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
              ACCEPTED: PDF, DOC, DOCX
           </p>
           <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
              FILE LIMIT: 10MB
           </p>
        </div>
      )}
    </motion.div>
  )
}
