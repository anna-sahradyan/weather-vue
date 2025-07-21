<template>
  <div class="video-wrapper">
    <video autoplay muted loop playsinline class="background-video">
      <source src="./assets/styles/video.mp4/coverr-skiing-trick-1563382795858.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div class="wrapper">
      <div class="container">
        <main class="main">
          <div class="container">
            <Search/>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Search from "@/components/search/Search.vue";
</script>
