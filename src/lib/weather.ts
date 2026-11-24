import "server-only";

/**
 * Dự báo thời tiết 5 ngày cho khu vực cửa hàng (Chơn Thành) từ Open-Meteo – miễn phí, không cần khoá API
 * (giấy phép CC BY 4.0: ghi nguồn “Open-Meteo” cạnh dữ liệu). Kết quả cache 30 phút (ISR).
 * Lỗi mạng / hết thời gian chờ → null, giao diện hiện lời khuyên theo mùa thay thế.
 *
 * WEATHER_FIXTURE=1 (chỉ để kiểm thử khi máy không ra được internet): trả dữ liệu mẫu cố định.
 */
export const WEATHER_PLACE = { name: "Chơn Thành", lat: 11.43, lon: 106.62 }; // toạ độ gần đúng trung tâm Chơn Thành

type DayForecast = { date: string; code: number; tmax: number; tmin: number; rain: number; prob: number; wind: number };
type Forecast = { days: DayForecast[]; fetchedAt: string };

const URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_PLACE.lat}&longitude=${WEATHER_PLACE.lon}` +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max" +
  "&timezone=Asia%2FHo_Chi_Minh&forecast_days=5";

function fixture(): Forecast {
  const today = new Date();
  const d = (i: number) => new Date(today.getTime() + i * 86400000).toISOString().slice(0, 10);
  return {
    fetchedAt: new Date().toISOString(),
    days: [
      { date: d(0), code: 2, tmax: 33, tmin: 23, rain: 0.4, prob: 20, wind: 9 },
      { date: d(1), code: 63, tmax: 30, tmin: 23, rain: 18.5, prob: 85, wind: 14 },
      { date: d(2), code: 80, tmax: 31, tmin: 23, rain: 6.2, prob: 60, wind: 11 },
      { date: d(3), code: 1, tmax: 34, tmin: 22, rain: 0, prob: 10, wind: 8 },
      { date: d(4), code: 95, tmax: 32, tmin: 24, rain: 24, prob: 90, wind: 22 },
    ],
  };
}

export async function getForecast(): Promise<Forecast | null> {
  if (process.env.WEATHER_FIXTURE === "1") return fixture();
  try {
    const res = await fetch(URL, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const j = (await res.json()) as {
      daily?: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_sum: number[]; precipitation_probability_max: (number | null)[]; wind_speed_10m_max: number[] };
    };
    const t = j.daily;
    if (!t?.time?.length) return null;
    return {
      fetchedAt: new Date().toISOString(),
      days: t.time.map((date, i) => ({
        date,
        code: t.weather_code[i] ?? 0,
        tmax: Math.round(t.temperature_2m_max[i] ?? 0),
        tmin: Math.round(t.temperature_2m_min[i] ?? 0),
        rain: Math.round((t.precipitation_sum[i] ?? 0) * 10) / 10,
        prob: t.precipitation_probability_max[i] ?? 0,
        wind: Math.round(t.wind_speed_10m_max[i] ?? 0),
      })),
    };
  } catch {
    return null;
  }
}
