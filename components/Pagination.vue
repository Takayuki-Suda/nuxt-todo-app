<template>
  <nav aria-label="Task pagination" class="mt-3">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="$emit('changePage', currentPage - 1)">
          前へ
        </button>
      </li>
      <li
        v-for="page in totalPages"
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
defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

defineEmits(['changePage']);
</script>

<style scoped>
.pagination {
  margin-top: 20px;
}
.page-item.disabled .page-link {
  pointer-events: none;
  color: #6c757d;
  background-color: #fff;
  border-color: #dee2e6;
}
.page-item.active .page-link {
  z-index: 1;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
