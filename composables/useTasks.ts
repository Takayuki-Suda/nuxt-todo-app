// useTasks.ts
import { onMounted, reactive } from 'vue';
import type { Task, TaskState } from '~/types/task';
import { useTaskState } from './task/useTaskState';
import { useTaskPagination } from './task/useTaskPagination';
import { useTaskDragDrop } from './task/useTaskDragDrop';
import { useTaskOperations } from './task/useTaskOperations';
import { useTaskEdit } from './task/useTaskEdit';
import { useTaskNotification } from './task/useTaskNotification';

export function useTasks() {
  const { state, taskDisplayOptions } = useTaskState();
  const { totalPages, paginatedTasks } = useTaskPagination(state);
  const { showToast, toastType, toastMessage, showToastMessage } = useTaskNotification();

  // 状態のみを返すオブジェクト
  const taskState = reactive({
    state,
    taskDisplayOptions,
    totalPages,
    paginatedTasks,
    showToast,
    toastType,
    toastMessage,
    draggedTaskIndex: null as number | null,
    draggingTaskIndex: null as number | null,
    dragDirection: null as "up" | "down" | null,
  });

  // 操作関数を別のオブジェクトにまとめる
  const operations = {
    ...useTaskOperations(state, showToastMessage),
    ...useTaskDragDrop(state, () => operations.saveTasks()),
    ...useTaskEdit(state, showToastMessage, () => operations.saveTasks()),
  };

  // クライアントサイドでのみ実行
  onMounted(() => {
    if (process.client) {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        try {
          state.value.tasks = JSON.parse(savedTasks);
        } catch (error) {
          console.error('Failed to parse saved tasks:', error);
          state.value.tasks = [];
        }
      }
    }
  });

  return {
    taskState,
    operations,
  };
}
