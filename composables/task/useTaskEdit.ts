import type { Ref } from "vue";
import type { TaskState } from "~/types/task";
import axios from "axios"; // axiosをインポートしてAPI呼び出しに使用

export function useTaskEdit(
  state: Ref<TaskState>,
  showToastMessage: (message: string, type: string) => void,
  saveTasks: () => void
) {
  const openEditModal = (index: number) => {
    const pageOffset = (state.value.currentPage - 1) * state.value.tasksPerPage;
    const actualIndex = pageOffset + (index % state.value.tasksPerPage);

    if (actualIndex >= 0 && actualIndex < state.value.tasks.length) {
      state.value.currentEditTaskIndex = actualIndex;
      // 必要に応じてタスクをコピーして編集できるようにする
      state.value.currentEditTask = { ...state.value.tasks[actualIndex] };
      state.value.isEditModalVisible = true;
    }
  };

  const closeEditModal = () => {
    state.value.isEditModalVisible = false;
    state.value.currentEditTask = null; // 編集タスクをリセット
    state.value.currentEditTaskIndex = null; // 編集タスクのインデックスをリセット
  };

  const saveEditTask = async () => {
    if (
      state.value.currentEditTaskIndex !== null &&
      state.value.currentEditTask
    ) {
      const task = state.value.currentEditTask;
      try {
        // サーバーにタスクを更新するAPIリクエストを送信
        const response = await axios.put(
          `http://localhost:5000/api/tasks/${task.id}`, // タスクIDを使ってAPIを更新
          {
            text: task.text,
            completed: task.completed,
            dueDate: task.dueDate, // 編集されたdueDateを送信
          }
        );

        if (response.status === 200) {
          // サーバーから正常に応答があれば、ローカルタスクも更新
          state.value.tasks[state.value.currentEditTaskIndex] = { ...task };
          saveTasks(); // ローカル状態の保存処理
          showToastMessage("タスクが更新されました！", "bg-info");
          closeEditModal();
        } else {
          showToastMessage("タスクの更新に失敗しました", "bg-danger");
        }
      } catch (error) {
        console.error("タスク更新エラー:", error);
        showToastMessage("タスクの更新に失敗しました", "bg-danger");
      }
    } else {
      showToastMessage("タスクの更新に失敗しました", "bg-danger");
    }
  };

  // 緊急度の計算
  const getPriorityColor = (dueDate: string) => {
    const currentDate = new Date();
    const taskDueDate = new Date(dueDate);
    const timeDiff = taskDueDate.getTime() - currentDate.getTime();

    if (timeDiff < 0) {
      return "bg-danger"; // 過ぎた期限
    } else if (timeDiff < 86400000) {
      return "bg-warning"; // 24時間以内
    } else {
      return "bg-success"; // それ以上
    }
  };

  return {
    openEditModal,
    closeEditModal,
    saveEditTask,
    getPriorityColor,
  };
}
