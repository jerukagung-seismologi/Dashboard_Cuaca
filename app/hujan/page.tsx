"use client";

/*
PSEUDOCODE PLAN (DETAIL):
1) Import dependencies:
   - React hooks (useEffect, useMemo, useState)
   - dynamic import for Plotly (no SSR)
   - Next/Image for wallpaper consistency
   - UI components (Card, Badge, Header, Footer, ThemeProvider, Toaster)
   - icons for rain dashboard
   - Open-Meteo fetch helper from FetchingMeteo.ts

2) Build helpers:
   - formatDateKeyInTZ(date, timeZone):
     - use Intl.DateTimeFormat with "en-CA" to produce YYYY-MM-DD key in target timezone.
   - formatTimeLabel(timeString):
     - convert hourly timestamp to HH:mm (id-ID) for x-axis labels.
   - sum(values):
     - reduce numeric arrays safely.
   - maxWithIndex(values):
     - find maximum value and index safely.

3) Build RainStatCard component:
   - reusable card for summary metrics.
   - props: icon, label, value, sub, color.

4) Build RainContent component:
   - states:
     - hourly: MeteoHourlyData | null
     - loading: boolean
     - error: string | null
   - on mount:
     - call fetchMeteoData with:
       - hourly: true
       - daily: true (optional fallback/extra)
       - current: false
       - pastDays: 1
       - forecastDays: 1
     - store hourly result
     - set loading/error accordingly.

5) Derive yesterday hourly dataset (WIB):
   - get yesterday key in Asia/Jakarta using helper.
   - filter indices where hourly.time[i] startsWith(yesterdayKey).
   - build derived arrays:
     - times
     - precipitation
     - rain
     - showers
     - precipitation_probability
   - create fallback empty arrays if hourly null.

6) Derive summary stats:
   - totalPrecipitation = sum(precipitation)
   - rainyHours = count precipitation > 0
   - maxHourly + max index from precipitation
   - peakHour from times[maxIndex] formatted HH:mm
   - averageChance from precipitation_probability mean
   - keep safe fallback if no data.

7) Build Plotly traces:
   - traceBarPrecip: bar chart of precipitation hourly (mm)
   - traceLineChance: line chart on y2 for precipitation probability (%)
   - traceLineCum: cumulative precipitation line (mm)
   - layout:
     - transparent backgrounds
     - xaxis hour labels
     - yaxis left for mm
     - yaxis2 right for %
     - legend bottom horizontal
     - responsive modebar off.

8) Render states:
   - loading: centered spinner
   - error: alert card

9) Render content:
   - title + date badge
   - stat cards grid
   - main chart card (hourly rainfall + chance)
   - second chart card (cumulative rainfall)

10) Export page wrapper:
   - ThemeProvider
   - fixed wallpaper image + overlay (match angin page style)
   - Header
   - main container with RainContent
   - Footer + Toaster
*/

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Loader2,
  AlertTriangle,
  Droplets,
  CloudRain,
  Gauge,
  Clock3,
} from "lucide-react";
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

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

function formatDateKeyInTZ(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date); // YYYY-MM-DD
}

function formatTimeLabel(isoLike: string): string {
  return new Date(isoLike).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

function maxWithIndex(values: number[]): { max: number; index: number } {
  if (values.length === 0) return { max: 0, index: -1 };
  let max = values[0];
  let index = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] > max) {
      max = values[i];
      index = i;
    }
  }
  return { max, index };
}

