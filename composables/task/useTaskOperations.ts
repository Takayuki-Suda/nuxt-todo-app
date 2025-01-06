import type { Ref } from "vue";
import type { TaskState, Task } from "~/types/task";
import axios from "axios";
import { useToast } from "vue-toastification";

export function useTaskOperations(
  state: Ref<TaskState>,
  showToastMessage: (message: string, type: string) => void
) {
  const toast = useToast();

  const addTask = async () => {
    try {
      const trimmedTask = state.value.newTask.trim();
      const taskDetails = state.value.newTaskDetails.trim();
      if (!trimmedTask) return;

      if (state.value.tasks.some((task) => task?.text === trimmedTask)) {
        toast.warning("タスクが重複しています！");
        return;
      }

      const newTask: Task = {
        text: trimmedTask,
        completed: false,
        dueDate: new Date().toISOString(),
        details: taskDetails || "No details", // taskDetailsが空の場合、空文字を渡す
        order: state.value.tasks.length + 1, // タスクの順番を末尾に追加
      };

      console.log("Sending new task:", newTask); // リクエストデータをログに出力

      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        newTask
      );

      if (response.status === 201) {
        state.value.tasks.push(response.data);
        state.value.newTask = "";
        state.value.newTaskDetails = "";
        toast.success("タスクが正常に追加されました！");
        loadTasks();
      }
    } catch (error) {
      console.error("タスク追加エラー:", error);
      toast.error("タスクの追加に失敗しました");
    }
  };

  // ページロード時にタスクを取得

  const removeSelectedTasks = async () => {
    const actualIndexes = state.value.selectedTasks.map((selectedIndex) => {
      const pageOffset =
        (state.value.currentPage - 1) * state.value.tasksPerPage;
      return pageOffset + (selectedIndex % state.value.tasksPerPage);
    });

    const sortedIndexes = [...actualIndexes].sort((a, b) => b - a);

    for (const index of sortedIndexes) {
      if (index >= 0 && index < state.value.tasks.length) {
        const taskToRemove = state.value.tasks[index];

        try {
          const response = await axios.delete(
            `http://localhost:5000/api/tasks/${taskToRemove.id}`
          );
          if (response.status === 200) {
            state.value.tasks.splice(index, 1);
          }
        } catch (error) {
          console.error(`タスク削除エラー (ID: ${taskToRemove.id}):`, error);
        }
      }
    }

    state.value.selectedTasks = [];
    toast.success("タスクが削除されました！");
  };

  const clearInput = () => {
    state.value.newTask = "";
    state.value.newTaskDetails = ""; // detailsフィールドもクリア
  };

  const deselectAllTasks = () => {
    state.value.selectedTasks = [];
  };

  const loadTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      state.value.tasks = response.data;
    } catch (error) {
      console.error("タスク取得エラー:", error);
      state.value.tasks = [];
    }
  };

  return {
    addTask,
    removeSelectedTasks,
    clearInput,
    deselectAllTasks,
    loadTasks,
  };
}
