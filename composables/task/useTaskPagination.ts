import { computed } from 'vue';
import type { Ref } from 'vue';

export function useTaskPagination(
  tasks: Ref<{ text: string; completed: boolean }[]>,
  currentPage: Ref<number>,
  tasksPerPage: Ref<number>,
  selectedTasks: Ref<number[]>
) {
  const totalPages = computed(() => {
    const validTasks = tasks.value.filter(task => task !== null);
    return Math.max(1, Math.ceil(validTasks.length / tasksPerPage.value));
  });

  const paginatedTasks = computed(() => {
    if (!tasks.value || tasks.value.length === 0) {
      return [];
    }

    const validTasks = tasks.value.filter(task => task !== null);
    const start = (currentPage.value - 1) * tasksPerPage.value;
    const end = start + tasksPerPage.value;

    return validTasks.slice(start, end);
  });

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const resetPage = () => {
    currentPage.value = 1;
    selectedTasks.value = [];
  };

  return {
    totalPages,
    paginatedTasks,
    changePage,
    resetPage,
  };
} 