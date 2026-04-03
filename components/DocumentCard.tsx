'use client'

import React, { useState, useRef } from 'react'
import { 
  FileText, CheckCircle2, Clock, AlertCircle, 
  UploadCloud, ExternalLink, RefreshCw, XCircle,
  FileCheck
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
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const deadline = new Date(material.deadline)
  const isOverdue = material.status === 'pending' && isPast(deadline)
  const isSubmitted = material.status === 'submitted'
  
  const daysDiff = formatDistanceToNow(deadline, { addSuffix: true })
  const formattedDeadline = format(deadline, 'EEEE, MMMM do yyyy')

  // UI state colors/icons
  let borderColor = 'border-l-indigo-600'
  let bgColor = 'bg-white'
  let statusIcon = <Clock size={16} className="text-secondary-400" />
  let statusText = `${daysDiff.replace('about ', '')} remaining`

  if (isSubmitted) {
    borderColor = 'border-l-emerald-500'
    bgColor = 'bg-emerald-50/40' // very light green
    statusIcon = <CheckCircle2 size={16} className="text-emerald-600" />
    statusText = `Submitted — ${material.submitted_at ? format(new Date(material.submitted_at), 'MMM do, yyyy') : 'Confirmed'}`
  } else if (isOverdue) {
    borderColor = 'border-l-red-500'
    bgColor = 'bg-red-50/40' // very light red
    statusIcon = <AlertCircle size={16} className="text-red-500 shadow-sm" />
    statusText = `${daysDiff.replace('ago', '')} overdue`
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await validateAndUpload(file)
    }
  }

  const validateAndUpload = async (file: File) => {
    setUploadError(null)
    
    // Size check: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('This file is too large. Maximum size is 10MB.')
      toast.error('File too large (Max 10MB)')
      return
    }

    // Type check: PDF, DOC, DOCX
    const acceptedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!acceptedTypes.includes(file.type)) {
      setUploadError('This file type is not accepted. Please upload PDF, DOC, or DOCX.')
      toast.error('Invalid file type')
      return
    }

    setIsUploading(true)
    setSelectedFileName(file.name)
    
    try {
      const success = await onUpload(material.portal_token, file, material.item_name)
      if (success) {
        toast.success(`${material.item_name} submitted successfully!`)
      } else {
        throw new Error('Upload failed')
      }
    } catch (err) {
      setUploadError('Upload failed. Please check your internet connection and try again.')
      toast.error('Submission failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!isSubmitted) setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (isSubmitted) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      await validateAndUpload(file)
    }
  }

  return (
    <motion.div
      layout
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-l-4 ${borderColor} ${bgColor} rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md ${isDragOver ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 group">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {material.item_name}
            </h3>
            {isSubmitted && <span className="p-1 px-2 text-[10px] bg-emerald-100 text-emerald-700 rounded-full font-bold uppercase tracking-wider">RECEIVED</span>}
          </div>
          {material.description && (
            <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-sm">
              {material.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
            <div className={`flex items-center gap-1.5 text-xs font-bold ${isOverdue ? 'text-red-500 bg-red-100' : 'text-gray-400 bg-gray-50'} py-1 px-2.5 rounded-full`}>
               {statusIcon}
               <span className="uppercase tracking-wide">{statusText}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest px-2.5 py-1 bg-gray-50 rounded-full">
              <FileText size={14} className="opacity-70" />
              Due: {formattedDeadline}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 pt-2 sm:pt-0">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.a
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                href={material.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-gray-700 font-bold py-3.5 px-6 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 transition-all text-sm shadow-sm active:scale-95 touch-manipulation min-h-[48px]"
              >
                <ExternalLink size={18} />
                View Submitted File
              </motion.a>
            ) : (
              <div className="space-y-4">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                />
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 ${isOverdue ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'} text-white font-bold py-3.5 px-8 rounded-2xl transition-all text-sm shadow-lg disabled:opacity-50 min-h-[48px] touch-manipulation`}
                >
                  {isUploading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <UploadCloud size={18} />
                  )}
                  {isUploading ? `Uploading...` : `Submit ${material.item_name}`}
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isDragOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-indigo-600/10 backdrop-blur-[2px] rounded-2xl flex items-center justify-center border-2 border-dashed border-indigo-500 z-10"
          >
            <div className="bg-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3">
              <UploadCloud className="text-indigo-600" size={24} />
              <span className="font-bold text-indigo-900">Drop to upload {material.item_name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(isUploading || uploadError) && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3"
        >
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span>{selectedFileName}</span>
                <span>Finalizing...</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '90%' }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </div>
          )}
          
          {uploadError && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-100">
              <XCircle size={14} />
              {uploadError}
            </div>
          )}
        </motion.div>
      )}

      {!isSubmitted && (
        <div className="mt-6 pt-4 border-t border-gray-50">
          <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest text-center sm:text-left">
            ACCEPTED: PDF, DOC, DOCX  &bull;  MAX 10MB
          </p>
        </div>
      )}
      
      {isOverdue && !isUploading && (
        <div className="absolute top-0 right-0 p-3">
           <span className="bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded shadow-sm">Overdue</span>
        </div>
      )}
    </motion.div>
  )
}
