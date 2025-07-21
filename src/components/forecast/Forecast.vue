<script setup lang="ts">
import {defineProps} from 'vue';
import style from './forecast.module.scss';


const props = defineProps<{
  city: { name: string; country: string };
  weather: {
    daily: {
      time: string[];
      temperature_2m_min: number[];
      temperature_2m_max: number[];
      weathercode: number[];
    };
  };
}>();
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(navigator.language, { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}
</script>

<template>
  <div :class="style.contentDiv">
    <h2 :class="style.title">Forecast for {{ props.city.name }}, {{ props.city.country }}</h2>

    <div :class="style.dailyItem" v-for="(date, index) in props.weather.daily.time" :key="index">
      <p><strong>{{ formatDate(date)  }}</strong></p>
      <p> <span>Min: {{ props.weather.daily.temperature_2m_min[index] }}°C </span> <span>/ Max:
        {{ props.weather.daily.temperature_2m_max[index] }}°C</span></p>

    </div>
  </div>
</template>
