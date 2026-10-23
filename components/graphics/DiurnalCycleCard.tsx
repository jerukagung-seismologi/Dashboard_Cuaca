"use client";

import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Thermometer, Droplets, Wind, CloudRain, Sun, Info } from "lucide-react";

interface DiurnalHourlyPoint {
  hour: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  rainProb: number;
}

// Profil rata-rata siklus diurnal 24 jam wilayah Jerukagung (Kebumen Pesisir)
const DEFAULT_DIURNAL_DATA: DiurnalHourlyPoint[] = [
  { hour: "00:00", temp: 24.5, humidity: 91, windSpeed: 4.5, rainProb: 12 },
  { hour: "01:00", temp: 24.2, humidity: 92, windSpeed: 4.1, rainProb: 11 },
  { hour: "02:00", temp: 23.9, humidity: 94, windSpeed: 3.8, rainProb: 10 },
  { hour: "03:00", temp: 23.6, humidity: 95, windSpeed: 3.6, rainProb: 9 },
  { hour: "04:00", temp: 23.4, humidity: 96, windSpeed: 3.4, rainProb: 8 },
  { hour: "05:00", temp: 23.1, humidity: 97, windSpeed: 3.2, rainProb: 8 },
  { hour: "06:00", temp: 24.0, humidity: 93, windSpeed: 4.2, rainProb: 7 },
  { hour: "07:00", temp: 25.8, humidity: 86, windSpeed: 5.8, rainProb: 6 },
  { hour: "08:00", temp: 27.6, humidity: 79, windSpeed: 7.6, rainProb: 7 },
  { hour: "09:00", temp: 29.4, humidity: 73, windSpeed: 9.5, rainProb: 10 },
  { hour: "10:00", temp: 30.9, humidity: 68, windSpeed: 11.2, rainProb: 14 },
  { hour: "11:00", temp: 31.8, humidity: 64, windSpeed: 12.5, rainProb: 20 },
  { hour: "12:00", temp: 32.5, humidity: 62, windSpeed: 13.4, rainProb: 26 },
  { hour: "13:00", temp: 32.2, humidity: 63, windSpeed: 13.8, rainProb: 32 },
  { hour: "14:00", temp: 31.5, humidity: 67, windSpeed: 13.2, rainProb: 39 },
  { hour: "15:00", temp: 30.2, humidity: 73, windSpeed: 12.1, rainProb: 44 },
  { hour: "16:00", temp: 28.8, humidity: 79, windSpeed: 10.4, rainProb: 41 },
  { hour: "17:00", temp: 27.5, humidity: 84, windSpeed: 8.5, rainProb: 33 },
  { hour: "18:00", temp: 26.5, humidity: 87, windSpeed: 6.8, rainProb: 26 },
  { hour: "19:00", temp: 25.9, humidity: 89, windSpeed: 5.7, rainProb: 21 },
  { hour: "20:00", temp: 25.4, humidity: 90, windSpeed: 5.2, rainProb: 18 },
  { hour: "21:00", temp: 25.1, humidity: 91, windSpeed: 4.9, rainProb: 16 },
  { hour: "22:00", temp: 24.8, humidity: 91, windSpeed: 4.7, rainProb: 14 },
  { hour: "23:00", temp: 24.6, humidity: 92, windSpeed: 4.6, rainProb: 13 },
];

interface DiurnalCycleCardProps {
  isDarkMode?: boolean;
}

