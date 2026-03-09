"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeZone = 'Asia/Jakarta';

  // Format waktu
  const formattedTime = currentDateTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timeZone
  });

  // Format tanggal
  const formattedDate = currentDateTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: timeZone
  });

  if (!isMounted) {
    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
                {/* Placeholder to prevent layout shift */}
            </div>
        </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
        {/* Logo dan Judul */}
        <Link href="/" className="flex items-center gap-3 mr-4">
          <Image
            src="/favicon.ico"
            alt="Logo Jerukagung Meteorologi"
            width={60}
            height={60}
            className="rounded-md"
          />
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Jerukagung Meteorologi
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          {/* Waktu dan Tanggal */}
          <div className="text-right hidden sm:block">
            <p className="text-xl font-semibold font-mono text-gray-800 dark:text-gray-100">
              {formattedTime}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </p>
          </div>

          {/* Tombol Ganti Tema */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Ganti tema"
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Ganti Tema</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
