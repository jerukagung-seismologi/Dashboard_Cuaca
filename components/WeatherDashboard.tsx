"use client";

import { useState, useEffect, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { Loader2, AlertTriangle, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fetchBMKGData, type BMKGOutputData } from "@/lib/FetchingBMKGPrediction";
import { findVillageByName } from "@/lib/kebumen-villages";

// --- Tipe dan Helper ---
type SelectedDay = "today" | "tomorrow" | "dayAfter";

const getDayIndex = (date: Date): number => {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((startOfDay.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
};

// Helper lainnya (formatNumber, normalizeDeg, degreesToCompass, WindDirectionIndicator) tetap sama
// Helper: safe number formatting
function formatNumber(value: unknown, opts?: { decimals?: number; fallback?: string }): string {
  const { decimals = 0, fallback = "—" } = opts || {};
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return n.toFixed(decimals);
}

// Compass helpers
function normalizeDeg(deg?: number): number | null {
  if (typeof deg !== "number" || !Number.isFinite(deg)) return null;
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function degreesToCompass(deg?: number): string {
  const d = normalizeDeg(deg);
  if (d == null) return "—";
  const dirs = ["U", "UTL", "TL", "TTL", "T", "TGR", "TG", "STG", "S", "SBD", "BD", "BBD", "B", "BLD", "BL", "UBL"];
  const idx = Math.round(d / 22.5) % 16;
  return dirs[idx];
}

// Wind direction indicator component
function WindDirectionIndicator({ deg }: { deg: number | null }) {
  const rotation = normalizeDeg(deg ?? undefined) ?? 0;
  return (
    <div className="relative h-4 w-4 shrink-0">
      <svg viewBox="0 0 24 24" className="absolute inset-0" aria-label="Arah angin">
        <g transform={`rotate(${rotation} 12 12)`}>
          <line x1="12" y1="12" x2="12" y2="3" className="stroke-current text-gray-700 dark:text-gray-300" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 2 L10 6 L14 6 Z" className="fill-current text-gray-700 dark:text-gray-300" />
        </g>
      </svg>
    </div>
  );
}


// --- Komponen utama Dashboard ---
export default function WeatherDashboard() {
  const [bmkgData, setBmkgData] = useState<BMKGOutputData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<SelectedDay>("today");
  
  const locationName = "Jerukagung"; // Bisa dibuat dinamis nanti
  const location = useMemo(() => findVillageByName(locationName), [locationName]);

  useEffect(() => {
    if (!location) {
      setError(`Lokasi "${locationName}" tidak ditemukan.`);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const bmkgResult = await fetchBMKGData(location.code);
        setBmkgData(bmkgResult);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const intervalId = setInterval(loadData, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [location, locationName]);

  const filteredForecasts = useMemo(() => {
    const dayIndexMap: Record<SelectedDay, number> = { today: 0, tomorrow: 1, dayAfter: 2 };
    const targetDayIndex = dayIndexMap[selectedDay];
    
    return bmkgData.filter(p => {
      if (!p.local_datetime) return false;
      const forecastDate = new Date(p.local_datetime);
      return getDayIndex(forecastDate) === targetDayIndex;
    });
  }, [bmkgData, selectedDay]);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-red-600 bg-red-50 p-4 rounded-lg"><AlertTriangle className="inline mr-2"/>{error}</div>;
  }

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-md">
      <CardHeader>
        {/* Layout: flex-col di mobile, flex-row di desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Kiri: Judul dan Tanggal Analisis */}
          <div>
            <CardTitle className="flex items-center gap-3 text-xl">
              <CalendarClock className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              <span>Prakiraan Cuaca BMKG - {location?.name || "N/A"}</span>
            </CardTitle>
            {bmkgData[0]?.analysis_date && (
              <p className="text-xs text-muted-foreground mt-1 ml-9">
                Analisis:{" "}
                {new Date(bmkgData[0].analysis_date).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WIB
              </p>
            )}
          </div>

          {/* Kanan (desktop) / Bawah judul (mobile): Selector Hari */}
          <ToggleGroup
            type="single"
            value={selectedDay}
            onValueChange={(value: SelectedDay) => value && setSelectedDay(value)}
            className="self-start sm:self-auto"
            aria-label="Pilih Hari Prakiraan"
          >
            <ToggleGroupItem value="today" className="text-xs sm:text-sm px-3">
              Hari Ini
            </ToggleGroupItem>
            <ToggleGroupItem value="tomorrow" className="text-xs sm:text-sm px-3">
              Besok
            </ToggleGroupItem>
            <ToggleGroupItem value="dayAfter" className="text-xs sm:text-sm px-3">
              Lusa
            </ToggleGroupItem>
          </ToggleGroup>

        </div>
      </CardHeader>
      <CardContent>
        {filteredForecasts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredForecasts.map((forecast) => {
              const dirDeg = normalizeDeg(forecast.wd_deg);
              const dirLabel = forecast.wd || degreesToCompass(dirDeg ?? undefined);
              const visKm = typeof forecast.vs === "number" && Number.isFinite(forecast.vs) ? (forecast.vs / 1000).toFixed(1) : null;
              const imageSrc = forecast.image ? encodeURI(forecast.image) : null;

              return (
                <div key={forecast.datetime} className="flex flex-col p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
                  <p className="text-center font-semibold text-sm mb-2">
                    {new Date(forecast.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </p>
                  <div className="flex items-center justify-center gap-2 my-1">
                    {imageSrc && <img src={imageSrc} alt={forecast.weather_desc} className="w-12 h-12 object-contain" width="48" height="48" />}
                    <p className="text-2xl font-bold">{formatNumber(forecast.t)}°C</p>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize text-center mb-3 h-8">{forecast.weather_desc.toLowerCase()}</p>
                  <div className="space-y-1.5 text-xs text-muted-foreground mt-auto border-t border-gray-200 dark:border-gray-700 pt-2">
                    <div className="flex justify-between"><span>Kelembapan</span> <span className="font-medium text-foreground">{formatNumber(forecast.hu)}%</span></div>
                    <div className="flex justify-between"><span>Hujan</span> <span className="font-medium text-foreground">{formatNumber(forecast.tp, { decimals: 1 })} mm</span></div>
                    <div className="flex justify-between items-center">
                      <span>Angin</span>
                      <div className="flex items-center gap-1 font-medium text-foreground">
                        <WindDirectionIndicator deg={dirDeg} />
                        <span>{dirLabel}</span>
                        <span>{formatNumber(forecast.ws, { decimals: 1 })} km/j</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Data prakiraan untuk hari yang dipilih tidak tersedia.
          </p>
        )}
      </CardContent>
    </Card>
  );
}