"use client"

import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium backdrop-blur-sm"
    >
      <ArrowLeft className="h-4 w-4" />
      Kembali
    </button>
  )
}