"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Database, Server } from "lucide-react";

export default function DocumentationPage() {
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
                <BookOpen className="h-6 w-6 text-blue-500" />
                Dokumentasi Sistem & Sains Atmosfer
              </h2>
              <p className="text-muted-foreground text-sm">
                Panduan teknis dan metodologi observasi cuaca Jerukagung Seismologi
              </p>
            </div>
            <Badge variant="outline" className="self-start sm:self-auto text-xs bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              Dokumentasi v1.2.5
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Metodologi Pengukuran
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Pengukuran dilakukan menggunakan stasiun cuaca otomatis (AWS) terkalibrasi yang mencatat suhu, kelembapan, tekanan udara, serta arah & kecepatan angin secara real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Database className="h-5 w-5 text-green-500" />
                  Integrasi Sumber Data
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Dashboard mengintegrasikan telemetry sensor lokal via Firebase Realtime Database serta pemodelan cuaca dari Open-Meteo & BMKG Indonesia.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="h-5 w-5 text-purple-500" />
                  Keandalan & Skalabilitas
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Aplikasi dibangun berbasis Next.js App Router yang di-deploy dengan caching edge untuk memastikan waktu muat super cepat dan ketersediaan tinggi.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
