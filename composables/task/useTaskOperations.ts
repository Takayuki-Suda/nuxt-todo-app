import { watch } from "vue";
import type { Ref } from "vue";
import type { TaskState, Task } from "~/types/task";
import axios from "axios";
import { AxiosError } from "axios";

export function useTaskOperations(
  state: Ref<TaskState>,
  showToastMessage: (message: string, type: string) => void
) {
  const addTask = async () => {
    try {
      const trimmedTask = state.value.newTask.trim();
      if (!trimmedTask) return;

      if (state.value.tasks.some((task) => task?.text === trimmedTask)) {
        showToastMessage("タスクが重複しています！", "bg-warning");
        return;
      }

      const newTask: Task = {
        text: trimmedTask,
        completed: false,
        dueDate: new Date().toISOString(),
      };

      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        newTask
      );
      if (response.status === 201) {
        // レスポンスから保存されたタスクを取得して状態を更新
        state.value.tasks.push(response.data);
        state.value.newTask = "";
        showToastMessage("タスクが正常に追加されました！", "bg-success");
      }
    } catch (error) {
      console.error("タスク追加エラー:", error);
      showToastMessage("タスクの追加に失敗しました", "bg-danger");
    }
  };

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
    showToastMessage("タスクが削除されました！", "bg-danger");
  };

  const saveTasks = async () => {
    try {
      // サーバーにタスクを送信
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        state.value.tasks
      );

      // サーバーからのレスポンスが正常な場合
      if (response.status === 201) {
        console.log("サーバーレスポンス:", response);

        const addedTask = response.data.task; // 追加されたタスク
        console.log("追加されたタスク:", addedTask);

        // 状態を更新して、タスクを追加
        state.value.tasks.push(addedTask);

        console.log("タスクが正常に追加されました。");

        // 状態が更新されたことを通知（必要に応じてUI側に反映）
        // 例えば、リスト更新のために再レンダリングする必要があるかもしれません
      } else {
        console.error("サーバーエラー:", response.data);
      }
    } catch (error) {
      console.error("タスク保存エラー:", error);
    }
  };

  watch(
    () => state.value.tasks,
    () => {
      console.log("タスクが変更されました。必要に応じて保存してください。");
      // 自動保存をコメントアウトまたは頻度を制御
      // saveTasks();
    },
    { deep: true }
  );

  const clearInput = () => {
    state.value.newTask = "";
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
    saveTasks,
    clearInput,
    deselectAllTasks,
    loadTasks,
  };
}
