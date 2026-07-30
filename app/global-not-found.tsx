// Import global styles and fonts
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import BackButton from '@/components/BackButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '404 - Halaman Tidak Ditemukan',
  description: 'Halaman yang Anda cari tidak ada atau telah dihapus.',
}

export default function GlobalNotFound() {
  return (
    <html lang="id" className={inter.className}>
      <body>
        <div className="relative flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">

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
          <div
            className="fixed inset-0 -z-10 bg-white/60 dark:bg-gray-950/60"
            aria-hidden="true"
          />

          {/* Header Sederhana */}
          <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="container flex h-20 max-w-screen-2xl items-center">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/favicon.ico"
                  alt="Logo Jerukagung Meteorologi"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  Jerukagung Meteorologi
                </h1>
              </Link>
            </div>
          </header>

          {/* Konten Utama — 404 Page */}
          <main className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
            <div className="w-full max-w-xl">
              <div className="text-center space-y-6">

                {/* Ilustrasi 404 */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="text-9xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500 bg-clip-text select-none">
                      404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl">🌩️</div>
                    </div>
                  </div>
                </div>

                {/* Judul & Deskripsi */}
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                    Halaman Tidak Ditemukan
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Maaf, halaman yang Anda cari tidak ada atau telah dihapus. 
                    Seperti cuaca yang tidak terduga, halaman ini hilang misterius.
                  </p>
                </div>

                {/* Card Info Tambahan */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Kemungkinan penyebab:</span>
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span>URL mungkin salah atau tidak lengkap</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span>Halaman telah dipindahkan atau dihapus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span>Anda mungkin tidak memiliki akses ke halaman ini</span>
                    </li>
                  </ul>
                </div>

                {/* Tombol Aksi */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Link href="/">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      <Home className="h-4 w-4" />
                      Kembali ke Beranda
                    </Button>
                  </Link>
                  <BackButton />
                </div>

              </div>
            </div>
          </main>

          {/* Footer Sederhana */}
          <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-6">
            <div className="container max-w-screen-2xl text-center text-sm text-gray-600 dark:text-gray-400">
              <p>© {new Date().getFullYear()} Jerukagung Meteorologi. Semua hak dilindungi.</p>
            </div>
          </footer>

        </div>
      </body>
    </html>
  )
}