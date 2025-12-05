"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

export type MoonPhaseType =
  | "new-moon"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full-moon"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent"

interface MoonPhaseIconProps {
  phase: MoonPhaseType
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  className?: string
  showLabel?: boolean
}

const PHASE_NAMES: Record<MoonPhaseType, string> = {
  "new-moon": "Bulan Baru",
  "waxing-crescent": "Sabit Muda",
  "first-quarter": "Kuartal Pertama",
  "waxing-gibbous": "Cembung Muda",
  "full-moon": "Bulan Purnama",
  "waning-gibbous": "Cembung Akhir",
  "last-quarter": "Kuartal Ketiga",
  "waning-crescent": "Sabit Tua",
}

export default function MoonPhaseIcon({ 
  phase, 
  size = "md", 
  className,
  showLabel = true 
}: MoonPhaseIconProps) {
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
    "2xl": "w-48 h-48",
  }

  // --- LOGIKA MASKING & CAHAYA ---
  const { pathD, rotation, shadowOpacity } = useMemo(() => {
    // Radius kelengkungan
    const rx = 35 
    
    let d = ""
    let rot = 0 // Derajat rotasi mask
    let opacity = 0 // Opacity untuk glow

    // Kita menggambar 'Mask' (Bagian yang TERANG)
    // M 50,0 ... adalah koordinat path relatif terhadap viewBox 0 0 100 100
    switch (phase) {
      case "new-moon":
        d = "M 0,0" // Tidak ada cahaya
        rot = 0
        opacity = 0
        break

      case "waxing-crescent": 
        // Cahaya di Kanan Bawah
        rot = -45
        d = `M 50,0 A 50,50 0 0 1 50,100 A ${rx},50 0 0,0 50,0`
        opacity = 0.3
        break

      case "first-quarter":
        // Cahaya Setengah Kanan
        rot = 0
        d = `M 50,0 A 50,50 0 0 1 50,100 L 50,0`
        opacity = 0.5
        break

      case "waxing-gibbous":
        // Cahaya Hampir Penuh (Kanan Atas Dominan)
        rot = -45
        d = `M 50,0 A 50,50 0 0 1 50,100 A ${rx},50 0 0,1 50,0`
        opacity = 0.8
        break

      case "full-moon":
        rot = 0
        d = `M 50,0 A 50,50 0 1 1 50,100 A 50,50 0 1 1 50,0`
        opacity = 1
        break

      case "waning-gibbous":
        // Cahaya Hampir Penuh (Kiri Dominan)
        rot = 45
        d = `M 50,0 A 50,50 0 0 0 50,100 A ${rx},50 0 0,0 50,0`
        opacity = 0.8
        break

      case "last-quarter":
        // Cahaya Setengah Kiri
        rot = 0
        d = `M 50,0 A 50,50 0 0 0 50,100 L 50,0`
        opacity = 0.5
        break

      case "waning-crescent":
        // Cahaya Sabit Kiri
        rot = 45
        d = `M 50,0 A 50,50 0 0 0 50,100 A ${rx},50 0 0,1 50,0`
        opacity = 0.3
        break
    }

    return { pathD: d, rotation: rot, shadowOpacity: opacity }
  }, [phase])

  // ID unik untuk mask agar tidak bentrok jika ada banyak icon di satu halaman
  const uniqueId = `moon-mask-${phase}-${size}`

  return (
    <div 
      className={cn("relative flex items-center justify-center", sizeClasses[size], className)}
      title={showLabel ? PHASE_NAMES[phase] : undefined}
    >
      <div className="relative w-full h-full">
        
        {/* SVG Container */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-2xl"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* 1. Definisi Filter & Gradient untuk Realisme */}
            
            {/* Gradient Permukaan Bulan (Abu-abu ke Putih) */}
            <radialGradient id="surfaceGrad" cx="40%" cy="40%" r="90%">
              <stop offset="0%" stopColor="#e2e8f0" /> {/* slate-200 */}
              <stop offset="80%" stopColor="#94a3b8" /> {/* slate-400 */}
              <stop offset="100%" stopColor="#475569" /> {/* slate-600 (tepi gelap) */}
            </radialGradient>

            {/* Gradient Bagian Gelap (Earthshine) - Efek cahaya pantulan bumi */}
            <radialGradient id="earthshineGrad" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#1e293b" /> {/* slate-800 */}
              <stop offset="100%" stopColor="#0f172a" /> {/* slate-900 */}
            </radialGradient>

            {/* Pola Kawah (Craters) */}
            <pattern id="craters" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* Kawah-kawah acak */}
              <circle cx="30" cy="30" r="10" fill="#cbd5e1" opacity="0.5" />
              <circle cx="70" cy="60" r="8" fill="#cbd5e1" opacity="0.4" />
              <circle cx="55" cy="20" r="4" fill="#cbd5e1" opacity="0.3" />
              <circle cx="20" cy="70" r="6" fill="#cbd5e1" opacity="0.4" />
              <circle cx="80" cy="30" r="5" fill="#cbd5e1" opacity="0.3" />
              <circle cx="45" cy="80" r="12" fill="#cbd5e1" opacity="0.2" />
            </pattern>

            {/* Masking: Bentuk fase cahaya */}
            <mask id={uniqueId}>
              {/* Hitam = Sembunyi, Putih = Tampil */}
              <rect x="0" y="0" width="100" height="100" fill="black" />
              <path 
                d={pathD} 
                fill="white" 
                transform={`rotate(${rotation} 50 50)`} 
                className="transition-all duration-700 ease-in-out"
              />
            </mask>
          </defs>

          {/* LAYER 1: Sisi Gelap (Earthshine) */}
          <circle cx="50" cy="50" r="49" fill="url(#earthshineGrad)" stroke="#1e293b" strokeWidth="1" />
          
          {/* LAYER 2: Sisi Terang (Dengan Masking Fase) */}
          <g mask={`url(#${uniqueId})`}>
            {/* Dasar Terang */}
            <circle cx="50" cy="50" r="49.5" fill="url(#surfaceGrad)" />
            {/* Tekstur Kawah (Hanya muncul di bagian terang) */}
            <circle cx="50" cy="50" r="49.5" fill="url(#craters)" style={{ mixBlendMode: 'multiply' }} />
          </g>

          {/* LAYER 3: Inner Shadow untuk kesan bola 3D (selalu di atas) */}
          <circle 
            cx="50" 
            cy="50" 
            r="49.5" 
            fill="none" 
            stroke="black" 
            strokeOpacity="0.1" 
            strokeWidth="1"
            className="pointer-events-none"
          />
          <path
             d="M 50,0 A 50,50 0 1 1 50,100 A 50,50 0 1 1 50,0"
             fill="url(#earthshineGrad)"
             opacity="0.1"
             className="pointer-events-none"
             style={{ mixBlendMode: 'overlay' }}
          />

        </svg>

        {/* LAYER 4: Outer Glow (Cahaya atmosfer) */}
        {shadowOpacity > 0 && (
          <div 
            className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-400 blur-xl transition-opacity duration-700"
            style={{ 
              opacity: shadowOpacity * 0.4, // Maksimal 40% opacity
              zIndex: -1 
            }}
          ></div>
        )}
      </div>
    </div>
  )
}