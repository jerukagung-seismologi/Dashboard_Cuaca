import { Sun, CloudRain, CloudLightning, ThermometerSun, CloudDrizzle, CloudSun, CloudFog, Wind, Umbrella, Tent } from "lucide-react"

export type WeatherCondition = {
  condition: string
  description: string
  icon: any // Lucide icon component
  color: string // Tailwind color class
}

// Helper: Menghitung Heat Index (Suhu yang dirasakan tubuh)
// Rumus sederhana Rothfusz regression (valid untuk T > 27C & RH > 40%)
function calculateHeatIndex(t: number, rh: number): number {
  if (t < 27) return t; // Heat index tidak berlaku di suhu sejuk
  
  const c1 = -8.78469475556;
  const c2 = 1.61139411;
  const c3 = 2.33854883889;
  const c4 = -0.14611605;
  const c5 = -0.012308094;
  const c6 = -0.0164248277778;
  const c7 = 0.002211732;
  const c8 = 0.00072546;
  const c9 = -0.000003582;

  const hi = c1 + (c2 * t) + (c3 * rh) + (c4 * t * rh) + (c5 * t * t) + (c6 * rh * rh) + (c7 * t * t * rh) + (c8 * t * rh * rh) + (c9 * t * t * rh * rh);
  return hi;
}

export function interpretWeather(temperature: number, humidity: number, pressure: number, rainRate: number = 0): WeatherCondition {
  
  const heatIndex = calculateHeatIndex(temperature, humidity);

  // --- 1. KONDISI EKSTREM & BAHAYA ---

  // Hujan Badai / Ekstrem (Rain Rate > 20 mm/jam atau Tekanan Drop Drastis)
  if (rainRate > 20 || (pressure < 1007 && humidity > 90)) {
    return {
      condition: "Hujan Badai Ekstrem",
      description: "Waspada! Curah hujan sangat tinggi berpotensi banjir dan angin kencang.",
      icon: CloudLightning,
      color: "text-purple-700 dark:text-purple-400",
    }
  }

  // Heatstroke Danger (Heat Index > 40°C)
  if (heatIndex >= 40) {
    return {
      condition: "Panas Menyengat (Danger)",
      description: `Suhu terasa seperti ${heatIndex.toFixed(1)}°C. Resiko heatstroke tinggi. Hindari aktivitas luar ruangan.`,
      icon: ThermometerSun,
      color: "text-red-600 dark:text-red-500",
    }
  }

  // --- 2. KONDISI HUJAN (Mengutamakan Rain Rate jika ada) ---

  if (rainRate > 10) {
    return {
      condition: "Hujan Lebat",
      description: "Hujan deras mengguyur. Jarak pandang mungkin terbatas.",
      icon: CloudRain,
      color: "text-blue-700 dark:text-blue-400",
    }
  }

  if (rainRate > 0.5) { // Hujan Sedang
    return {
      condition: "Hujan Sedang",
      description: "Hujan turun dengan intensitas sedang. Siapkan payung/jas hujan.",
      icon: Umbrella,
      color: "text-blue-500 dark:text-blue-300",
    }
  }

  // Gerimis atau Kondisi Mau Hujan (Lembab Tinggi + Tekanan Rendah)
  if (rainRate > 0 || (humidity > 85 && pressure < 1008 && temperature < 28)) {
    return {
      condition: "Gerimis / Mendung Tebal",
      description: "Cuaca mendung gelap atau gerimis halus. Potensi hujan tinggi.",
      icon: CloudDrizzle,
      color: "text-cyan-600 dark:text-cyan-400",
    }
  }

  // --- 3. KONDISI UMUM TROPIS ---

  // Panas Terik (Suhu > 33 tapi kering)
  if (temperature >= 32 && humidity <= 70) {
    return {
      condition: "Panas Terik (Kering)",
      description: "Matahari bersinar sangat terik. Cuaca panas namun tidak terlalu lengket.",
      icon: Sun,
      color: "text-orange-500 dark:text-orange-400",
    }
  }

  // Gerah / Sumuk (Suhu > 29 + Lembab > 75%) -> Khas Indonesia
  if (temperature >= 29 && humidity >= 75) {
    return {
      condition: "Gerah (Sumuk)",
      description: `Udara terasa lengket dan panas (Heat Index: ${heatIndex.toFixed(1)}°C). Khas cuaca tropis sebelum hujan atau mendung.`,
      icon: ThermometerSun,
      color: "text-orange-600 dark:text-orange-300",
    }
  }

  // Cerah Berawan (Ideal Tropis)
  if (temperature >= 24 && temperature <= 32 && humidity <= 75) {
    return {
      condition: "Cerah Berawan",
      description: "Cuaca bersahabat. Hangat dengan angin sepoi-sepoi.",
      icon: CloudSun,
      color: "text-green-600 dark:text-green-400",
    }
  }

  // Sejuk / Dingin (Malam hari atau Dataran Tinggi)
  if (temperature <= 25) {
    return {
      condition: "Sejuk / Dingin",
      description: "Udara terasa segar dan sejuk. Nyaman untuk beristirahat.",
      icon: Wind,
      color: "text-teal-600 dark:text-teal-400",
    }
  }

  // Kabut (Pagi hari atau Pegunungan)
  if (humidity >= 95 && temperature <= 22) {
    return {
      condition: "Berkabut",
      description: "Kelembapan sangat tinggi menyebabkan kabut. Hati-hati berkendara.",
      icon: CloudFog,
      color: "text-slate-500 dark:text-slate-400",
    }
  }

  // Default
  return {
    condition: "Tropis Normal",
    description: "Cuaca tropis biasa. Tidak ada anomali signifikan.",
    icon: CloudSun,
    color: "text-green-500",
  }
}