function RainStatCard({
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

function RainContent() {
  const [hourly, setHourly] = useState<MeteoHourlyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const TIMEZONE = "Asia/Jakarta";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchMeteoData(JERUKAGUNG_LOCATION, {
          hourly: true,
          daily: true,
          current: false,
          pastDays: 1,
          forecastDays: 1,
        });
        setHourly(res.hourly ?? null);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat data curah hujan."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const yesterdayData = useMemo(() => {
    if (!hourly) {
      return {
        dateKey: "",
        times: [] as string[],
        precipitation: [] as number[],
        rain: [] as number[],
        showers: [] as number[],
        probability: [] as number[],
      };
    }

    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yKey = formatDateKeyInTZ(d, TIMEZONE);

    const indices = hourly.time
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.startsWith(yKey))
      .map(({ i }) => i);

    return {
      dateKey: yKey,
      times: indices.map((i) => hourly.time[i]),
      precipitation: indices.map((i) => hourly.precipitation[i]),
      rain: indices.map((i) => hourly.rain[i]),
      showers: indices.map((i) => hourly.showers[i]),
      probability: indices.map((i) => hourly.precipitation_probability[i]),
    };
  }, [hourly]);

  const stats = useMemo(() => {
    const total = sum(yesterdayData.precipitation);
    const rainyHours = yesterdayData.precipitation.filter((v) => v > 0).length;
    const { max, index } = maxWithIndex(yesterdayData.precipitation);
    const peakHour =
      index >= 0 ? formatTimeLabel(yesterdayData.times[index]) : "—";
    const avgChance =
      yesterdayData.probability.length > 0
        ? sum(yesterdayData.probability) / yesterdayData.probability.length
        : 0;

    return {
      total,
      rainyHours,
      maxHourly: max,
      peakHour,
      avgChance,
      points: yesterdayData.times.length,
    };
  }, [yesterdayData]);

  const cumulative = useMemo(() => {
    const out: number[] = [];
    let acc = 0;
    for (const v of yesterdayData.precipitation) {
      acc += v;
      out.push(acc);
    }
    return out;
  }, [yesterdayData.precipitation]);

  const yesterdayLabel = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: TIMEZONE,
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p>Memuat data curah hujan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-600 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm rounded-xl p-6">
        <AlertTriangle className="h-12 w-12 mb-3" />
        <p className="font-semibold text-lg">Gagal Memuat Data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const xLabels = yesterdayData.times.map((t) => formatTimeLabel(t));

  const traceHourly = {
    x: xLabels,
    y: yesterdayData.precipitation,
    type: "bar" as const,
    name: "Curah Hujan (mm)",
    marker: { color: "rgba(59,130,246,0.75)" },
    hovertemplate: "%{x}<br><b>%{y:.2f} mm</b><extra>Curah Hujan</extra>",
  };

  const traceChance = {
    x: xLabels,
    y: yesterdayData.probability,
    type: "scatter" as const,
    mode: "lines+markers" as const,
    name: "Peluang Hujan (%)",
    yaxis: "y2" as const,
    line: { color: "#f97316", width: 2 },
    hovertemplate: "%{x}<br><b>%{y:.0f}%</b><extra>Peluang</extra>",
  };

  const traceCumulative = {
    x: xLabels,
    y: cumulative,
    type: "scatter" as const,
    mode: "lines+markers" as const,
    name: "Akumulasi Hujan",
    line: { color: "#2563eb", width: 2.5 },
    fill: "tozeroy" as const,
    fillcolor: "rgba(37,99,235,0.15)",
    hovertemplate: "%{x}<br><b>%{y:.2f} mm</b><extra>Akumulasi</extra>",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analisis Curah Hujan</h2>
          <p className="text-muted-foreground text-sm">
            {yesterdayLabel} • Jerukagung, Kebumen
          </p>
        </div>
        <Badge variant="outline" className="self-start sm:self-auto text-xs">
          Sumber: Open-Meteo
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <RainStatCard
          icon={Droplets}
          label="Total Hujan"
          value={`${stats.total.toFixed(2)} mm`}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <RainStatCard
          icon={CloudRain}
          label="Puncak per Jam"
          value={`${stats.maxHourly.toFixed(2)} mm`}
          sub={`Jam ${stats.peakHour}`}
          color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
        />
        <RainStatCard
          icon={Clock3}
          label="Jam Hujan"
          value={`${stats.rainyHours} jam`}
          sub={`Dari ${stats.points} titik data`}
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <RainStatCard
          icon={Gauge}
          label="Rata-rata Peluang"
          value={`${stats.avgChance.toFixed(0)}%`}
          color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CloudRain className="h-5 w-5 text-blue-500" />
              Curah Hujan per Jam & Peluang Hujan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Plot
              data={[traceHourly, traceChance]}
              layout={{
                xaxis: {
                  title: { text: "Waktu (WIB)", font: { size: 11 } },
                  tickangle: -45,
                  tickfont: { size: 9 },
                  gridcolor: "rgba(150,150,150,0.2)",
                },
                yaxis: {
                  title: { text: "Curah Hujan (mm)", font: { size: 11 } },
                  tickfont: { size: 10 },
                  rangemode: "tozero",
                  gridcolor: "rgba(150,150,150,0.2)",
                },
                yaxis2: {
                  title: { text: "Peluang (%)", font: { size: 11 } },
                  tickfont: { size: 10 },
                  overlaying: "y",
                  side: "right",
                  range: [0, 100],
                },
                legend: {
                  orientation: "h",
                  y: -0.25,
                  font: { size: 10 },
                },
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
                margin: { t: 10, b: 60, l: 50, r: 50 },
                hovermode: "x unified",
                showlegend: true,
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "400px" }}
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplets className="h-5 w-5 text-indigo-500" />
              Akumulasi Curah Hujan (Kumulatif)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Plot
              data={[traceCumulative]}
              layout={{
                xaxis: {
                  title: { text: "Waktu (WIB)", font: { size: 11 } },
                  tickangle: -45,
                  tickfont: { size: 9 },
                  gridcolor: "rgba(150,150,150,0.2)",
                },
                yaxis: {
                  title: { text: "Akumulasi (mm)", font: { size: 11 } },
                  tickfont: { size: 10 },
                  rangemode: "tozero",
                  gridcolor: "rgba(150,150,150,0.2)",
                },
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
                margin: { t: 10, b: 60, l: 50, r: 10 },
                hovermode: "x unified",
                showlegend: false,
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

export default function RainPage() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="weather-theme-preference">
      <div className="relative flex min-h-screen flex-col">
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

        <div
          className="fixed inset-0 -z-10 bg-white/60 dark:bg-gray-950/60"
          aria-hidden="true"
        />

        <Header />

        <main className="container mx-auto px-4 py-6 flex-1">
          <RainContent />
        </main>

        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}