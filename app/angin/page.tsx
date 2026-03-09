"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Loader2, AlertTriangle, Wind, Compass, Gauge, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import {
  fetchMeteoData,
  JERUKAGUNG_LOCATION,
  type MeteoHourlyData,
} from "@/lib/FetchingMeteo";

// Import Plotly secara dinamis agar tidak SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// ─── Konstanta ────────────────────────────────────────────────────────────────

/** Arah mata angin 16 titik */
const COMPASS_DIRS = [
  "U", "UTL", "TL", "TTL",
  "T", "TGR", "TG", "STG",
  "S", "SBD", "BD", "BBD",
  "B", "BLD", "BL", "UBL",
];

/** Batas kelas kecepatan angin (km/j) */
const WIND_SPEED_BINS = [
  { max: 5,        label: "Tenang (0–5)",       color: "#93c5fd" },
  { max: 15,       label: "Lemah (5–15)",        color: "#34d399" },
  { max: 25,       label: "Sedang (15–25)",      color: "#fbbf24" },
  { max: 40,       label: "Kuat (25–40)",        color: "#f97316" },
  { max: Infinity, label: "Sangat Kuat (>40)",   color: "#ef4444" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Mengkonversi derajat ke arah 16 mata angin.
 */
function degToDir16(deg: number): string {
  const idx = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16;
  return COMPASS_DIRS[idx];
}

/**
 * Mengelompokkan data angin ke dalam matriks windrose.
 */
function buildWindroseMatrix(
  directions: number[],
  speeds: number[]
): { r: number[]; theta: string[]; name: string; color: string }[] {
  const counts: Record<string, Record<string, number>> = {};
  for (const bin of WIND_SPEED_BINS) {
    counts[bin.label] = {};
    for (const dir of COMPASS_DIRS) counts[bin.label][dir] = 0;
  }

  for (let i = 0; i < directions.length; i++) {
    const dir = degToDir16(directions[i]);
    const spd = speeds[i];
    const bin = WIND_SPEED_BINS.find(b => spd <= b.max)!;
    counts[bin.label][dir]++;
  }

  const total = directions.length || 1;
  return WIND_SPEED_BINS.map(bin => ({
    r:     COMPASS_DIRS.map(dir => (counts[bin.label][dir] / total) * 100),
    theta: [...COMPASS_DIRS],
    name:  bin.label,
    color: bin.color,
  }));
}

/**
 * Menghitung statistik ringkasan dari data angin.
 */
function calcWindStats(speeds: number[], directions: number[]) {
  if (speeds.length === 0) return null;
  const avg  = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const max  = Math.max(...speeds);
  const maxI = speeds.indexOf(max);
  const dominant = degToDir16(
    directions.reduce((a, b) => a + b, 0) / directions.length
  );
  return {
    avg,
    max,
    dominantDir: dominant,
    maxDir: degToDir16(directions[maxI]),
  };
}

// ─── Komponen Statistik ───────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold leading-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Komponen Konten ──────────────────────────────────────────────────────────

function WindRoseContent() {
  const [hourly, setHourly]   = useState<MeteoHourlyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchMeteoData(JERUKAGUNG_LOCATION, {
          hourly:       true,
          daily:        false,
          current:      false,
          pastDays:     1,
          forecastDays: 1,
        });
        setHourly(res.hourly ?? null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Gagal memuat data angin.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter hanya data dari kemarin
  const yesterdayData = useMemo(() => {
    if (!hourly) return { directions: [], speeds: [], gusts: [], times: [] };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);

    const indices = hourly.time
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.startsWith(yStr))
      .map(({ i }) => i);

    return {
      directions: indices.map(i => hourly.wind_direction_10m[i]),
      speeds:     indices.map(i => hourly.wind_speed_10m[i]),
      gusts:      indices.map(i => hourly.wind_gusts_10m[i]),
      times:      indices.map(i => hourly.time[i]),
    };
  }, [hourly]);

  const windroseTraces = useMemo(
    () => buildWindroseMatrix(yesterdayData.directions, yesterdayData.speeds),
    [yesterdayData]
  );

  const stats = useMemo(
    () => calcWindStats(yesterdayData.speeds, yesterdayData.directions),
    [yesterdayData]
  );

  const yesterdayLabel = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p>Memuat data angin...</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-600 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm rounded-xl p-6">
        <AlertTriangle className="h-12 w-12 mb-3" />
        <p className="font-semibold text-lg">Gagal Memuat Data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // ── Plotly Traces ────────────────────────────────────────────────────────────
  const traces = windroseTraces.map(({ r, theta, name, color }) => ({
    r,
    theta,
    name,
    type:          "barpolar" as const,
    marker:        { color, opacity: 0.85 },
    hovertemplate: "<b>%{theta}</b><br>%{r:.1f}% kejadian<extra>%{fullData.name}</extra>",
  }));

  const lineTrace = {
    x:    yesterdayData.times.map(t =>
            new Date(t).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
          ),
    y:    yesterdayData.speeds,
    name: "Kecepatan Angin",
    type: "scatter" as const,
    mode: "lines+markers" as const,
    line: { color: "#3b82f6", width: 2 },
    fill: "tozeroy" as const,
    fillcolor: "rgba(59,130,246,0.15)",
    hovertemplate: "%{x}<br><b>%{y:.1f} km/j</b><extra></extra>",
  };

  const gustTrace = {
    x:    yesterdayData.times.map(t =>
            new Date(t).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
          ),
    y:    yesterdayData.gusts,
    name: "Hembusan",
    type: "scatter" as const,
    mode: "lines" as const,
    line: { color: "#f97316", width: 1.5, dash: "dot" as const },
    hovertemplate: "%{x}<br><b>%{y:.1f} km/j</b><extra>Hembusan</extra>",
  };

  return (
    <div className="space-y-6">

      {/* ── Judul Halaman ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analisis Angin</h2>
          <p className="text-muted-foreground text-sm">
            {yesterdayLabel} • Jerukagung, Kebumen
          </p>
        </div>
        <Badge variant="outline" className="self-start sm:self-auto text-xs">
          Sumber: Open-Meteo
        </Badge>
      </div>

      {/* ── Kartu Statistik ───────────────────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={Wind}
            label="Rata-rata Kecepatan"
            value={`${stats.avg.toFixed(1)} km/j`}
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          />
          <StatCard
            icon={ArrowUp}
            label="Kecepatan Maks"
            value={`${stats.max.toFixed(1)} km/j`}
            sub={`Arah: ${stats.maxDir}`}
            color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          />
          <StatCard
            icon={Compass}
            label="Arah Dominan"
            value={stats.dominantDir}
            color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          />
          <StatCard
            icon={Gauge}
            label="Jumlah Data"
            value={`${yesterdayData.speeds.length} jam`}
            color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          />
        </div>
      )}

      {/* ── Grafik ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Windrose */}
        <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Compass className="h-5 w-5 text-blue-500" />
              Windrose — Distribusi Arah & Kecepatan
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Plot
              data={traces}
              layout={{
                polar: {
                  radialaxis: {
                    visible:    true,
                    ticksuffix: "%",
                    tickfont:   { size: 10 },
                    gridcolor:  "rgba(150,150,150,0.3)",
                  },
                  angularaxis: {
                    direction: "clockwise",
                    rotation:  90,
                    tickfont:  { size: 11, color: "#6b7280" },
                  },
                  bgcolor: "rgba(0,0,0,0)",
                },
                legend: {
                  orientation: "h",
                  y:           -0.15,
                  font:        { size: 10 },
                },
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor:  "rgba(0,0,0,0)",
                margin:        { t: 10, b: 10, l: 10, r: 10 },
                showlegend:    true,
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "400px" }}
            />
          </CardContent>
        </Card>

        {/* Grafik Garis per Jam */}
        <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wind className="h-5 w-5 text-orange-500" />
              Kecepatan & Hembusan Angin per Jam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Plot
              data={[lineTrace, gustTrace]}
              layout={{
                xaxis: {
                  title:     { text: "Waktu (WIB)", font: { size: 11 } },
                  tickangle: -45,
                  tickfont:  { size: 9 },
                  gridcolor: "rgba(150,150,150,0.2)",
                },
                yaxis: {
                  title:     { text: "Kecepatan (km/j)", font: { size: 11 } },
                  tickfont:  { size: 10 },
                  gridcolor: "rgba(150,150,150,0.2)",
                  rangemode: "tozero",
                },
                legend: {
                  orientation: "h",
                  y:           -0.25,
                  font:        { size: 10 },
                },
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor:  "rgba(0,0,0,0)",
                margin:        { t: 10, b: 60, l: 50, r: 10 },
                hovermode:     "x unified",
                showlegend:    true,
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "400px" }}
            />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────

export default function WindRosePage() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="weather-theme-preference">
      <div className="relative flex min-h-screen flex-col">

        {/* Wallpaper Background — sama dengan page.tsx */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/weather-background.jpg"
            alt="Weather background"
            fill
            priority
            quality={85}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Overlay semi-transparan */}
        <div
          className="fixed inset-0 -z-10 bg-white/60 dark:bg-gray-950/60"
          aria-hidden="true"
        />

        {/* Header */}
        <Header />

        {/* Konten Utama */}
        <main className="container mx-auto px-4 py-6 flex-1">
          <WindRoseContent />
        </main>

        {/* Footer */}
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}