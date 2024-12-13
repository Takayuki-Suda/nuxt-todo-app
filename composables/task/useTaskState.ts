import { ref, computed } from 'vue';

export function useTaskState() {
  const tasks = ref<{ text: string; completed: boolean }[]>([]);
  const newTask = ref("");
  const selectedTasks = ref<number[]>([]);

  // 編集モーダル用の状態
  const isEditModalVisible = ref(false);
  const currentEditTaskIndex = ref<number | null>(null);
  const currentEditTask = ref("");

  // ページネーション用の状態
  const currentPage = ref(1);
  const tasksPerPage = ref(5);
  const taskDisplayOptions = [5, 10, 20];

  return {
    tasks,
    newTask,
    selectedTasks,
    isEditModalVisible,
    currentEditTaskIndex,
    currentEditTask,
    currentPage,
    tasksPerPage,
    taskDisplayOptions,
  };
} 