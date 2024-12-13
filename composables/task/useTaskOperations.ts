import { watch } from 'vue';
import type { Ref } from 'vue';
import type { TaskState } from '~/types/task';

export function useTaskOperations(
  state: Ref<TaskState>,
  showToastMessage: (message: string, type: string) => void
) {
  const addTask = () => {
    try {
      const trimmedTask = state.value.newTask.trim();
      if (!trimmedTask) return;
      
      if (state.value.tasks.some((task) => task?.text === trimmedTask)) {
        showToastMessage("タスクが重複しています！", "bg-warning");
        return;
      }
      
      state.value.tasks.push({ text: trimmedTask, completed: false });
      state.value.newTask = "";
      saveTasks();
      showToastMessage("タスクが正常に追加されました！", "bg-success");
    } catch (error) {
      console.error('タスク追加エラー:', error);
      showToastMessage("タスクの追加に失敗しました", "bg-danger");
    }
  };

  const removeSelectedTasks = () => {
    const actualIndexes = state.value.selectedTasks.map(selectedIndex => {
      const pageOffset = (state.value.currentPage - 1) * state.value.tasksPerPage;
      return pageOffset + (selectedIndex % state.value.tasksPerPage);
    });

    const sortedIndexes = [...actualIndexes].sort((a, b) => b - a);
    
    for (const index of sortedIndexes) {
      if (index >= 0 && index < state.value.tasks.length) {
        state.value.tasks.splice(index, 1);
      }
    }

    state.value.selectedTasks = [];
    saveTasks();
    showToastMessage("タスクが削除されました！", "bg-danger");
  };

  const saveTasks = () => {
    if (process.client) {
      localStorage.setItem("tasks", JSON.stringify(state.value.tasks));
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