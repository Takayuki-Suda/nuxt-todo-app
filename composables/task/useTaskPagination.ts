import { computed } from 'vue';
import type { Ref } from 'vue';
import type { TaskState } from '~/types/task';

export function useTaskPagination(state: Ref<TaskState>) {
  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(state.value.tasks.length / state.value.tasksPerPage));
  });

  const paginatedTasks = computed(() => {
    if (!state.value.tasks.length) return [];

    const start = (state.value.currentPage - 1) * state.value.tasksPerPage;
    const end = start + state.value.tasksPerPage;

    return state.value.tasks.slice(start, end);
  });

  return {
    totalPages,
    paginatedTasks,
  };
} 