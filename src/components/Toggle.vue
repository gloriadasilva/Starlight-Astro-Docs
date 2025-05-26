<template>
  <div>
    <button @click="show = !show" class="btn">Toggle</button>
    <Transition name="fade">
      <p v-if="show">hello</p>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const show = ref(false);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