// --- REKOMENDASI AKTIVITAS (LOKAL INDONESIA) ---
export function getActivityRecommendations(t: number, h: number, rain: number = 0): string[] {
  const recs: string[] = []
  const hi = calculateHeatIndex(t, h);

  // 1. Rekomendasi Jemuran (Paling Penting buat Emak-emak)
  if (rain === 0 && h < 70 && t > 28) {
    recs.push("☀️ Waktu terbaik menjemur pakaian! (Cepat kering)")
  } else if (rain > 0 || (h > 85 && t < 28)) {
    recs.push("🌧️ Angkat jemuran! Potensi hujan atau udara terlalu lembab.")
  }

  // 2. Olahraga / Aktivitas Fisik
  if (rain === 0 && t >= 22 && t <= 30 && hi < 35) {
    recs.push("🏃 Cuaca enak buat jogging atau sepedaan.")
  } else if (hi >= 35 && hi < 40) {
    recs.push("⚠️ Kalau mau olahraga, kurangi intensitas. Rawan dehidrasi.")
  } else if (hi >= 40) {
    recs.push("🚫 Jangan olahraga berat di luar. Bahaya heatstroke!")
  }

  // 3. Kenyamanan Rumah
  if (t > 29 || hi > 32) {
    recs.push("❄️ Nyalakan Kipas/AC agar tidak gerah.")
  } else if (t < 22) {
    recs.push("☕ Cocok buat ngopi/ngeteh hangat.")
  }

  // 4. Pertanian / Tanaman (Opsional)
  if (rain === 0 && t > 30) {
    recs.push("💧 Siram tanaman sore ini, penguapan tinggi.")
  } else if (rain > 20) {
    recs.push("🌱 Cek saluran air kebun, waspada genangan.")
  }

  // 5. Kesehatan
  if (h > 85 && t > 28) {
    recs.push("🦟 Waspada nyamuk DBD (Suhu lembab & hangat disukai nyamuk).")
  }

  return recs
}