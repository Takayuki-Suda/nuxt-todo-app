<template>
  <nav aria-label="Task pagination" class="mt-3">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="$emit('changePage', currentPage - 1)">
          前へ
        </button>
      </li>
      <li
        v-for="page in pages"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page }"
      >
        <button class="page-link" @click="$emit('changePage', page)">
          {{ page }}
        </button>
      </li>
      <li :class="{ disabled: currentPage === totalPages }" class="page-item">
        <button class="page-link" @click="$emit('changePage', currentPage + 1)">
          次へ
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const pages = computed(() => {
  const pageArray = [];
  for (let i = 1; i <= props.totalPages; i++) {
    pageArray.push(i);
  }
  return pageArray;
});

defineEmits<{
  changePage: [page: number];
}>();
</script>

<style scoped>
@import "@/assets/css/pagination-style.css";
</style>
