"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  AlertTriangle,
  BarChart2,
  Cloud,
  Wind as WindIcon,
  Droplets,
  SunMedium,
  Flame,
  Globe2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { fetchClimateNormals, type ClimateNormals } from "@/lib/FetchingClimatology";
import { calculateSpiSeries } from "@/lib/spiCalculator";
import WalterLiethClimograph from "@/components/graphics/WalterLiethClimograph";
import WindroseClimato from "@/components/graphics/WindroseClimato";
import RainfallClimatology from "@/components/graphics/RainfallClimatology";
import { SpiDroughtSection } from "@/components/graphics/SpiDroughtSection";
import { EtccdiExtremesSection } from "@/components/graphics/EtccdiExtremesSection";
import { ChcEarlyEstimatesViewer } from "@/components/graphics/ChcEarlyEstimatesViewer";

// ─── Konten utama halaman klimatologi ─────────────────────────────────────────
function KlimatologiContent() {
  const [normals, setNormals] = useState<ClimateNormals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Koordinat Jerukagung, Kebumen (Normal WMO 1991 - 2020)
        const data = await fetchClimateNormals(-7.7366, 109.6461, 1991, 2020);
        if (!cancelled) setNormals(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Gagal memuat data klimatologi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Perhitungan SPI (Standardized Precipitation Index) multiskala
  const spiData = useMemo(() => {
    if (!normals?.monthlySeries || normals.monthlySeries.length === 0) return null;
    const historicalNormalRain = normals.monthly.map((m) => m.precipMean);
    return {
      spi1: calculateSpiSeries(normals.monthlySeries, 1, historicalNormalRain),
      spi3: calculateSpiSeries(normals.monthlySeries, 3, historicalNormalRain),
      spi6: calculateSpiSeries(normals.monthlySeries, 6, historicalNormalRain),
      spi12: calculateSpiSeries(normals.monthlySeries, 12, historicalNormalRain),
      dataRange: {
        start: normals.monthlySeries[0]?.dateStr || "1991-01",
        end: normals.monthlySeries[normals.monthlySeries.length - 1]?.dateStr || "2020-12",
        totalMonths: normals.monthlySeries.length,
      },
    };
  }, [normals]);

  const currentPeriodNormals = useMemo(() => {
    if (!normals) return null;
    return {
      periodLabel: "Normal WMO 1991-2020",
      startYear: 1991,
      endYear: 2020,
      monthlyMeans: normals.monthly.map((m, idx) => ({
        monthIndex: idx,
        monthName: m.fullName,
        precipMean: m.precipMean,
      })),
      annualMean: normals.annual.precipMean,
    };
  }, [normals]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-muted-foreground text-sm">Mengunduh data klimatologi 1991-2020 dari Open-Meteo Archive...</p>
        <p className="text-muted-foreground text-xs">(Menghitung normal 30 tahun, indeks kekeringan SPI & indeks ekstrem ETCCDI)</p>
      </div>
    );
  }

  if (error || !normals) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-red-600 bg-red-50/80 dark:bg-red-900/20 rounded-xl p-6">
        <AlertTriangle className="h-10 w-10" />
        <p className="font-semibold text-lg">Gagal Memuat Data</p>
        <p className="text-sm text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-blue-500" />
            Klimatologi & Dinamika Iklim Jerukagung
          </h2>
          <p className="text-muted-foreground text-sm">
            Profil iklim normal 1991-2020 • Koordinat {normals.latitude.toFixed(4)}°, {normals.longitude.toFixed(4)}° • Elevasi {normals.elevation} m dpl
          </p>
        </div>
        <Badge variant="outline" className="self-start sm:self-auto text-xs bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          Standar WMO & Satelit CHIRPS UCSB
        </Badge>
      </div>

      {/* Tabs Menu Lengkap Klimatologi */}
      <Tabs defaultValue="climograph" className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-6 w-full h-auto p-1 gap-1">
          <TabsTrigger value="climograph" className="gap-1.5 text-xs sm:text-sm py-2">
            <Cloud className="h-3.5 w-3.5 text-blue-500" /> Walter-Lieth
          </TabsTrigger>
          <TabsTrigger value="rainfall" className="gap-1.5 text-xs sm:text-sm py-2">
            <Droplets className="h-3.5 w-3.5 text-sky-500" /> Curah Hujan
          </TabsTrigger>
          <TabsTrigger value="windrose" className="gap-1.5 text-xs sm:text-sm py-2">
            <WindIcon className="h-3.5 w-3.5 text-teal-500" /> Pola Angin
          </TabsTrigger>
          <TabsTrigger value="spi" className="gap-1.5 text-xs sm:text-sm py-2">
            <SunMedium className="h-3.5 w-3.5 text-amber-500" /> Indeks SPI
          </TabsTrigger>
          <TabsTrigger value="etccdi" className="gap-1.5 text-xs sm:text-sm py-2">
            <Flame className="h-3.5 w-3.5 text-red-500" /> Ekstrem ETCCDI
          </TabsTrigger>
          <TabsTrigger value="chirps" className="gap-1.5 text-xs sm:text-sm py-2">
            <Globe2 className="h-3.5 w-3.5 text-emerald-500" /> Satelit CHIRPS
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Walter-Lieth Climograph */}
        <TabsContent value="climograph" className="mt-4">
          <WalterLiethClimograph normals={normals} isDarkMode={isDark} />
        </TabsContent>

        {/* Tab 2: Curah Hujan Bulanan (ECharts) */}
        <TabsContent value="rainfall" className="mt-4">
          <RainfallClimatology normals={normals} isDarkMode={isDark} />
        </TabsContent>

        {/* Tab 3: Pola Angin Klimatologis */}
        <TabsContent value="windrose" className="mt-4">
          <WindroseClimato isDarkMode={isDark} />
        </TabsContent>

        {/* Tab 4: Indeks Kekeringan SPI */}
        <TabsContent value="spi" className="mt-4">
          <SpiDroughtSection
            spiData={spiData}
            currentPeriodNormals={currentPeriodNormals}
            isDarkMode={isDark}
          />
        </TabsContent>

        {/* Tab 5: Indeks Ekstrem Cuaca ETCCDI */}
        <TabsContent value="etccdi" className="mt-4">
          <EtccdiExtremesSection
            points={normals.dailyRecords}
            stationName="Stasiun Jerukagung, Kebumen"
            isDarkMode={isDark}
          />
        </TabsContent>

        {/* Tab 6: Satelit CHIRPS Early Estimates (UCSB) */}
        <TabsContent value="chirps" className="mt-4">
          <ChcEarlyEstimatesViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Halaman utama dengan shell (wallpaper, header, footer) ───────────────────
export default function KlimatologiPage() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="weather-theme-preference">
      <div className="relative flex min-h-screen flex-col">
        <div className="fixed inset-0 -z-10">
          <Image
            src="/background.jpg"
            alt="Weather background"
            fill
            priority
            quality={85}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="fixed inset-0 -z-10 bg-white/60 dark:bg-gray-950/60" aria-hidden="true" />
        <Header />
        <main className="container mx-auto px-4 py-6 flex-1">
          <KlimatologiContent />
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
