"use client"

import Image from "next/image"
import { ThemeProvider } from "@/components/ThemeProvider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WeatherDashboard from "@/components/WeatherDashboard"
import { Toaster } from "@/components/ui/toaster"
import AstronomicalData from "@/components/AstronomicalData"

export default function HomePage() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="weather-theme-preference">
      {/* Wrapper utama dengan wallpaper statis */}
      <div className="relative flex min-h-screen flex-col">

        {/* Wallpaper Background menggunakan Next/Image */}
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

        {/* Overlay semi-transparan agar konten tetap terbaca */}
        {/* Light mode: overlay putih lembut | Dark mode: overlay gelap lebih pekat */}
        <div
          className="fixed inset-0 -z-10 bg-white/60 dark:bg-gray-950/60"
          aria-hidden="true"
        />

        {/* Header */}
        <Header />

        {/* Konten Utama */}
        <main className="container mx-auto px-4 py-6 flex-1">
          <WeatherDashboard />
          <AstronomicalData className="mt-6" />
        </main>

        {/* Footer */}
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
