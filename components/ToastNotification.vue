<template>
  <div
    v-if="showToast"
    class="position-fixed top-0 end-0 p-3"
    style="z-index: 1050; width: 300px; transition: opacity 0.5s ease-out"
  >
    <div
      class="toast show"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      :class="toastType"
    >
      <div class="toast-header">
        <strong class="me-auto">{{ toastMessage }}</strong>
        <button
          type="button"
          class="btn-close"
          @click="$emit('close')"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  showToast: Boolean,
  toastType: String,
  toastMessage: String,
});

defineEmits(["close"]);
</script>

<style scoped>
@import "@/assets/css/toast-style.css";
</style>
