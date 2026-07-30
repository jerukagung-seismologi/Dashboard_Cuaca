"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BMKGNowcasting from "@/components/BMKGPrediction";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { CloudSun, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PrakiraanPage() {
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
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <CloudSun className="h-6 w-6 text-amber-500" />
                Prakiraan Cuaca
              </h2>
              <p className="text-muted-foreground text-sm">
                Prakiraan cuaca resmi BMKG & analisis sains atmosfer • Jerukagung, Kebumen
              </p>
            </div>
            <Badge variant="outline" className="self-start sm:self-auto text-xs bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              Sumber: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
            </Badge>
          </div>

          {/* Info Card */}
          <div className="flex items-start gap-3 p-4 bg-blue-50/80 dark:bg-blue-950/30 backdrop-blur-sm rounded-xl border border-blue-200 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-200 shadow-sm">
            <Info className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="font-semibold">Informasi Nowcasting</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                Data prakiraan cuaca jangka pendek (Nowcasting) diperbarui secara berkala langsung dari stasiun pengamatan BMKG untuk wilayah Kebumen dan sekitarnya.
              </p>
            </div>
          </div>

          {/* BMKG Nowcasting Section */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-md">
            <BMKGNowcasting limit={12} />
          </div>
        </main>

        {/* Footer */}
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}