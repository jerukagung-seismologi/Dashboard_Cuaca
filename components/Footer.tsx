"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react"

function NavigationLinks() {
  return (
    <ul className="space-y-2">
      <li>
        <Link href="/" className="text-sm hover:underline underline-offset-4">
          Beranda
        </Link>
      </li>
      <li>
        <Link href="/doc" className="text-sm hover:underline underline-offset-4">
          Dokumentasi
        </Link>
      </li>
      <li>
        <Link href="/api" className="text-sm hover:underline underline-offset-4">
          Layanan API
        </Link>
      </li>
    </ul>
  )
}

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted/40 text-muted-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom 1: Identitas */}
          <div>
            <div className="flex items-center mb-4">
              <div className="relative w-10 h-10 mr-2">
                {/* Perbaikan path: /pubic biasanya typo, seharusnya langsung dari root untuk folder public */}
                <Image src="/favicon.ico" alt="Jerukagung Meteorologi Logo" fill className="object-contain" />
              </div>
              <span className="text-lg font-semibold text-foreground">Jerukagung Seismologi</span>
            </div>
            <p className="text-sm mb-4 max-w-xs">
              Departemen Penelitian Sains Atmosfer. Menyediakan data cuaca akurat untuk wilayah Kebumen dan sekitarnya.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-background hover:bg-accent p-2 rounded-full border transition-colors">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://x.com/jeris2518" className="bg-background hover:bg-accent p-2 rounded-full border transition-colors">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://www.instagram.com/jeris_meteorologi/" className="bg-background hover:bg-accent p-2 rounded-full border transition-colors">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="bg-background hover:bg-accent p-2 rounded-full border transition-colors">
                <Youtube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-foreground">Navigasi</h3>
            <NavigationLinks />
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-foreground">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0" />
                <span className="text-sm">Jerukagung, Klirong, Kebumen, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <span className="text-sm">+62 882 2541 8750</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0" />
                <a href="mailto:jerukagunglabs@gmail.com" className="text-sm hover:text-foreground transition-colors">
                  jerukagunglabs@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Jerukagung Seismologi. All Rights Reserved.</p>
        </div>
      </div>
      
      {/* Warming Stripes - Full Width */}
      <a href="https://showyourstripes.info/" target="_blank" rel="noopener noreferrer" className="block w-full h-8 relative transition-all duration-500">
        <Image
          src="https://showyourstripes.info/stripes/ASIA-Indonesia-Yogyakarta-1866-2024-BK.png"
          alt="Global warming stripes"
          fill
          className="object-cover"
        />
      </a>
    </footer>
  )
}