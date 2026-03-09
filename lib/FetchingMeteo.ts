/**
 * FetchingMeteo.ts
 * Library untuk mengambil data cuaca dari Open-Meteo API (https://open-meteo.com)
 * Dokumentasi API: https://open-meteo.com/en/docs
 */

// ─── Tipe Data ───────────────────────────────────────────────────────────────

/** Koordinat lokasi */
export interface MeteoLocation {
  latitude: number;
  longitude: number;
  timezone?: string; // Default: "Asia/Jakarta"
}

/** Data cuaca saat ini (current weather) */
export interface MeteoCurrentData {
  time: string;
  temperature_2m: number;             // Suhu udara 2m (°C)
  relative_humidity_2m: number;       // Kelembapan relatif (%)
  apparent_temperature: number;       // Suhu terasa (°C)
  is_day: number;                     // 1 = siang, 0 = malam
  precipitation: number;              // Curah hujan (mm)
  rain: number;                       // Hujan (mm)
  showers: number;                    // Hujan lebat sesaat (mm)
  snowfall: number;                   // Salju (cm)
  weather_code: number;               // Kode cuaca WMO
  cloud_cover: number;                // Tutupan awan (%)
  pressure_msl: number;               // Tekanan permukaan laut (hPa)
  surface_pressure: number;           // Tekanan permukaan (hPa)
  wind_speed_10m: number;             // Kecepatan angin 10m (km/j)
  wind_direction_10m: number;         // Arah angin 10m (°)
  wind_gusts_10m: number;             // Hembusan angin 10m (km/j)
}

/** Data cuaca per jam (hourly) */
export interface MeteoHourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  rain: number[];
  showers: number[];
  snowfall: number[];
  weather_code: number[];
  cloud_cover: number[];
  visibility: number[];               // Visibilitas (m)
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  uv_index: number[];
  is_day: number[];
}

/** Data cuaca harian (daily) */
export interface MeteoDailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];       // Suhu maks (°C)
  temperature_2m_min: number[];       // Suhu min (°C)
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];                  // Waktu matahari terbit (ISO)
  sunset: string[];                   // Waktu matahari terbenam (ISO)
  daylight_duration: number[];        // Durasi siang (detik)
  sunshine_duration: number[];        // Durasi sinar matahari (detik)
  uv_index_max: number[];
  precipitation_sum: number[];        // Total curah hujan (mm)
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];      // Jumlah jam hujan
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

/** Respons lengkap dari Open-Meteo API */
export interface MeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: Record<string, string>;
  current?: MeteoCurrentData;
  hourly_units?: Record<string, string>;
  hourly?: MeteoHourlyData;
  daily_units?: Record<string, string>;
  daily?: MeteoDailyData;
}

/** Opsi untuk memilih data yang ingin diambil */
export interface MeteoFetchOptions {
  current?: boolean;  // Ambil data saat ini
  hourly?: boolean;   // Ambil data per jam
  daily?: boolean;    // Ambil data harian
  forecastDays?: number; // Jumlah hari prakiraan (1-16, default: 7)
  pastDays?: number;     // Jumlah hari historis (0-92, default: 0)
}

// ─── Konstanta ───────────────────────────────────────────────────────────────

/** Base URL Open-Meteo API */
const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Koordinat default: Jerukagung, Klirong, Kebumen, Jawa Tengah
 * Sumber: Google Maps / OpenStreetMap
 */
export const JERUKAGUNG_LOCATION: MeteoLocation = {
  latitude: -7.6936,
  longitude: 109.6034,
  timezone: "Asia/Jakarta",
};

/** Semua variabel current yang tersedia */
const CURRENT_VARIABLES = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "is_day",
  "precipitation",
  "rain",
  "showers",
  "snowfall",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "surface_pressure",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
].join(",");

/** Semua variabel hourly yang tersedia */
const HOURLY_VARIABLES = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "precipitation_probability",
  "precipitation",
  "rain",
  "showers",
  "snowfall",
  "weather_code",
  "cloud_cover",
  "visibility",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "uv_index",
  "is_day",
].join(",");

/** Semua variabel daily yang tersedia */
const DAILY_VARIABLES = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "sunrise",
  "sunset",
  "daylight_duration",
  "sunshine_duration",
  "uv_index_max",
  "precipitation_sum",
  "rain_sum",
  "showers_sum",
  "snowfall_sum",
  "precipitation_hours",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "wind_gusts_10m_max",
  "wind_direction_10m_dominant",
].join(",");

// ─── Tabel Kode Cuaca WMO ────────────────────────────────────────────────────

/** Deskripsi kode cuaca WMO dalam Bahasa Indonesia */
export const WMO_WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0:  { description: "Cerah",                        icon: "☀️"  },
  1:  { description: "Sebagian Cerah",               icon: "🌤️" },
  2:  { description: "Sebagian Berawan",             icon: "⛅"  },
  3:  { description: "Berawan",                      icon: "☁️"  },
  45: { description: "Berkabut",                     icon: "🌫️" },
  48: { description: "Kabut Beku",                   icon: "🌫️" },
  51: { description: "Gerimis Ringan",               icon: "🌦️" },
  53: { description: "Gerimis Sedang",               icon: "🌦️" },
  55: { description: "Gerimis Lebat",                icon: "🌧️" },
  61: { description: "Hujan Ringan",                 icon: "🌧️" },
  63: { description: "Hujan Sedang",                 icon: "🌧️" },
  65: { description: "Hujan Lebat",                  icon: "🌧️" },
  71: { description: "Salju Ringan",                 icon: "🌨️" },
  73: { description: "Salju Sedang",                 icon: "🌨️" },
  75: { description: "Salju Lebat",                  icon: "❄️"  },
  77: { description: "Butiran Salju",                icon: "🌨️" },
  80: { description: "Hujan Lokal Ringan",           icon: "🌦️" },
  81: { description: "Hujan Lokal Sedang",           icon: "🌧️" },
  82: { description: "Hujan Lokal Lebat",            icon: "⛈️"  },
  85: { description: "Hujan Salju Ringan",           icon: "🌨️" },
  86: { description: "Hujan Salju Lebat",            icon: "❄️"  },
  95: { description: "Badai Petir",                  icon: "⛈️"  },
  96: { description: "Badai Petir + Hujan Es Ringan",icon: "⛈️"  },
  99: { description: "Badai Petir + Hujan Es Lebat", icon: "⛈️"  },
};

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Mendapatkan deskripsi dan ikon kode cuaca WMO.
 * @param code - Kode cuaca WMO
 */
