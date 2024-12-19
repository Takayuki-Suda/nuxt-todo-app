import { watch } from "vue";
import type { Ref } from "vue";
import type { TaskState, Task } from "~/types/task";
import axios from "axios"; // axiosをインポートしてAPI呼び出しに使用

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

      // TaskオブジェクトにdueDateを追加
      const newTask: Task = {
        text: trimmedTask,
        completed: false,
        dueDate: new Date().toISOString(), // ここで現在の日付をdueDateに設定
      };

      // サーバーにタスクを追加するAPIリクエストを送信
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        newTask
      );
      if (response.status === 201) {
        state.value.tasks.push(newTask); // 新しいタスクをローカル状態に追加
        state.value.newTask = ""; // newTaskのクリア
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

        // サーバーに削除するタスクを指定してAPIリクエストを送信
        const response = await axios.delete(
          `http://localhost:5000/api/tasks/${taskToRemove.id}`
        );
        if (response.status === 200) {
          state.value.tasks.splice(index, 1); // タスクをローカル状態から削除
        }
      }
    }

    state.value.selectedTasks = [];
    showToastMessage("タスクが削除されました！", "bg-danger");
  };

  const saveTasks = async () => {
    try {
      // 各タスクのdueDateを文字列形式でサーバーに送信
      const tasksWithDates = state.value.tasks.map((task) => ({
        ...task,
        dueDate: task.dueDate, // 必要に応じて日付の変換処理を追加
      }));

      // サーバーにタスクを保存するAPIリクエストを送信
      const response = await axios.put(
        "http://localhost:5000/api/tasks",
        tasksWithDates // 日付情報を含むタスクを送信
      );
      if (response.status === 200) {
        console.log("タスクがデータベースに保存されました");
      }
    } catch (error) {
      console.error("タスク保存エラー:", error);
    }
  };

  watch(() => state.value.tasks, saveTasks, { deep: true });

  const clearInput = () => {
    state.value.newTask = "";
  };

  const deselectAllTasks = () => {
    state.value.selectedTasks = [];
  };

  return {
    addTask,
    removeSelectedTasks,
    saveTasks,
    clearInput,
    deselectAllTasks,
  };
}
