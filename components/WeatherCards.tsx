"use client"

import { 
  Thermometer, Droplets, Gauge, Sprout, Battery, 
  CloudRain, Wind, Umbrella, Sun, ArrowUp, ArrowDown, Minus 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import WindCompass from "@/components/WindCompass"
import RainMeasuringCup from "@/components/RainMeasuringCup"
import type { WeatherData } from "@/lib/FetchingSensorData"

// --- HELPER: RENDER TREND (ANGKA + IKON) ---
// Update: Menambahkan parameter 'decimals' untuk mengatur ketelitian
const renderTrend = (current: number, previous: number, unit: string = "", decimals: number = 1) => {
  const diff = current - previous
  const absDiff = Math.abs(diff)


  if (absDiff < 0.01) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground text-xs font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
        <Minus className="h-3 w-3" />
        <span>0.{'0'.repeat(decimals)}</span>
      </div>
    )
  }

  const isUp = diff > 0
  const colorClass = isUp ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
  const Icon = isUp ? ArrowUp : ArrowDown
  const sign = isUp ? "+" : "-"

  return (
    <div className={cn("flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full", colorClass)}>
      <Icon className="h-3 w-3" />
      <span>{sign}{absDiff.toFixed(decimals)}{unit}</span>
    </div>
  )
}

// --- Helper Functions Lainnya ---
const getSunlightCategory = (intensity: number) => {
  if (intensity < 1000) return "Rendah"
  if (intensity < 20000) return "Sedang"
  if (intensity < 50000) return "Tinggi"
  return "Sangat Tinggi"
}

const getHourlyRainfallCategory = (amount: number) => {
  if (amount === 0) return "Tidak Ada"
  if (amount < 0.5) return "Ringan"
  if (amount < 4) return "Sedang"
  if (amount < 8) return "Lebat"
  return "Sangat Lebat"
}

const getDailyRainfallCategory = (amount: number) => {
  if (amount === 0) return "Tidak Hujan"
  if (amount <= 20) return "Hujan Ringan"
  if (amount <= 50) return "Hujan Sedang"
  if (amount <= 100) return "Hujan Lebat"
  return "Hujan Sangat Lebat"
}

const getWindDescription = (speed: number) => {
  if (speed < 1) return "Tenang"
  if (speed < 6) return "Sepoi Ringan"
  if (speed < 12) return "Sepoi Lemah"
  if (speed < 20) return "Sepoi Lembut"
  if (speed < 29) return "Sepoi Sedang"
  if (speed < 39) return "Sepoi Segar"
  if (speed < 50) return "Sepoi Kuat"
  if (speed < 62) return "Angin Kencang"
  if (speed < 75) return "Badai"
  if (speed < 89) return "Badai Kuat"
  if (speed < 103) return "Topan"
  if (speed < 118) return "Topan Kuat"
  return "Hurikan"
}

// --- MAIN COMPONENT ---

interface WeatherCardsProps {
  data: WeatherData
  isMobile: boolean
}

