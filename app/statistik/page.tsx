"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  ShieldCheck,
  Compass,
  CloudRain,
  LineChart,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { DiurnalCycleCard } from "@/components/graphics/DiurnalCycleCard";

function StatistikContent() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <main className="container mx-auto px-4 py-6 flex-1 space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-blue-500" />
            Statistik & Dinamika Cuaca
          </h2>
          <p className="text-muted-foreground text-sm">
            Ringkasan statistik parameter cuaca, pola diurnal 24 jam, dan analisis berkala • Jerukagung, Kebumen
          </p>
        </div>
        <Badge
          variant="outline"
          className="self-start sm:self-auto text-xs bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
        >
          Jerukagung Seismologi & Meteorologi
        </Badge>
      </div>

      {/* Grid 4 Kartu Parameter Utama (Karakter °C sudah rapi) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Suhu Rata-Rata Bulanan</CardTitle>
            <Thermometer className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27.4 °C</div>
            <p className="text-xs text-muted-foreground mt-1">Kisaran harian 23.0 °C – 32.5 °C</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kelembapan Rata-Rata</CardTitle>
            <Droplets className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground mt-1">Kelembapan relatif tropis pesisir</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rata-Rata Kecepatan Angin</CardTitle>
            <Wind className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2 km/j</div>
            <p className="text-xs text-muted-foreground mt-1">Arah dominan Tenggara (SE)</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Indeks UV Maksimum</CardTitle>
            <Sun className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9 (Sangat Tinggi)</div>
            <p className="text-xs text-muted-foreground mt-1">Puncak pukul 11:30 - 13:00 WIB</p>
          </CardContent>
        </Card>
      </div>

      {/* Siklus Diurnal 24 Jam (Fitur Porting Meteo-Sense) */}
      <DiurnalCycleCard isDarkMode={isDark} />

      {/* Modul Eksplorasi Analisis Lanjutan (Menyatukan Angin, Hujan, dan Klimatologi) */}
      <div>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Eksplorasi Analisis Detail & Histori
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Analisis Angin & Mawar Angin */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="p-2.5 w-fit rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mb-2">
                <Compass className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-semibold">Analisis Angin & Mawar Angin</CardTitle>
              <CardDescription className="text-xs">
                Mawar angin 16 arah mata angin, distribusi kelas kecepatan, dan hembusan angin harian.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/angin">
                <Button variant="outline" size="sm" className="w-full justify-between text-xs group">
                  Buka Analisis Angin
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 2: Analisis Curah Hujan */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="p-2.5 w-fit rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 mb-2">
                <CloudRain className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-semibold">Analisis Akumulasi Curah Hujan</CardTitle>
              <CardDescription className="text-xs">
                Akumulasi presipitasi harian, hyetograph jam-jaman, durasi hujan, dan klasifikasi intensitas.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/hujan">
                <Button variant="outline" size="sm" className="w-full justify-between text-xs group">
                  Buka Analisis Curah Hujan
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 3: Profil Normal Klimatologi */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="p-2.5 w-fit rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-2">
                <LineChart className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-semibold">Normal Iklim & Indeks Kekeringan</CardTitle>
              <CardDescription className="text-xs">
                Klimogram Walter-Lieth 1991–2020, indeks kekeringan SPI, dan indeks iklim ekstrem ETCCDI.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/klimatologi">
                <Button variant="outline" size="sm" className="w-full justify-between text-xs group">
                  Buka Portal Klimatologi
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Sumber Data & Validasi */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl shrink-0">
            <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Pusat Data Meteorologi & Seismologi Jerukagung</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Data statistik di atas dihimpun dari rekaman observasi stasiun sains atmosfer Jerukagung yang dipadukan dengan pemodelan reanalisis iklim Open-Meteo Archive dan observasi cuaca BMKG Indonesia.
            </p>
          </div>
        </div>
      </Card>
    </main>
  );
}

export default function StatistikPage() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="weather-theme-preference">
      <div className="relative flex min-h-screen flex-col">
        {/* Wallpaper Background */}
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
        <div className="fixed inset-0 -z-10 bg-white/60 dark:bg-gray-950/60" aria-hidden="true" />

        {/* Header (4 Menu Utama) */}
        <Header />

        {/* Konten Statistik */}
        <StatistikContent />

        {/* Footer */}
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
