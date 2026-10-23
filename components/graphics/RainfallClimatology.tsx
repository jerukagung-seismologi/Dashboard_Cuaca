"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, CloudRain, TrendingUp, Calendar } from "lucide-react";
import type { ClimateNormals } from "@/lib/FetchingClimatology";

interface RainfallClimatologyProps {
  normals: ClimateNormals;
  isDarkMode?: boolean;
}

export default function RainfallClimatology({ normals, isDarkMode = false }: RainfallClimatologyProps) {
  const months = normals.monthly.map((m) => m.monthName);
  const rains = normals.monthly.map((m) => m.precipMean);
  const rainDays = normals.monthly.map((m) => m.rainDaysMean);

  const stats = useMemo(() => {
    const total = rains.reduce((s, v) => s + v, 0);
    const wetMonths = normals.monthly.filter((m) => m.precipMean >= 100).length;
    const moistMonths = normals.monthly.filter((m) => m.precipMean >= 60 && m.precipMean < 100).length;
    const dryMonths = normals.monthly.filter((m) => m.precipMean < 60).length;
    const maxM = normals.monthly.reduce((a, b) => (b.precipMean > a.precipMean ? b : a));
    const minM = normals.monthly.reduce((a, b) => (b.precipMean < a.precipMean ? b : a));
    return { total, wetMonths, moistMonths, dryMonths, maxM, minM };
  }, [normals, rains]);

  const textColor = isDarkMode ? "#cbd5e1" : "#475569";
  const gridColor = isDarkMode ? "rgba(71, 85, 105, 0.2)" : "rgba(203, 213, 225, 0.35)";

  const chartOption = useMemo(() => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any[]) => {
          if (!params || params.length === 0) return "";
          const monthIdx = params[0].dataIndex;
          const m = normals.monthly[monthIdx];
          const cat =
            m.precipMean >= 100
              ? { label: "Bulan Basah (≥ 100 mm)", color: "#0284c7" }
              : m.precipMean >= 60
              ? { label: "Bulan Lembab (60–99 mm)", color: "#38bdf8" }
              : { label: "Bulan Kering (< 60 mm)", color: "#f59e0b" };

          return `
            <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 180px;">
              <strong style="font-size: 13px; color: ${isDarkMode ? "#fff" : "#0f172a"};">
                ${m.fullName}
              </strong>
              <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; justify-content: space-between; gap: 12px;">
                  <span style="color: #0284c7; font-weight: 600;">● Curah Hujan Normal:</span>
                  <strong>${m.precipMean.toFixed(1)} mm</strong>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 12px;">
                  <span style="color: #6366f1; font-weight: 600;">● Hari Hujan Rerata:</span>
                  <strong>${m.rainDaysMean.toFixed(1)} hari</strong>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 12px; border-top: 1px solid #e2e8f0; padding-top: 4px; margin-top: 2px;">
                  <span>Klasifikasi Mohr:</span>
                  <strong style="color: ${cat.color};">${cat.label}</strong>
                </div>
              </div>
            </div>
          `;
        },
      },
      legend: {
        data: ["Curah Hujan (mm)", "Hari Hujan (hari)"],
        textStyle: { color: textColor, fontSize: 11 },
        top: "2%",
      },
      grid: {
        left: "4%",
        right: "4%",
        bottom: "10%",
        top: "14%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: months,
        axisLine: { lineStyle: { color: textColor } },
        axisLabel: { color: textColor, fontWeight: "bold" },
      },
      yAxis: [
        {
          type: "value",
          name: "Curah Hujan (mm)",
          position: "left",
          axisLabel: { color: "#0284c7", fontWeight: "bold", formatter: "{value} mm" },
          splitLine: { lineStyle: { color: gridColor } },
        },
        {
          type: "value",
          name: "Hari Hujan (hari)",
          position: "right",
          min: 0,
          max: 31,
          interval: 5,
          axisLabel: { color: "#6366f1", fontWeight: "bold", formatter: "{value} hr" },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "Curah Hujan (mm)",
          type: "bar",
          yAxisIndex: 0,
          barMaxWidth: 32,
          data: rains.map((r) => ({
            value: r,
            itemStyle: {
              color:
                r >= 100
                  ? "#0284c7" // Bulan Basah
                  : r >= 60
                  ? "#38bdf8" // Bulan Lembab
                  : "#f59e0b", // Bulan Kering
              borderRadius: [4, 4, 0, 0],
            },
          })),
          markLine: {
            silent: true,
            symbol: "none",
            data: [
              {
                yAxis: 100,
                lineStyle: { color: "#0284c7", type: "dashed", width: 1.5 },
                label: { formatter: "Bulan Basah Mohr (100 mm)", position: "insideEndTop", fontSize: 10, color: "#0284c7" },
              },
              {
                yAxis: 60,
                lineStyle: { color: "#f59e0b", type: "dashed", width: 1.5 },
                label: { formatter: "Bulan Kering Mohr (60 mm)", position: "insideEndBottom", fontSize: 10, color: "#f59e0b" },
              },
            ],
          },
        },
        {
          name: "Hari Hujan (hari)",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          symbol: "circle",
          symbolSize: 7,
          itemStyle: { color: "#6366f1" },
          lineStyle: { width: 3, color: "#6366f1" },
          data: rainDays,
        },
      ],
    };
  }, [normals, months, rains, rainDays, textColor, gridColor, isDarkMode]);

  return (
    <div className="space-y-4">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-4">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Hujan Tahunan</p>
              <p className="font-extrabold text-base">{stats.total.toFixed(0)} mm</p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-4">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
              <CloudRain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bulan Basah (≥ 100mm)</p>
              <p className="font-extrabold text-base">{stats.wetMonths} Bulan</p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-4">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bulan Terkering</p>
              <p className="font-extrabold text-base">
                {stats.minM.monthName} ({stats.minM.precipMean.toFixed(0)} mm)
              </p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-4">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bulan Terbasah</p>
              <p className="font-extrabold text-base">
                {stats.maxM.monthName} ({stats.maxM.precipMean.toFixed(0)} mm)
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ECharts Chart */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <CloudRain className="h-5 w-5 text-blue-500" />
                Distribusi Curah Hujan Bulanan (Normal 1991–2020)
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Klasifikasi Iklim Mohr: Bulan Basah (≥ 100 mm), Bulan Lembab (60–99 mm), Bulan Kering (&lt; 60 mm)
              </CardDescription>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 text-[10px]">
                Basah ≥ 100 mm ({stats.wetMonths} bln)
              </Badge>
              <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950 dark:text-sky-300 text-[10px]">
                Lembab 60–99 mm ({stats.moistMonths} bln)
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 text-[10px]">
                Kering &lt; 60 mm ({stats.dryMonths} bln)
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[380px] w-full">
            <ReactECharts option={chartOption} style={{ height: "100%", width: "100%" }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
