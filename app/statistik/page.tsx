"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, Thermometer, Droplets, Wind, Sun, ShieldCheck } from "lucide-react";

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
        <div
          className="fixed inset-0 -z-10 bg-white/60 dark:bg-gray-950/60"
          aria-hidden="true"
        />

        {/* Header */}
        <Header />

        {/* Konten Utama */}
        <main className="container mx-auto px-4 py-6 flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <BarChart2 className="h-6 w-6 text-blue-500" />
                Statistik & Histori Cuaca
              </h2>
              <p className="text-muted-foreground text-sm">
                Ringkasan statistik parameter iklim dan data cuaca berkala • Jerukagung, Kebumen
              </p>
            </div>
            <Badge variant="outline" className="self-start sm:self-auto text-xs bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              Jerukagung Seismologi & Meteorologi
            </Badge>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Suhu Rata-Rata Bulanan</CardTitle>
                <Thermometer className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">27.4 °C</div>
                <p className="text-xs text-muted-foreground mt-1">Kisaran harian 23.0°C – 32.5°C</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Kelembapan Rata-Rata</CardTitle>
                <Droplets className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84%</div>
                <p className="text-xs text-muted-foreground mt-1">Kelembapan relatif tinggi</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rata-Rata Angin</CardTitle>
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

          {/* Overview Info */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Pusat Data Meteorologi Jerukagung</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Data statistik di atas dihimpun dari rekaman stasiun observasi sains atmosfer Jerukagung Seismologi yang dipadukan dengan pemodelan reanalisis iklim Open-Meteo dan BMKG Indonesia.
                </p>
              </div>
            </div>
          </Card>
        </main>

        {/* Footer */}
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
