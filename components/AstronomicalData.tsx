"use client";

import { useEffect, useState } from "react";
import { Sunrise, Sunset, Moon, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fetchAstronomicalData, AstronomicalDataType } from "@/lib/FetchingAstronomical";
import MoonPhaseIcon from "@/components/MoonPhaseIcon";

interface AstronomicalDataProps {
  className?: string;
}

// Custom hook
function useAstronomicalData(lat: number, lng: number) {
  const [astroData, setData] = useState<AstronomicalDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchData() {
      setLoading(true);
      try {
        const astronomicalData = await fetchAstronomicalData(lat, lng);
        if (active) setData(astronomicalData);
      } catch (e) {
        if (active) setError(e instanceof Error ? e : new Error("Unknown error"));
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 60 * 60 * 1000); // Refresh every hour
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [lat, lng]);

  return { astroData, loading, error };
}

export default function AstronomicalData({ className }: AstronomicalDataProps) {
  const { astroData, loading, error } = useAstronomicalData(-7.736628913501616, 109.64609598596998);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const tick = () => setCurrentTime(new Date());
    tick();
    const iv = setInterval(tick, 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  if (loading) {
    return (
      <Card className={cn("border-2 border-primary/20 shadow-md", className)}>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">Loading astronomical data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !astroData) {
    return (
      <Card className={cn("border-2 border-primary/20 shadow-md", className)}>
        <CardContent className="p-6">
          <p className="text-sm text-destructive text-center">Error loading astronomical data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-2 border-primary/20 shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Data Astronomi</span>
          <div className="flex items-center text-sm font-normal text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{currentTime.toLocaleTimeString([], { 
              hour: "2-digit", 
              minute: "2-digit",
              hour12: false 
            })}</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* grid from 3 to 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Combined: Sunrise + Sunset */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-orange-900/20 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-full bg-amber-500/20">
                <Sunrise className="h-6 w-6 text-amber-600" />
              </div>
              <div className="p-2 rounded-full bg-orange-500/20">
                <Sunset className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-base font-medium">Terbit & Terbenam Matahari</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sunrise section */}
              <div className="rounded-md p-3 bg-white/50 dark:bg-black/10">
                <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-1">Terbit</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{astroData.sunrise}</p>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Astronomical Twilight:</span>
                    <span>{astroData.astronomicalTwilightBegin}</span>
                  </div>
                  {/* Added: Civil Twilight Begin */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Civil Twilight Begin:</span>
                    <span>{astroData.civilTwilightBegin}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Solar Noon:</span>
                    <span>{astroData.solarNoon}</span>
                  </div>
                </div>
              </div>

              {/* Sunset section */}
              <div className="rounded-md p-3 bg-white/50 dark:bg-black/10">
                <p className="text-xs uppercase tracking-wide text-orange-700 dark:text-orange-400 mb-1">Terbenam</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">{astroData.sunset}</p>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Astronomical Twilight:</span>
                    <span>{astroData.astronomicalTwilightEnd}</span>
                  </div>
                  {/* Added: Civil Twilight End */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Civil Twilight End:</span>
                    <span>{astroData.civilTwilightEnd}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Day Length:</span>
                    <span>{astroData.dayLength}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Moon Phase */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-indigo-500/20">
                <Moon className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-base font-medium">Moon Phase</h3>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">{astroData.moonPhase}</p>
              <span className="text-sm text-muted-foreground">
                {astroData.moonIllumination}% illuminated
              </span>
            </div>
            
            <MoonPhaseIcon phase={astroData.moonPhaseIcon as any} size="lg" className="mx-auto mb-3" />
            <div className="w-full flex justify-between text-xs text-muted-foreground">
              {["new-moon", 
                "first-quarter", 
                "full-moon", 
                "last-quarter"]
                .map((phase) => (
                <div key={phase} className="flex flex-col items-center">
                  <MoonPhaseIcon phase={phase as any} size="sm" />
                  <span className="mt-1 capitalize">{phase.replace("-", " ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}