export default function WeatherCards({ data, isMobile }: WeatherCardsProps) {
  // 1. Get Latest Data
  const len = data.timestamps.length
  const latestIndex = len - 1
  
  if (latestIndex < 0) return <div className="p-4 text-center text-muted-foreground">Menunggu data sensor...</div>

  const temperature = data.temperatures[latestIndex] || 0
  const humidity = data.humidity[latestIndex] || 0
  const pressure = data.pressure[latestIndex] || 0
  const dew = data.dew[latestIndex] || 0
  const volt = data.volt[latestIndex] || 0

  // 2. Get Previous Data
  const prevIndex = latestIndex > 0 ? latestIndex - 1 : latestIndex
  const prevTemperature = data.temperatures[prevIndex] ?? temperature
  const prevHumidity = data.humidity[prevIndex] ?? humidity
  const prevPressure = data.pressure[prevIndex] ?? pressure
  const prevDew = data.dew[prevIndex] ?? dew
  const prevVolt = data.volt[prevIndex] ?? volt

  // 3. Data Sensor Lainnya
  const currentRainfall = data.rainfall[latestIndex] || 0
  const currentRainRate = data.rainrate[latestIndex] || 0
  const sunlightIntensity = data.sunlight[latestIndex] || 0
  const windSpeed = data.windspeed[latestIndex] || 0
  const windDirection = data.windir[latestIndex] || 0

  const sunlightPercentage = Math.min(Math.round((sunlightIntensity / 120000) * 100), 100)

  // 4. Config Basic Cards (PERBAIKAN DI SINI)
  const basicCards = [
    {
      title: "Suhu",
      // PERBAIKAN: Ketelitian 2 angka desimal (0.01)
      value: `${temperature.toFixed(1)}°C`, 
      icon: Thermometer,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
      borderColor: "border-rose-200 dark:border-rose-800",
      description: "Suhu udara saat ini",
      // PERBAIKAN: Pass '2' untuk decimals
      trendComponent: renderTrend(temperature, prevTemperature, "°", 2),
    },
    {
      title: "Kelembapan",
      value: `${humidity.toFixed(1)}%`,
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      description: "Kelembapan relatif",
      trendComponent: renderTrend(humidity, prevHumidity, "%", 2),
    },
    {
      title: "Tekanan",
      value: `${pressure.toFixed(1)} hPa`,
      icon: Gauge,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      description: "Tekanan atmosfer",
      trendComponent: renderTrend(pressure, prevPressure, "", 2),
    },
    {
      title: "Titik Embun",
      // PERBAIKAN: Titik Embun (Dew Point) juga variabel suhu, jadi samakan 2 desimal
      value: `${dew.toFixed(1)}°C`,
      icon: Sprout,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      description: "Suhu titik embun",
      trendComponent: renderTrend(dew, prevDew, "°", 2),
    },
    {
      title: "Baterai",
      value: `${volt.toFixed(2)}V`,
      icon: Battery,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      description: "Tegangan baterai sensor",
      trendComponent: renderTrend(volt, prevVolt, "V", 2),
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      
      {/* LEVEL 1: BASIC METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {basicCards.map((card, index) => (
          <Card key={index} className={cn("overflow-hidden border-2 shadow-md hover:shadow-lg transition-shadow duration-300", card.borderColor)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                  <h3 className="text-2xl font-bold">{card.value}</h3>
                </div>
                <div className={cn("p-2 rounded-full", card.bgColor)}>
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                 {card.trendComponent}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* LEVEL 2: ADVANCED METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* WIND CARD */}
        <Card className="border-2 border-sky-200 dark:border-sky-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Angin</span>
              <div className="p-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20"><Wind className="h-5 w-5 text-sky-500" /></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex justify-between items-center w-full mb-2">
                <div><span className="text-3xl font-bold">{windSpeed.toFixed(1)}</span><span className="text-lg ml-1">km/j</span></div>
                <Badge variant="secondary" className="bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">{getWindDescription(windSpeed)}</Badge>
              </div>
              <WindCompass direction={windDirection} speed={windSpeed} size={isMobile ? "sm" : "md"} className="my-2" />
              <div className="w-full mt-2">
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-300 via-sky-500 to-sky-700 rounded-full" style={{ width: `${Math.min((windSpeed / 50) * 100, 100)}%`, transition: "width 1s ease-in-out" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Tenang</span><span>Sedang</span><span>Kuat</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RAIN RATE */}
        <Card className="border-2 border-cyan-200 dark:border-cyan-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Hujan Per Jam</span>
              <div className="p-2 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20"><CloudRain className="h-5 w-5 text-cyan-500" /></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-end justify-center gap-2 mb-2">
                <span className="text-4xl font-bold">{currentRainRate.toFixed(2)}</span><span className="text-lg text-muted-foreground pb-1">mm/h</span>
              </div>
              <Badge variant="outline" className="mb-2 border-cyan-200 text-cyan-700 dark:border-cyan-800 dark:text-cyan-300">{getHourlyRainfallCategory(currentRainRate)}</Badge>
              <RainMeasuringCup value={currentRainRate} maxValue={25} />
              <p className="text-xs text-muted-foreground mt-2">Intensitas curah hujan saat ini.</p>
            </div>
          </CardContent>
        </Card>

        {/* DAILY RAINFALL */}
        <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Curah Hujan Harian</span>
              <div className="p-2 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20"><Umbrella className="h-5 w-5 text-indigo-500" /></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-end justify-center gap-2 mb-2">
                <span className="text-4xl font-bold">{currentRainfall.toFixed(2)}</span><span className="text-lg text-muted-foreground pb-1">mm</span>
              </div>
              <Badge variant="outline" className="mb-2 border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300">{getDailyRainfallCategory(currentRainfall)}</Badge>
              <RainMeasuringCup value={currentRainfall} maxValue={150} />
              <p className="text-xs text-muted-foreground mt-2">{currentRainfall === 0 ? "Tidak ada hujan tercatat hari ini." : "Total akumulasi sejak jam 00:00."}</p>
            </div>
          </CardContent>
        </Card>

        {/* SUNLIGHT */}
        <Card className="border-2 border-yellow-200 dark:border-yellow-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Intensitas Cahaya</span>
              <div className="p-2 rounded-full bg-yellow-500/10 dark:bg-yellow-500/20"><Sun className="h-5 w-5 text-yellow-500" /></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-end justify-between">
                <div><span className="text-3xl font-bold">{sunlightIntensity.toLocaleString()}</span><span className="text-lg ml-1">lux</span></div>
                <Badge variant="outline" className="mt-2 border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300">{getSunlightCategory(sunlightIntensity)}</Badge>
              </div>
              <div className="space-y-2">
                <Progress value={sunlightPercentage} className="h-2 bg-gray-200 dark:bg-gray-700">
                  <div className="h-full bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 rounded-full" style={{ width: `${sunlightPercentage}%` }} />
                </Progress>
                <div className="flex justify-between text-xs text-muted-foreground"><span>Rendah</span><span>Sedang</span><span>Tinggi</span></div>
                <p className="text-xs text-muted-foreground mt-1">Diukur dalam lux. Cahaya siang hari biasanya berkisar dari 10.000 hingga 25.000 lux.</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}