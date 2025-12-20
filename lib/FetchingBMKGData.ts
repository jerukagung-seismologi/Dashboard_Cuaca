export interface BMKGMeteoAPI {
  datetime: string;
  t: number;
  tcc: number;
  tp: number;
  weather: number;
  weather_desc: string;
  weather_desc_en: string;
  wd_deg: number;
  wd: string;
  wd_to: string;
  ws: number;
  hu: number;
  vs: number;
  vs_text: string;
  time_index: string;
  analysis_date: string;
  image: string;
  utc_datetime: string;
  local_datetime: string;
}

export async function fetchBMKGData(): Promise<BMKGMeteoAPI[]> {
  try {
    const response = await fetch('https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=33.05.05.2009', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any = await response.json();
    
    // --- PERBAIKAN DI SINI ---
    // 1. Cek apakah 'data.data' ada dan merupakan array yang tidak kosong
    if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
        console.error("API response missing 'data' array:", data);
        return [];
    }

    // 2. Ambil elemen pertama dari array data (biasanya lokasi yang diminta)
    const locationData = data.data[0];

    // 3. Cek apakah 'cuaca' ada di dalam locationData
    if (!locationData?.cuaca || !Array.isArray(locationData.cuaca)) {
        console.error("Unexpected API structure: 'cuaca' is missing or not an array", locationData);
        return [];
    }

    // 4. Flatten array (menggabungkan array per-hari menjadi satu list panjang)
    const rawData = locationData.cuaca.flat();
    // -------------------------

    const formattedData: BMKGMeteoAPI[] = rawData.map((item: any) => ({
      datetime: item.datetime,
      t: item.t,
      tcc: item.tcc,
      tp: item.tp,
      weather: item.weather,
      weather_desc: item.weather_desc,
      weather_desc_en: item.weather_desc_en,
      wd_deg: item.wd_deg,
      wd: item.wd,
      wd_to: item.wd_to,
      ws: item.ws,
      hu: item.hu,
      vs: item.vs,
      vs_text: item.vs_text,
      time_index: item.time_index,
      analysis_date: item.analysis_date,
      image: item.image,
      utc_datetime: item.utc_datetime,
      local_datetime: item.local_datetime,
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching BMKG data:", error);
    return [];
  }
}