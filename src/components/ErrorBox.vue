<template>
  <div class="error-box" v-if="message">
    ⚠️ {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>()
</script>

<style scoped>
.error-box {
  color: red;
  background: #ffeaea;
  padding: 8px;
  border-radius: 6px;
  margin-top: 10px;
}
</style>
