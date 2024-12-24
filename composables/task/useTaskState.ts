import { ref } from "vue";
import type { TaskState } from "~/types/task";

export function useTaskState() {
  // 初期状態を定義
  const initialState: TaskState = {
    tasks: [],
    newTask: "",
    selectedTasks: [],
    isEditModalVisible: false,
    currentEditTaskIndex: null,
    currentEditTask: null,
    currentPage: 1,
    tasksPerPage: 5,
    selectedTask: null,
    newTaskDetails: "",
  };

  const state = ref<TaskState>(initialState);
  const taskDisplayOptions = [5, 10, 20];

  return {
    state,
    taskDisplayOptions,
  };
}
