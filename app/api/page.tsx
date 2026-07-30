"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Terminal, Globe, Lock } from "lucide-react";

export default function ApiServicePage() {
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
                <Code2 className="h-6 w-6 text-blue-500" />
                Layanan API Meteorologi
              </h2>
              <p className="text-muted-foreground text-sm">
                Akses API telemetry dan data observasi cuaca Jerukagung
              </p>
            </div>
            <Badge variant="outline" className="self-start sm:self-auto text-xs bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              RESTful API v1
            </Badge>
          </div>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Terminal className="h-6 w-6 text-emerald-500" />
              <h3 className="text-lg font-semibold">Endpoint Telemetry Publik</h3>
            </div>
            <div className="bg-gray-950 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto space-y-2">
              <p className="text-emerald-400"># Fetch data cuaca real-time Jerukagung</p>
              <p>GET https://cuaca.jerukagunglabs.web.id/api/v1/meteo/current</p>
              <p className="text-emerald-400 mt-2"># Fetch data histori curah hujan</p>
              <p>GET https://cuaca.jerukagunglabs.web.id/api/v1/meteo/rainfall?days=7</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Format Output</p>
                  <p className="text-xs text-muted-foreground">Seluruh data disajikan dalam standar format JSON berserta stempel waktu WIB (UTC+7).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Batas Kuota (Rate Limit)</p>
                  <p className="text-xs text-muted-foreground">Endpoint publik dibatasi 60 request per menit untuk menjaga kestabilan server.</p>
                </div>
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
