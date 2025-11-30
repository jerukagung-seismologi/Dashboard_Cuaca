"use client"

import { cn } from "@/lib/utils"

interface WindCompassProps {
  direction: number // 0-359
  speed: number // km/h
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export default function WindCompass({ 
  direction, 
  speed, 
  size = "md", 
  className 
}: WindCompassProps) {

  // --- 1. Konfigurasi Ukuran ---
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64"
  }

  // --- 2. Helper: Cardinal Direction ---
  const getCardinalDirection = (deg: number) => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    const index = Math.round(deg / 22.5) % 16
    return directions[index]
  }

  // --- 3. Helper: Generate Ticks (Garis-garis Kompas) ---
  const renderTicks = () => {
    const ticks = []
    for (let i = 0; i < 360; i += 30) {
      const isMajor = i % 90 === 0 // N, E, S, W
      ticks.push(
        <div
          key={i}
          className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 origin-bottom",
            "h-full pointer-events-none"
          )}
          style={{ transform: `rotate(${i}deg)` }}
        >
          <div className={cn(
            "w-0.5 mx-auto bg-slate-400 dark:bg-slate-600",
            isMajor ? "h-3 mt-1 w-1 bg-slate-900 dark:bg-slate-300" : "h-2 mt-1"
          )} />
        </div>
      )
    }
    return ticks
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      
      {/* --- KOMPAS UTAMA --- */}
      <div className={cn("relative rounded-full shadow-xl", sizeClasses[size])}>
        
        {/* 1. BACKGROUND (Base Plate) */}
        <div className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 shadow-inner"></div>

        {/* 2. TICKS & LABELS (Static) */}
        <div className="absolute inset-0 rounded-full">
          {renderTicks()}
          
          {/* Label Mata Angin Utama */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">N</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">S</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">E</span>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">W</span>
        </div>

        {/* 3. JARUM PENUNJUK (Rotating Needle) */}
        <div 
          className="absolute inset-0 transition-transform duration-1000 ease-out z-10"
          style={{ transform: `rotate(${direction}deg)` }}
        >
          {/* Menggunakan SVG Custom untuk Jarum yang Keren */}
          <div className="relative w-full h-full">
             {/* Panah Utama (Menunjuk Arah Angin) */}
             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-1/2 flex flex-col items-center justify-start origin-bottom">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-8 h-8 -mt-2 text-sky-500 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.6)]"
                  fill="currentColor"
                >
                  {/* Bentuk Panah Navigasi */}
                  <path d="M12 2L4.5 20.29C4.5 20.29 12 18 12 18C12 18 19.5 20.29 19.5 20.29L12 2Z" />
                </svg>
             </div>
             
             {/* Ekor Jarum (Opposite) - Opsional biar kayak kompas magnetik */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1 h-[40%] bg-gradient-to-t from-slate-400/50 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* 4. CENTER CAP (Tutup Poros Tengah) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 dark:bg-slate-200 rounded-full border-2 border-slate-300 dark:border-slate-600 shadow-md z-20"></div>

        {/* 5. GLASS COVER (Efek Kaca Cembung) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none z-30 rounded-br-[40%]"></div>
      </div>

      {/* --- INFO TEKS DI BAWAH --- */}
      <div className="text-center mt-1">
        <div className="flex items-center justify-center gap-1.5">
            <BadgeDirection dir={getCardinalDirection(direction)} />
            <span className="text-2xl font-bold text-slate-700 dark:text-slate-100 tabular-nums">
                {direction}°
            </span>
        </div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
            {speed} km/h
        </p>
      </div>

    </div>
  )
}

// Komponen Kecil untuk Badge Arah Angin (N, NE, dll)
function BadgeDirection({ dir }: { dir: string }) {
    return (
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            {dir}
        </span>
    )
}