import type { Ref } from 'vue';
import type { TaskState } from '~/types/task';

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
      state.value.currentEditTask = state.value.tasks[actualIndex].text;
      state.value.isEditModalVisible = true;
    }
  };

  const closeEditModal = () => {
    state.value.isEditModalVisible = false;
    state.value.currentEditTaskIndex = null;
  };

  const saveEditTask = () => {
    if (state.value.currentEditTaskIndex !== null) {
      state.value.tasks[state.value.currentEditTaskIndex].text = state.value.currentEditTask;
      saveTasks();
      showToastMessage("タスクが更新されました！", "bg-info");
      closeEditModal();
    }
  };

  return {
    openEditModal,
    closeEditModal,
    saveEditTask,
  };
} 