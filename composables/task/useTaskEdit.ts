import type { Ref } from 'vue';

export function useTaskEdit(
  tasks: Ref<{ text: string; completed: boolean }[]>,
  currentPage: Ref<number>,
  tasksPerPage: Ref<number>,
  isEditModalVisible: Ref<boolean>,
  currentEditTaskIndex: Ref<number | null>,
  currentEditTask: Ref<string>,
  showToastMessage: (message: string, type: string) => void,
  saveTasks: () => void
) {
  const openEditModal = (index: number) => {
    const pageOffset = (currentPage.value - 1) * tasksPerPage.value;
    const actualIndex = pageOffset + (index % tasksPerPage.value);
    
    if (actualIndex >= 0 && actualIndex < tasks.value.length) {
      currentEditTaskIndex.value = actualIndex;
      currentEditTask.value = tasks.value[actualIndex].text;
      isEditModalVisible.value = true;
    }
  };

  const closeEditModal = () => {
    isEditModalVisible.value = false;
    currentEditTaskIndex.value = null;
  };

  const saveEditTask = () => {
    if (currentEditTaskIndex.value !== null) {
      tasks.value[currentEditTaskIndex.value].text = currentEditTask.value;
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