export function getWeatherInfo(code: number): { description: string; icon: string } {
  return WMO_WEATHER_CODES[code] ?? { description: "Tidak Diketahui", icon: "❓" };
}

/**
 * Mengkonversi detik menjadi format jam:menit.
 * @param seconds - Durasi dalam detik
 */
export function secondsToHourMinute(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}j ${m}m`;
}

/**
 * Memfilter data hourly untuk jam-jam tertentu saja.
 * @param hourly - Data hourly lengkap
 * @param hours  - Array jam yang ingin diambil (0-23)
 */
export function filterHourlyByHours(
  hourly: MeteoHourlyData,
  hours: number[]
): MeteoHourlyData {
  const indices = hourly.time.reduce<number[]>((acc, t, i) => {
    const hour = new Date(t).getHours();
    if (hours.includes(hour)) acc.push(i);
    return acc;
  }, []);

  return {
    time:                        indices.map(i => hourly.time[i]),
    temperature_2m:              indices.map(i => hourly.temperature_2m[i]),
    relative_humidity_2m:        indices.map(i => hourly.relative_humidity_2m[i]),
    apparent_temperature:        indices.map(i => hourly.apparent_temperature[i]),
    precipitation_probability:   indices.map(i => hourly.precipitation_probability[i]),
    precipitation:               indices.map(i => hourly.precipitation[i]),
    rain:                        indices.map(i => hourly.rain[i]),
    showers:                     indices.map(i => hourly.showers[i]),
    snowfall:                    indices.map(i => hourly.snowfall[i]),
    weather_code:                indices.map(i => hourly.weather_code[i]),
    cloud_cover:                 indices.map(i => hourly.cloud_cover[i]),
    visibility:                  indices.map(i => hourly.visibility[i]),
    wind_speed_10m:              indices.map(i => hourly.wind_speed_10m[i]),
    wind_direction_10m:          indices.map(i => hourly.wind_direction_10m[i]),
    wind_gusts_10m:              indices.map(i => hourly.wind_gusts_10m[i]),
    uv_index:                    indices.map(i => hourly.uv_index[i]),
    is_day:                      indices.map(i => hourly.is_day[i]),
  };
}

// ─── Fungsi Utama Fetch ──────────────────────────────────────────────────────

/**
 * Mengambil data cuaca lengkap dari Open-Meteo API.
 * @param location - Koordinat lokasi (default: Jerukagung)
 * @param options  - Pilihan data yang ingin diambil
 */
export async function fetchMeteoData(
  location: MeteoLocation = JERUKAGUNG_LOCATION,
  options: MeteoFetchOptions = { current: true, hourly: true, daily: true }
): Promise<MeteoResponse> {
  const params = new URLSearchParams({
    latitude:  String(location.latitude),
    longitude: String(location.longitude),
    timezone:  location.timezone ?? "Asia/Jakarta",
    wind_speed_unit: "kmh",
  });

  if (options.forecastDays != null) params.set("forecast_days", String(options.forecastDays));
  if (options.pastDays     != null) params.set("past_days",     String(options.pastDays));
  if (options.current)  params.set("current",  CURRENT_VARIABLES);
  if (options.hourly)   params.set("hourly",   HOURLY_VARIABLES);
  if (options.daily)    params.set("daily",    DAILY_VARIABLES);

  const url = `${OPEN_METEO_BASE_URL}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
  }

  const data: MeteoResponse = await response.json();
  return data;
}

/**
 * Mengambil hanya data cuaca saat ini (current weather).
 * @param location - Koordinat lokasi (default: Jerukagung)
 */
export async function fetchCurrentWeather(
  location: MeteoLocation = JERUKAGUNG_LOCATION
): Promise<MeteoCurrentData | null> {
  const data = await fetchMeteoData(location, { current: true });
  return data.current ?? null;
}

/**
 * Mengambil hanya data cuaca harian (daily forecast).
 * @param location     - Koordinat lokasi (default: Jerukagung)
 * @param forecastDays - Jumlah hari prakiraan (default: 7, maks: 16)
 */
export async function fetchDailyForecast(
  location: MeteoLocation = JERUKAGUNG_LOCATION,
  forecastDays: number = 7
): Promise<MeteoDailyData | null> {
  const data = await fetchMeteoData(location, { daily: true, forecastDays });
  return data.daily ?? null;
}

/**
 * Mengambil hanya data cuaca per jam (hourly forecast).
 * @param location     - Koordinat lokasi (default: Jerukagung)
 * @param forecastDays - Jumlah hari prakiraan (default: 3)
 */
export async function fetchHourlyForecast(
  location: MeteoLocation = JERUKAGUNG_LOCATION,
  forecastDays: number = 3
): Promise<MeteoHourlyData | null> {
  const data = await fetchMeteoData(location, { hourly: true, forecastDays });
  return data.hourly ?? null;
}