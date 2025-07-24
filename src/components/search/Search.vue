<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import { fetchCities, fetchWeather } from "../../../api.ts";
import type { CityResult } from "@/types/types.ts";
import styles from './search.module.scss';
import Forecast from "@/components/forecast/Forecast.vue";
import CurrentWeather from "@/components/CurrentWeather.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import { NSpin } from 'naive-ui'
// состояние
const search = ref<string>('');
const options = ref<CityResult[]>([]);
const selectedCity = ref<CityResult | null>(null);
const cityWeather = ref<any>(null);
const error = ref<string | null>(null);
const showDropdown = ref<boolean>(false);
let debounceTimeout: number | undefined;
let loadingTimeoutId: number | undefined;

const loading = ref(false);
watch(search, (newVal) => {
  if (newVal.trim() === '') {
    selectedCity.value = null;
    cityWeather.value = null;
    showDropdown.value = false;
    options.value = [];
  }
});
// emit
const emit = defineEmits< {
  (e: 'select', city: CityResult): void
}>();

// Поиск по вводу
const handleInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  if (loadingTimeoutId) clearTimeout(loadingTimeoutId);

  if (search.value.trim().length < 2) {
    options.value = [];
    showDropdown.value = false;
    loading.value = false;
    return;
  }

  showDropdown.value = true;
  loading.value = true;

  // ⏱ Запускаем таймер на 20 секунд
  loadingTimeoutId = window.setTimeout(() => {
    loading.value = false;
    error.value = 'Не удалось найти города. Попробуйте позже.';
    options.value = [];
    showDropdown.value = false;
  }, 20000);

  debounceTimeout = window.setTimeout(async () => {
    try {
      options.value = await fetchCities(search.value);
      error.value = null;
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке городов';
      options.value = [];
      showDropdown.value = false;
    } finally {
      loading.value = false;
      clearTimeout(loadingTimeoutId);
    }
  }, 300);
};


// Выбор города
const handleSelect = async (city: CityResult) => {
  try {
    emit('select', city);
    selectedCity.value = city;
    search.value = `${city.name}, ${city.country}`;
    showDropdown.value = false;
    error.value = null;

    const weatherData = await fetchWeather(
        String(city.latitude),
        String(city.longitude)
    );
    cityWeather.value = weatherData;
  } catch (err: any) {
    console.error("Ошибка при получении погоды:", err);
    error.value = err.message || 'Что-то пошло не так';
    cityWeather.value = null;
  }
};

// Открыть/закрыть dropdown по клику на стрелку
const toggleDropdown = async () => {
  if (showDropdown.value) {
    showDropdown.value = false;
    return;
  }

  if (search.value.trim().length === 0) {
    if (options.value.length > 0) {
      showDropdown.value = true;
    }
    return;
  }

  if (options.value.length === 0) {
    try {
      options.value = await fetchCities(search.value);
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке городов';
      options.value = [];
      showDropdown.value = false;
      return;
    }
  }

  showDropdown.value = true;
};

// Очистка input и списка
const clearSearch = () => {
  if (search.value === '') return;

  search.value = '';
  options.value = [];
  showDropdown.value = false;
  cityWeather.value = null;
  error.value = null;
  selectedCity.value = null;
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
    debounceTimeout = undefined;
  }
  if (loadingTimeoutId) {
    clearTimeout(loadingTimeoutId);
    loadingTimeoutId = undefined;
  }
};
const shouldShowWeather = computed(() =>
    search.value.trim() !== '' && selectedCity.value && cityWeather.value
);
</script>

<template>
  <div :class="styles.inputBox">
    <div :class="styles.inputField" style="position: relative;">
      <input
          :class="styles.inputWrapper"
          type="text"
          v-model="search"
          @input="handleInput"
          placeholder="Search city..."
          autocomplete="off"
      />
      <button
          :class="styles.btn"
          @click.stop="toggleDropdown"
          aria-label="Toggle dropdown"
          type="button"
      >
        ▼
      </button>
      <button
          :class="styles.close"
          v-if="search"
          class="clear-btn"
          @click="clearSearch"
          aria-label="Clear search"
          type="button"
      >
        ×
      </button>
    </div>



    <ul v-if="showDropdown && search.trim() !== ''" style="border: 1px solid #ccc; margin-top: 4px; max-height: 200px; overflow-y: auto; border-radius:20px;background-color: var(--blue-100)">
      <li v-if="loading"  style="padding: 8px; text-align: center;">
        <NSpin size="small" stroke="#6D758F" />
      </li>
      <li v-for="city in options" :key="city.id" @click="handleSelect(city)" style="cursor:pointer;padding: 8px; color: #2E334A;">
        {{ city.name }}, {{ city.country }}
      </li>
      <li v-if="!loading && options.length === 0" style="padding: 8px; text-align: center;">
        No results found
      </li>
    </ul>
    <div v-if="shouldShowWeather">
      <CurrentWeather :data="cityWeather" :key="search" />
      <Forecast  v-if="selectedCity && cityWeather"
                 :city="selectedCity"
                 :weather="cityWeather"/>
    </div>

    <ErrorBox v-if="error" :message="error" />
  </div>
</template>


