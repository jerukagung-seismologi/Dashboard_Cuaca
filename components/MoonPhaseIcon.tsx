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
  size?: "sm" | "md" | "lg" | "xl"
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
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  }

  // --- LOGIKA BENTUK & ROTASI ---
  const { pathD, rotation, illumination } = useMemo(() => {
    
    // Radius kelengkungan perut (0-50).
    // 35 memberikan bentuk buncit/sabit yang pas seperti referensi.
    const rx = 35 
    
    let d = ""
    let rot = "rotate-0" // Default tegak lurus
    let illum = 0

    // M 50,0 = Titik Atas
    // A 50,50 0 0 1 50,100 = Gambar Setengah Lingkaran KANAN
    // A 50,50 0 0 0 50,100 = Gambar Setengah Lingkaran KIRI

    switch (phase) {
      case "new-moon":
        d = "" 
        illum = 0
        break

      case "waxing-crescent": 
        // SABIT MUDA (Mirip pisang)
        // Rotasi -45deg agar miring ke kanan bawah (seperti standar visual)
        rot = "-rotate-45"
        // 1. Luar Kanan
        // 2. Dalam Cekung (Sweep 0) -> Hasil: SABIT
        d = `M 50,0 A 50,50 0 0 1 50,100 A ${rx},50 0 0,0 50,0`
        illum = 0.25
        break

      case "first-quarter":
        rot = "rotate-0"
        d = `M 50,0 A 50,50 0 0 1 50,100 L 50,0`
        illum = 0.5
        break

      case "waxing-gibbous":
        // CEMBUNG MUDA (Sesuai Gambar Referensi Anda)
        // Rotasi -45deg agar cahaya ada di Kanan-Atas
        rot = "-rotate-45" 
        // 1. Luar Kanan
        // 2. Dalam Cembung Keluar (Sweep 1) -> Hasil: BUNCIT/TELUR
        d = `M 50,0 A 50,50 0 0 1 50,100 A ${rx},50 0 0,1 50,0`
        illum = 0.75
        break

      case "full-moon":
        d = `M 50,0 A 50,50 0 1 1 50,100 A 50,50 0 1 1 50,0`
        illum = 1
        break

      case "waning-gibbous":
        // CEMBUNG AKHIR
        rot = "rotate-45"
        // 1. Luar Kiri
        // 2. Dalam Cembung Keluar (Sweep 0) -> Hasil: BUNCIT
        d = `M 50,0 A 50,50 0 0 0 50,100 A ${rx},50 0 0,0 50,0`
        illum = 0.75
        break

      case "last-quarter":
        rot = "rotate-0"
        d = `M 50,0 A 50,50 0 0 0 50,100 L 50,0`
        illum = 0.5
        break

      case "waning-crescent":
        // SABIT TUA
        rot = "rotate-45"
        // 1. Luar Kiri
        // 2. Dalam Cekung (Sweep 1) -> Hasil: SABIT
        d = `M 50,0 A 50,50 0 0 0 50,100 A ${rx},50 0 0,1 50,0`
        illum = 0.25
        break
    }

    return { pathD: d, rotation: rot, illumination: illum }
  }, [phase])

  return (
    <div 
      className={cn("relative rounded-full aspect-square flex items-center justify-center", sizeClasses[size], className)}
      title={showLabel ? PHASE_NAMES[phase] : undefined}
    >
      {/* Container utama yang akan diputar sesuai fase */}
      <div className={cn("relative w-full h-full transition-transform duration-500", rotation)}>
        
        {/* 1. BACKGROUND (GELAP / BAYANGAN) */}
        {/* Warna abu-abu gelap seperti di gambar referensi Anda */}
        <div className="absolute inset-0 rounded-full bg-slate-800 dark:bg-slate-700 border border-slate-600 shadow-inner overflow-hidden"></div>

        {/* 2. FOREGROUND (CAHAYA MATAHARI) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            {/* Gradient Putih ke Abu-abu agar terlihat bulat 3D */}
            <radialGradient id="moonLight" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#ffffff" /> 
              <stop offset="100%" stopColor="#d1d5db" /> 
            </radialGradient>
          </defs>

          {/* Gambar Bagian Terang */}
          <path 
              d={pathD} 
              fill="url(#moonLight)" 
              className="transition-all duration-700 ease-in-out"
              filter="drop-shadow(0 0 1px rgba(255,255,255,0.5))"
          />
        </svg>
      </div>
      
      {/* 3. GLOW EFFECT (Di luar container rotasi agar glow tetap rata) */}
      {illumination > 0.8 && (
        <div className="absolute -inset-4 rounded-full bg-blue-100/10 blur-xl -z-10 animate-pulse pointer-events-none"></div>
      )}
    </div>
  )
}