import { cn } from "@/lib/utils" // Optional: Jika kamu butuh utility class nanti

interface RainMeasuringCupProps {
  value: number
  maxValue: number
  className?: string // Optional: Biar bisa atur margin/style dari luar
}

export default function RainMeasuringCup({ 
    value, 
    maxValue, 
    className 
}: RainMeasuringCupProps) {
  // Hitung persentase tinggi air (maksimal 100% agar tidak luber)
  const percentage = Math.min((value / maxValue) * 100, 100)

  return (
    <div className={cn("flex flex-row items-end justify-center gap-2 h-32 w-full my-4", className)}>
      {/* Skala Angka (Kiri) */}
      <div className="flex flex-col justify-between h-full text-[10px] text-muted-foreground font-mono text-right py-0.5">
        <span>{maxValue}</span>
        <span>{(maxValue * 0.75).toFixed(1).replace(/\.0$/, "")}</span>
        <span>{(maxValue * 0.5).toFixed(1).replace(/\.0$/, "")}</span>
        <span>{(maxValue * 0.25).toFixed(1).replace(/\.0$/, "")}</span>
        <span>0</span>
      </div>

      {/* Tabung Gelas */}
      <div className="relative w-14 h-full border-2 border-t-0 border-slate-300 dark:border-slate-600 rounded-b-2xl bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden shadow-inner">
        {/* Air (Liquid) */}
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-600 to-cyan-400 dark:from-cyan-700 dark:to-cyan-500 opacity-80 transition-all duration-1000 ease-out border-t border-cyan-300/50"
          style={{ height: `${percentage}%` }}
        >
          {/* Efek gelombang/permukaan air (Opsional, pemanis visual) */}
          <div className="w-full h-1 bg-white/30 absolute top-0"></div>
        </div>

        {/* Garis-garis Ukur (Overlay) */}
        <div className="absolute inset-0 flex flex-col justify-between py-0.5 px-1 pointer-events-none">
          <div className="w-3 border-t border-slate-400/50 dark:border-slate-500/50 ml-auto"></div> {/* 100% */}
          <div className="w-1.5 border-t border-slate-400/30 dark:border-slate-500/30 ml-auto"></div>
          <div className="w-3 border-t border-slate-400/50 dark:border-slate-500/50 ml-auto"></div> {/* 50% */}
          <div className="w-1.5 border-t border-slate-400/30 dark:border-slate-500/30 ml-auto"></div>
          <div className="w-3 border-t border-slate-400/50 dark:border-slate-500/50 ml-auto"></div> {/* 0% */}
        </div>
      </div>

      {/* Satuan (Kanan Bawah) */}
      <span className="text-[10px] text-muted-foreground mb-1">mm</span>
    </div>
  )
}