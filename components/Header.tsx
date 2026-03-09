"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LayoutDashboard, CloudSun, Wind, Droplets, BarChart2, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Daftar menu navigasi
const navItems = [
  { label: "Dashboard",     href: "/",           icon: LayoutDashboard },
  { label: "Prakiraan",     href: "/prakiraan",  icon: CloudSun        },
  { label: "Angin",         href: "/angin",      icon: Wind            },
  { label: "Curah Hujan",   href: "/hujan",      icon: Droplets        },
  { label: "Statistik",     href: "/statistik",  icon: BarChart2       },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tutup mobile menu saat rute berubah
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const timeZone = "Asia/Jakarta";

  // Format waktu
  const formattedTime = currentDateTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  });

  // Format tanggal
  const formattedDate = currentDateTime.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  });

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between" />
        <nav className="h-10 border-t border-gray-200 dark:border-gray-800" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">

      {/* ── Baris Atas: Logo + Waktu + Tema ── */}
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

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Waktu dan Tanggal — hanya desktop */}
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

          {/* Tombol Hamburger — hanya mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* ── Baris Bawah: Navbar Desktop ── */}
      <nav
        className="hidden sm:block border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        aria-label="Navigasi utama"
      >
        <div className="container max-w-screen-2xl flex items-center gap-1 h-10">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Dropdown Menu Mobile ── */}
      {mobileMenuOpen && (
        <nav
          className="sm:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          aria-label="Navigasi mobile"
        >
          {/* Waktu dan Tanggal di mobile menu */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-lg font-semibold font-mono text-gray-800 dark:text-gray-100">
              {formattedTime}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </p>
          </div>

          {/* Menu Items */}
          <ul className="flex flex-col py-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

    </header>
  );
}
