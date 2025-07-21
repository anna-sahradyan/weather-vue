<script setup lang="ts">
import { defineProps } from 'vue';
import style from '../components/forecast/forecast.module.scss';
const props = defineProps<{
  data: {
    current_weather: {
      temperature: number;
      windspeed: number;
      winddirection: number;
      weathercode: number;
      is_day: number;
      time: string;
    };
  };
}>();

const getWeatherDescription = (code: number): string => {
  const codes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    80: 'Rain showers',
    95: 'Thunderstorm'
    // добавь остальные по необходимости
  };
  return codes[code] || 'Unknown';
};
</script>

<template>
  <h3 :class="style.title">Current Weather</h3>
  <div :class="style.detailsForecast">
    <p :class="style.detailsItem"><strong>Temperature:</strong> {{ props.data.current_weather.temperature }}°C</p>
    <p :class="style.detailsItem"><strong>Windspeed:</strong> {{ props.data.current_weather.windspeed }} km/h</p>
    <p :class="style.detailsItem"><strong>Wind Direction:</strong> {{ props.data.current_weather.winddirection }}°</p>
    <p :class="style.detailsItem"><strong>Condition:</strong> {{ getWeatherDescription(props.data.current_weather.weathercode) }}</p>
    <p :class="style.detailsItem"><strong>Time:</strong> {{ props.data.current_weather.time }}</p>
  </div>
</template>
