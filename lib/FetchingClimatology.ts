/**
 * FetchingClimatology.ts
 * Mengambil data klimatologi historis dari Open-Meteo Historical Weather API
 * untuk membangun profil iklim Walter-Lieth Climograph (normal 30 tahun),
 * runtun waktu bulanan untuk indeks kekeringan SPI, dan catatan harian untuk ETCCDI.
 */

export interface MonthlyNormal {
  month: number;
  monthName: string;
  fullName: string;
  tempMean: number;
  tempMinMean: number;
  tempMaxMean: number;
  precipMean: number;
  rainDaysMean: number;
}

export interface AnnualNormal {
  tempMean: number;
  precipMean: number;
  wettestMonth: { name: string; rain: number };
  driestMonth: { name: string; rain: number };
}

export interface DailyClimateRecord {
  dateStr: string;
  tMax?: number;
  tMin?: number;
  tMean?: number;
  precipitation: number;
}

export interface MonthlySeriesRecord {
  dateStr: string;
  rainSum: number;
}

export interface ClimateNormals {
  latitude: number;
  longitude: number;
  elevation: number;
  stationName: string;
  monthly: MonthlyNormal[];
  annual: AnnualNormal;
  dailyRecords: DailyClimateRecord[];
  monthlySeries: MonthlySeriesRecord[];
}

const MONTH_NAMES_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const MONTH_NAMES_FULL = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

/**
 * Mengambil data historis harian dari Open-Meteo untuk rentang tahun tertentu,
 * lalu menghitung rata-rata bulanan (normal) sebagai profil iklim,
 * serta menyusun runtun waktu harian dan bulanan.
 */
export async function fetchClimateNormals(
  lat: number = -7.7366,
  lon: number = 109.6461,
  startYear: number = 1991,
  endYear: number = 2020
): Promise<ClimateNormals> {
  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("start_date", `${startYear}-01-01`);
  url.searchParams.set("end_date", `${endYear}-12-31`);
  url.searchParams.set("daily", [
    "temperature_2m_mean",
    "temperature_2m_min",
    "temperature_2m_max",
    "precipitation_sum",
  ].join(","));
  url.searchParams.set("timezone", "Asia/Jakarta");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo Archive error: ${res.status}`);
  const data = await res.json();
  const { daily, elevation } = data;

  const monthlyAccum: {
    tempSum: number; tempMinSum: number; tempMaxSum: number;
    precipSum: number; rainDaysSum: number;
    yearCount: Set<number>; dayCount: number;
  }[] = Array.from({ length: 12 }, () => ({
    tempSum: 0, tempMinSum: 0, tempMaxSum: 0,
    precipSum: 0, rainDaysSum: 0,
    yearCount: new Set<number>(), dayCount: 0,
  }));

  const dates: string[] = daily.time || [];
  const tempMeans: number[] = daily.temperature_2m_mean || [];
  const tempMins: number[] = daily.temperature_2m_min || [];
  const tempMaxs: number[] = daily.temperature_2m_max || [];
  const precips: number[] = daily.precipitation_sum || [];

  const monthlyMap: Record<string, number> = {};
  const dailyRecords: DailyClimateRecord[] = [];

  for (let i = 0; i < dates.length; i++) {
    const dStr = dates[i];
    const d = new Date(dStr);
    const month = d.getMonth();
    const year = d.getFullYear();
    const accum = monthlyAccum[month];
    accum.yearCount.add(year);
    accum.dayCount++;

    const tMean = tempMeans[i] != null ? tempMeans[i] : undefined;
    const tMin = tempMins[i] != null ? tempMins[i] : undefined;
    const tMax = tempMaxs[i] != null ? tempMaxs[i] : undefined;
    const pVal = precips[i] != null ? precips[i] : 0;

    if (tMean != null) accum.tempSum += tMean;
    if (tMin != null)  accum.tempMinSum += tMin;
    if (tMax != null)  accum.tempMaxSum += tMax;
    accum.precipSum += pVal;
    if (pVal >= 0.1) accum.rainDaysSum++;

    // Akumulasi bulanan untuk SPI
    const monthKey = dStr.substring(0, 7); // "YYYY-MM"
    monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + pVal;

    // Catatan harian untuk ETCCDI
    dailyRecords.push({
      dateStr: dStr,
      tMax,
      tMin,
      tMean,
      precipitation: pVal,
    });
  }

  const monthly: MonthlyNormal[] = monthlyAccum.map((accum, idx) => {
    const years = accum.yearCount.size || 1;
    const days  = accum.dayCount || 1;
    return {
      month: idx + 1,
      monthName: MONTH_NAMES_SHORT[idx],
      fullName:  MONTH_NAMES_FULL[idx],
      tempMean:    parseFloat((accum.tempSum    / days).toFixed(1)),
      tempMinMean: parseFloat((accum.tempMinSum / days).toFixed(1)),
      tempMaxMean: parseFloat((accum.tempMaxSum / days).toFixed(1)),
      precipMean:  parseFloat((accum.precipSum  / years).toFixed(1)),
      rainDaysMean:parseFloat((accum.rainDaysSum / years).toFixed(1)),
    };
  });

  const annualTempMean   = parseFloat((monthly.reduce((s,m)=>s+m.tempMean,0)/12).toFixed(1));
  const annualPrecipMean = parseFloat(monthly.reduce((s,m)=>s+m.precipMean,0).toFixed(0));
  const wettestMonth = monthly.reduce((a,b)=>b.precipMean>a.precipMean?b:a);
  const driestMonth  = monthly.reduce((a,b)=>b.precipMean<a.precipMean?b:a);

  const monthlySeries: MonthlySeriesRecord[] = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateStr, rainSum]) => ({
      dateStr,
      rainSum: parseFloat(rainSum.toFixed(1)),
    }));

  return {
    latitude: lat,
    longitude: lon,
    elevation: elevation ?? 0,
    stationName: "Jerukagung, Kebumen",
    monthly,
    annual: {
      tempMean: annualTempMean,
      precipMean: annualPrecipMean,
      wettestMonth: { name: wettestMonth.fullName, rain: wettestMonth.precipMean },
      driestMonth:  { name: driestMonth.fullName,  rain: driestMonth.precipMean  },
    },
    dailyRecords,
    monthlySeries,
  };
}
