"use client"

import { cn } from "@/lib/utils"

interface WindCompassProps {
  direction: number // 0-359 (0 = North)
  speed: number     // km/h
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
    sm: "w-24 h-24",   // 96px
    md: "w-32 h-32",   // 128px
    lg: "w-48 h-48",   // 192px
    xl: "w-64 h-64"    // 256px
  }

  // --- 2. Helper: Cardinal Direction ---
  const getCardinalDirection = (deg: number) => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    const index = Math.round(deg / 22.5) % 16
    return directions[index]
  }

  // --- 3. Render Ticks (Garis Derajat) ---
  const renderTicks = () => {
    const ticks = []
    // Loop setiap 30 derajat (12 titik utama)
    for (let i = 0; i < 360; i += 30) {
      const isCardinal = i % 90 === 0 // N, E, S, W
      
      ticks.push(
        <div
          key={i}
          // PERBAIKAN 1: Gunakan width minimal (w-0.5) dan centering absolute yang presisi
          // Ini memastikan rotasi benar-benar terjadi di titik tengah jarum jam
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 flex justify-center pointer-events-none"
          style={{ transform: `rotate(${i}deg)` }}
        >
          {/* Garis Tick - Ditempelkan ke bagian atas wadah yang sudah dirotasi */}
          <div className={cn(
            "rounded-full",
            // Styling berbeda untuk arah utama (Cardinal) vs sela-sela
            // mt-[2px] memberikan sedikit jarak dari bezel luar agar tidak nempel banget
            isCardinal 
              ? "w-1.5 h-3 bg-slate-800 dark:bg-slate-200 mt-1" 
              : "w-0.5 h-2 bg-slate-400 dark:bg-slate-600 mt-1.5"
          )} />
        </div>
      )
    }
    return ticks
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      
      {/* --- WADAH UTAMA KOMPAS --- */}
      <div className={cn("relative flex items-center justify-center shrink-0 font-sans", sizeClasses[size])}>
        
        {/* A. OUTER BEZEL (Cincin Luar) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 shadow-xl border border-slate-300 dark:border-slate-700"></div>

        {/* B. INNER FACE (Wajah Kompas) */}
        <div className="absolute inset-1.5 rounded-full bg-white dark:bg-slate-950 shadow-inner border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          {/* C. TICKS (Garis Penanda) */}
          <div className="absolute inset-0">
            {renderTicks()}
          </div>

          {/* D. LABELS (Huruf Arah) */}
          {/* PERBAIKAN 2: Menggunakan inset-% (persen) agar posisi huruf menyesuaikan ukuran (size) kompas secara responsif */}
          <div className="absolute inset-0 font-bold select-none text-[10px] sm:text-xs md:text-sm">
            {/* North */}
            <span className="absolute top-[14%] left-1/2 -translate-x-1/2 text-orange-600 dark:text-orange-500">N</span>
            {/* South */}
            <span className="absolute bottom-[14%] left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-500">S</span>
            {/* East */}
            <span className="absolute right-[14%] top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">E</span>
            {/* West */}
            <span className="absolute left-[14%] top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">W</span>
          </div>

          {/* E. NEEDLE CONTAINER (Berputar) */}
          <div 
            className="absolute inset-0 transition-transform duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) z-10"
            style={{ transform: `rotate(${direction}deg)` }}
          >
            <div className="relative w-full h-full">
               {/* 1. Jarum Utama (Panah) */}
               {/* Menggunakan inset top-% agar jarum tidak menabrak huruf N */}
               <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-0 h-0 
                               border-l-[6px] border-r-[6px] border-b-[45px] 
                               border-l-transparent border-r-transparent border-b-sky-500 dark:border-b-cyan-400 
                               drop-shadow-sm filter">
               </div>
               
               {/* 2. Jarum Ekor (Penyeimbang) */}
               <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-0 h-0 
                               border-l-[6px] border-r-[6px] border-t-[45px] 
                               border-l-transparent border-r-transparent border-t-slate-300 dark:border-t-slate-700">
               </div>

               {/* 3. Center Pin */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white dark:bg-slate-900 rounded-full border-2 border-slate-400 dark:border-slate-500 z-20 shadow-sm"></div>
            </div>
          </div>

        </div>
      </div>

      {/* --- STATS CARD (Teks di Bawah) --- */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Kolom Arah */}
        <div className="flex flex-col items-center border-r border-slate-200 dark:border-slate-800 pr-3">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Dir</span>
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                    {direction}°
                </span>
                <span className="text-sm font-bold text-sky-600 dark:text-cyan-400">
                    {getCardinalDirection(direction)}
                </span>
            </div>
        </div>

        {/* Kolom Kecepatan */}
        <div className="flex flex-col items-center pl-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Speed</span>
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                    {speed}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                    km/h
                </span>
            </div>
        </div>

      </div>
    </div>
  )
}