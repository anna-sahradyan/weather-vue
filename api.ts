export const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
export const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchCities(name: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const res = await fetch(`${GEO_API_URL}?name=${name}&count=5&language=en&format=json`, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error(`Ошибка сети: ${res.status}`);
        }

        const data = await res.json();
        console.log("fetchCities data:", data);
        if (!data.results) {
            throw new Error('Нет данных  в ответе');
        }
        return data.results;
    } catch (err: unknown) {
        if (err instanceof Error) {
            if (err.name === 'AbortError') {
                throw new Error('Время ожидания запроса истекло');
            }
            throw err;
        } else {
            throw new Error('Неизвестная ошибка');
        }
    }
}



export async function fetchWeather(lat: string, lon: string) {
    if (!lat || !lon) {
        throw new Error("Latitude or longitude is missing");
    }

    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto&start_date=${today}&end_date=${tomorrow}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        throw new Error(data.reason || "Failed to fetch weather data");
    }

    return data;
}