export function DiurnalCycleCard({ isDarkMode = false }: DiurnalCycleCardProps) {
  const [activeParam, setActiveParam] = useState<"temp" | "humidity" | "wind" | "rain">("temp");

  const hours = useMemo(() => DEFAULT_DIURNAL_DATA.map((d) => d.hour), []);

  const config = useMemo(() => {
    switch (activeParam) {
      case "temp":
        return {
          title: "Suhu Udara Rata-Rata (°C)",
          name: "Suhu",
          unit: "°C",
          color: "#f97316",
          areaColor: "rgba(249, 115, 22, 0.15)",
          data: DEFAULT_DIURNAL_DATA.map((d) => d.temp),
          peak: "12:00 - 13:00 WIB (Puncak ~32.5°C)",
          valley: "05:00 WIB (Suhu minimum ~23.1°C)",
          insight: "Pemanasan radiasi surya mencapai puncak pukul 12:00. Udara paling sejuk terjadi menjelang fajar matahari terbit.",
        };
      case "humidity":
        return {
          title: "Kelembapan Relatif Udara (%)",
          name: "Kelembapan",
          unit: "%",
          color: "#0284c7",
          areaColor: "rgba(2, 132, 199, 0.15)",
          data: DEFAULT_DIURNAL_DATA.map((d) => d.humidity),
          peak: "04:00 - 05:00 WIB (~97%)",
          valley: "12:00 - 13:00 WIB (~62%)",
          insight: "Kelembapan berbanding terbalik dengan suhu. Malam hari terjadi pengembunan tinggi, sedangkan siang hari udara cukup kering.",
        };
      case "wind":
        return {
          title: "Kecepatan Angin Rata-Rata (km/j)",
          name: "Kecepatan Angin",
          unit: "km/j",
          color: "#14b8a6",
          areaColor: "rgba(20, 184, 166, 0.15)",
          data: DEFAULT_DIURNAL_DATA.map((d) => d.windSpeed),
          peak: "13:00 WIB (~13.8 km/j - Angin Laut)",
          valley: "05:00 WIB (~3.2 km/j - Angin Darat Tenang)",
          insight: "Pola angin pesisir selatan Kebumen: angin laut kuat bertiup siang hingga sore, kemudian melemah menjadi angin darat tenang di malam hari.",
        };
      case "rain":
        return {
          title: "Probabilitas Kejadian Hujan (%)",
          name: "Peluang Hujan",
          unit: "%",
          color: "#8b5cf6",
          areaColor: "rgba(139, 92, 246, 0.15)",
          data: DEFAULT_DIURNAL_DATA.map((d) => d.rainProb),
          peak: "14:30 - 16:30 WIB (~44%)",
          valley: "06:00 - 08:00 WIB (~6%)",
          insight: "Hujan di daratan Kebumen dominan dipicu oleh awan konvektif sore hari akibat pemanasan permukaan dan perbenturan angin laut.",
        };
    }
  }, [activeParam]);

  const chartOption = useMemo(() => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
        formatter: (params: any[]) => {
          if (!params || !params[0]) return "";
          const p = params[0];
          return `<div style="font-size:12px;padding:4px">
            <strong>Pukul ${p.name} WIB</strong><br/>
            ${p.seriesName}: <b>${p.value} ${config.unit}</b>
          </div>`;
        },
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "10%",
        top: "12%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: hours,
        axisLine: { lineStyle: { color: isDarkMode ? "#64748b" : "#cbd5e1" } },
        axisLabel: {
          color: isDarkMode ? "#94a3b8" : "#64748b",
          fontSize: 11,
          interval: 2,
        },
      },
      yAxis: {
        type: "value",
        name: config.unit,
        axisLine: { show: false },
        axisLabel: { color: isDarkMode ? "#94a3b8" : "#64748b" },
        splitLine: {
          lineStyle: {
            color: isDarkMode ? "rgba(100, 116, 139, 0.15)" : "rgba(203, 213, 225, 0.5)",
          },
        },
      },
      series: [
        {
          name: config.name,
          type: "line",
          smooth: true,
          showSymbol: false,
          data: config.data,
          lineStyle: { width: 3, color: config.color },
          areaStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: config.color },
                { offset: 1, color: "rgba(255,255,255,0)" },
              ],
            },
            opacity: 0.25,
          },
        },
      ],
    };
  }, [hours, config, isDarkMode]);

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Siklus Diurnal 24 Jam (Pola Harian)
            </CardTitle>
            <CardDescription className="text-xs">
              Rerata dinamika atmosfer per jam wilayah Jerukagung, Klirong, Kebumen
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setActiveParam("temp")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeParam === "temp"
                  ? "bg-white dark:bg-gray-800 shadow-sm text-orange-600 dark:text-orange-400 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Thermometer className="h-3.5 w-3.5" /> Suhu
            </button>
            <button
              onClick={() => setActiveParam("humidity")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeParam === "humidity"
                  ? "bg-white dark:bg-gray-800 shadow-sm text-sky-600 dark:text-sky-400 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Droplets className="h-3.5 w-3.5" /> Kelembapan
            </button>
            <button
              onClick={() => setActiveParam("wind")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeParam === "wind"
                  ? "bg-white dark:bg-gray-800 shadow-sm text-teal-600 dark:text-teal-400 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Wind className="h-3.5 w-3.5" /> Angin
            </button>
            <button
              onClick={() => setActiveParam("rain")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeParam === "rain"
                  ? "bg-white dark:bg-gray-800 shadow-sm text-purple-600 dark:text-purple-400 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CloudRain className="h-3.5 w-3.5" /> Hujan
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grafik ECharts Diurnal */}
        <div className="h-[280px] w-full">
          <ReactECharts option={chartOption} style={{ height: "100%", width: "100%" }} />
        </div>

        {/* Ringkasan Insight Diurnal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
          <div className="p-2.5 rounded-lg bg-muted/40 border border-muted flex flex-col gap-0.5">
            <span className="text-muted-foreground">Puncak Tertinggi:</span>
            <span className="font-semibold text-foreground">{config.peak}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/40 border border-muted flex flex-col gap-0.5">
            <span className="text-muted-foreground">Titik Terendah:</span>
            <span className="font-semibold text-foreground">{config.valley}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 flex flex-col gap-0.5 sm:col-span-1">
            <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
              <Info className="h-3 w-3" /> Catatan Lapangan:
            </span>
            <span className="text-muted-foreground">{config.insight}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
