import type { Ref } from "vue";
import type { TaskState } from "~/types/task";

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
      state.value.currentEditTask = { ...state.value.tasks[actualIndex] }; // タスクオブジェクトをコピー
      state.value.isEditModalVisible = true;
    }
  };

  const closeEditModal = () => {
    state.value.isEditModalVisible = false;
    state.value.currentEditTaskIndex = null;
  };

  const saveEditTask = () => {
    if (
      state.value.currentEditTaskIndex !== null &&
      state.value.currentEditTask
    ) {
      const task = state.value.currentEditTask;
      state.value.tasks[state.value.currentEditTaskIndex] = { ...task }; // タスクオブジェクトを更新
      saveTasks();
      showToastMessage("タスクが更新されました！", "bg-info");
      closeEditModal();
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
