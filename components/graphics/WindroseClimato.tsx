"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Wind, Compass } from "lucide-react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface WindroseClimatoProps {
  isDarkMode?: boolean;
}

const COMPASS_DIRS_16 = [
  "U","UTL","TL","TTL","T","TGR","TG","STG",
  "S","SBD","BD","BBD","B","BLD","BL","UBL",
];

const WIND_SPEED_BINS = [
  { max: 5,        label: "Tenang (0–5)",        color: "#93c5fd" },
  { max: 15,       label: "Lemah (5–15)",         color: "#34d399" },
  { max: 25,       label: "Sedang (15–25)",       color: "#fbbf24" },
  { max: 40,       label: "Kuat (25–40)",         color: "#f97316" },
  { max: Infinity, label: "Sangat Kuat (>40)",   color: "#ef4444" },
];

function degToDir16(deg: number): string {
  const idx = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16;
  return COMPASS_DIRS_16[idx];
}

async function fetchHistoricalWind(lat = -7.7366, lon = 109.6461): Promise<{ dirs: number[]; speeds: number[] }> {
  // Ambil data 1 tahun terakhir (past 365 hari) untuk sampel representatif
  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  const endDate = new Date(); endDate.setDate(endDate.getDate() - 2);
  const startDate = new Date(endDate); startDate.setFullYear(startDate.getFullYear() - 1);
  url.searchParams.set("latitude",  String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("start_date", startDate.toISOString().slice(0, 10));
  url.searchParams.set("end_date",   endDate.toISOString().slice(0, 10));
  url.searchParams.set("hourly", "wind_speed_10m,wind_direction_10m");
  url.searchParams.set("timezone", "Asia/Jakarta");
  url.searchParams.set("wind_speed_unit", "kmh");
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  const data = await res.json();
  return {
    dirs:   data.hourly.wind_direction_10m as number[],
    speeds: data.hourly.wind_speed_10m     as number[],
  };
}

function buildWindroseMatrix(dirs: number[], speeds: number[]) {
  const counts: Record<string, Record<string, number>> = {};
  for (const bin of WIND_SPEED_BINS) counts[bin.label] = {};

  for (let i = 0; i < dirs.length; i++) {
    if (dirs[i] == null || speeds[i] == null) continue;
    const dir   = degToDir16(dirs[i]);
    const speed = speeds[i];
    const bin   = WIND_SPEED_BINS.find(b => speed < b.max)!;
    counts[bin.label][dir] = (counts[bin.label][dir] ?? 0) + 1;
  }

  const total = dirs.filter(d => d != null).length || 1;
  return WIND_SPEED_BINS.map(bin => ({
    r:     COMPASS_DIRS_16.map(dir => ((counts[bin.label][dir] ?? 0) / total) * 100),
    theta: COMPASS_DIRS_16,
    name:  bin.label,
    color: bin.color,
  }));
}

export default function WindroseClimato({ isDarkMode = false }: WindroseClimatoProps) {
  const [windData, setWindData] = useState<{ dirs: number[]; speeds: number[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        const data = await fetchHistoricalWind();
        if (!cancelled) setWindData(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Gagal memuat data angin.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const traces = useMemo(() => {
    if (!windData) return [];
    return buildWindroseMatrix(windData.dirs, windData.speeds).map(bin => ({
      r:    bin.r,
      theta: bin.theta,
      type: "barpolar" as const,
      name: bin.name,
      marker: { color: bin.color },
      hovertemplate: "<b>%{theta}</b><br>%{r:.1f}%<extra>%{fullData.name}</extra>",
    }));
  }, [windData]);

  const dominantDir = useMemo(() => {
    if (!windData) return "-";
    const dirCount: Record<string, number> = {};
    windData.dirs.filter(Boolean).forEach(d => {
      const dir = degToDir16(d);
      dirCount[dir] = (dirCount[dir] ?? 0) + 1;
    });
    return Object.entries(dirCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
  }, [windData]);

  const avgSpeed = useMemo(() => {
    if (!windData?.speeds.length) return 0;
    const valid = windData.speeds.filter(s => s != null);
    return parseFloat((valid.reduce((s, v) => s + v, 0) / valid.length).toFixed(1));
  }, [windData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="text-muted-foreground text-sm">Memuat data angin historis…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-600">
        <AlertTriangle className="h-8 w-8" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const transparent = "rgba(0,0,0,0)";

  return (
    <div className="space-y-4">
      {/* Stat mini cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><Wind className="h-5 w-5" /></div>
            <div><p className="text-xs text-muted-foreground">Kecepatan Rata-Rata</p><p className="font-bold">{avgSpeed} km/j</p></div>
          </div>
        </Card>
        <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"><Compass className="h-5 w-5" /></div>
            <div><p className="text-xs text-muted-foreground">Arah Dominan</p><p className="font-bold">{dominantDir}</p></div>
          </div>
        </Card>
      </div>

      <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Compass className="h-5 w-5 text-blue-500" />
            Windrose — Distribusi Arah & Kecepatan Angin
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Data historis 1 tahun terakhir dari Open-Meteo Archive (ERA5-Land) · Resolusi hourly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Plot
            data={traces}
            layout={{
              polar: {
                radialaxis: {
                  visible: true,
                  ticksuffix: "%",
                  tickfont: { size: 10 },
                  gridcolor: "rgba(150,150,150,0.3)",
                },
                angularaxis: {
                  direction: "clockwise",
                  rotation: 90,
                  tickfont: { size: 11, color: isDarkMode ? "#94a3b8" : "#6b7280" },
                },
                bgcolor: transparent,
              },
              legend: { orientation: "h", y: -0.15, font: { size: 10 } },
              paper_bgcolor: transparent,
              plot_bgcolor: transparent,
              margin: { t: 10, b: 30, l: 10, r: 10 },
              showlegend: true,
              font: { color: isDarkMode ? "#cbd5e1" : "#475569" },
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: "100%", height: "450px" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
