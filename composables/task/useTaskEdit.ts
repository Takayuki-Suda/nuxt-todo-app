import type { Ref } from "vue";
import type { TaskState } from "~/types/task";
import axios, { AxiosError } from "axios"; // AxiosErrorをインポートして型を指定

export function useTaskEdit(
  state: Ref<TaskState>,
  showToastMessage: (message: string, type: string) => void
) {
  const openEditModal = (index: number) => {
    const pageOffset = (state.value.currentPage - 1) * state.value.tasksPerPage;
    const actualIndex = pageOffset + (index % state.value.tasksPerPage);

    if (actualIndex >= 0 && actualIndex < state.value.tasks.length) {
      state.value.currentEditTaskIndex = actualIndex;
      state.value.currentEditTask = { ...state.value.tasks[actualIndex] };
      state.value.isEditModalVisible = true;
    }
  };

  const closeEditModal = () => {
    state.value.isEditModalVisible = false;
    state.value.currentEditTask = null;
    state.value.currentEditTaskIndex = null;
  };

  const saveEditTask = async () => {
    if (
      state.value.currentEditTaskIndex !== null &&
      state.value.currentEditTask
    ) {
      const task = state.value.currentEditTask;

      if (!task.text || !task.details) {
        showToastMessage("テキストと詳細は必須です", "bg-danger");
        return;
      }

      if (!task.id) {
        showToastMessage("タスクIDが存在しません", "bg-danger");
        return;
      }

      try {
        const response = await axios.put(
          `http://localhost:5000/api/tasks/${task.id}`,
          {
            text: task.text,
            completed: task.completed,
            dueDate: task.dueDate,
            details: task.details, // 詳細情報も送信
          }
        );

        if (response.status === 200) {
          state.value.tasks[state.value.currentEditTaskIndex] = { ...task };

          showToastMessage("タスクが更新されました！", "bg-info");
          closeEditModal();
        } else {
          showToastMessage("タスクの更新に失敗しました", "bg-danger");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("タスク更新エラー:", error);
          if (error.response) {
            showToastMessage(
              `エラー: ${error.response.data.message || "更新に失敗しました"}`,
              "bg-danger"
            );
          } else if (error.request) {
            showToastMessage(
              "ネットワークエラー: サーバーからの応答がありません",
              "bg-danger"
            );
          } else {
            showToastMessage("タスクの更新に失敗しました", "bg-danger");
          }
        } else {
          console.error("予期しないエラー:", error);
          showToastMessage("タスクの更新に失敗しました", "bg-danger");
        }
      }
    } else {
      showToastMessage("タスクの更新に失敗しました", "bg-danger");
    }
  };

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
