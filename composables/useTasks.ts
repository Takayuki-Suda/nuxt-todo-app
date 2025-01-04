// useTasks.ts
import { onMounted, reactive } from "vue";
import { useTaskState } from "./task/useTaskState";
import { useTaskPagination } from "./task/useTaskPagination";
import { useTaskOperations } from "./task/useTaskOperations";
import { useTaskEdit } from "./task/useTaskEdit";
import { useTaskNotification } from "./task/useTaskNotification";
import axios from "axios";

export function useTasks() {
  const { state, taskDisplayOptions } = useTaskState();
  const { totalPages, paginatedTasks } = useTaskPagination(state);
  const { showToast, toastType, toastMessage, showToastMessage } =
    useTaskNotification();

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
    ...useTaskEdit(state, showToastMessage),
  };

  // クライアントサイドでのみ実行
  onMounted(async () => {
    if (process.client) {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks");
        state.value.tasks = response.data;
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        state.value.tasks = [];
      }
    }
  });

  // タスクの再読み込み
  const loadTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      state.value.tasks = response.data;
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      state.value.tasks = [];
    }
  };

  // 期限日でタスクを取得
  const fetchTasksByDueDate = async (dueDate: string) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/tasks/dueDate", // 修正
        {
          params: { due_date: dueDate },
        }
      );
      state.value.tasks = response.data.tasks; // 検索結果をtasksに設定
      state.value.paginatedTasks = response.data.tasks; // 追加
    } catch (error) {
      console.error("Failed to fetch tasks by due date:", error);
      state.value.tasks = [];
      state.value.paginatedTasks = []; // 追加
    }
  };

  return {
    taskState,
    operations,
    loadTasks,
    fetchTasksByDueDate, // 追加
  };
}
